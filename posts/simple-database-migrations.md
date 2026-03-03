---
title: A simple database migration system in F#
date: '2026-03-03'
---

At work we needed a simple system for handling database migrations.
Something that was trivial to understand and see that it was correct.
While [FluentMigrator](https://fluentmigrator.github.io) could have been a viable option, it seemed overkill to pull in a large framework with its own runner for the type of project I was working on.
I knew that we would only be needing a handful of migrations and for that we could build something simpler.

What we ended up with was a migration table in the database, a list of migrations in the code, and four functions.
The system has been running in production for half a year.

Let's see how it works.

I use [PostgreSQL](https://postgresql.org/) with [Npgsql](https://www.npgsql.org/) here, but the same idea can be applied with any database and database driver.

A migration is represented by a unique version number, a name and the SQL script.

```fsharp
type private MigrationName = string
type private MigrationScript = string
type private Migration =
    { Version: int
      Name: MigrationName
      Script: MigrationScript }

```

The script part is plain SQL, so a migration looks like this:

```fsharp
let private migration1: Migration =
    { Version = 1
      Name = "RemoveStartDateColumnsFromImportQueues"
      Script =
        """
            ALTER TABLE account_historical_import_queue DROP COLUMN IF EXISTS account_start_date;
            ALTER TABLE depository_historical_import_queue DROP COLUMN IF EXISTS depository_start_date;
        """ }
```


A table called `migrations` keeps track of which migrations have already been applied.

```fsharp
let private ensureMigrationsTableExists (conn: ConnectionString) : Task<Result<unit, DbError>> =
    withDbErrorHandling (fun () ->
        task {
            do!
                conn
                |> ConnectionString.toString
                |> Sql.connect
                |> Sql.query
                    """
                    CREATE TABLE IF NOT EXISTS migrations (
                        version INTEGER PRIMARY KEY,
                        name TEXT NOT NULL,
                        applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
                    );
                    """
                |> Sql.executeNonQueryAsync
                |> Task.ignore

            logger.Information "Ensured migrations table exists"
        })
```

This function fetches all the applied migrations:

```fsharp
/// Gets the list of applied migration versions
let private getAppliedMigrations (conn: ConnectionString) : Task<Result<List<int>, DbError>> =
    withDbErrorHandling (fun () ->
        task {
            let! result =
                conn
                |> ConnectionString.toString
                |> Sql.connect
                |> Sql.query "SELECT version FROM migrations ORDER BY version"
                |> Sql.executeAsync (fun read -> read.int "version")

            return result
        })
```

Applying a migration is a two-step process that runs transactionally.
First apply the migration script, then update the migrations table with the new row.

```fsharp
/// Applies a single migration within a transaction to ensure atomicity.
let private applyMigration (connStr: ConnectionString) (migration: Migration) : Task<Result<unit, DbError>> =
    withDbErrorHandling (fun () ->
        task {
            logger.Information("Applying migration {Version}: {Name}", migration.Version, migration.Name)

            use conn = new NpgsqlConnection(ConnectionString.toString connStr)
            do! conn.OpenAsync()
            use! tx = conn.BeginTransactionAsync()

            do!
                conn
                |> Sql.existingConnection
                |> Sql.query migration.Script // Apply the migration
                |> Sql.executeNonQueryAsync
                |> Task.ignore

            do!
                conn
                |> Sql.existingConnection
                |> Sql.query
                    """
                    INSERT INTO migrations (version, name)
                    VALUES (@version, @name);
                    """
                |> Sql.parameters [ "version", migration.Version |> Sql.int; "name", migration.Name |> Sql.text ]
                |> Sql.executeNonQueryAsync
                |> Task.ignore

            do! tx.CommitAsync()

            logger.Information("Successfully applied migration {Version}: {Name}", migration.Version, migration.Name)
        })
```

I keep all the migrations as a list directly in the code.
There is no special handling for the initial schema.
It is just migration zero.

```fsharp
let private allMigrations: List<Migration> =
    [ migration0
      migration1
    ]
```

When starting the application, we ensure that `allMigrations` have been applied.
As an extra safety precaution, we check whether any duplicate migrations have been applied and terminate early in that case (step 3).

```fsharp
let private ensureMigrationsApplied
    (connectionString: ConnectionString)
    (migrations: List<Migration>)
    : Task<Result<unit, DbError>> =
    taskResult {
        // Step 1: Always ensure migrations table exists first (safe to run multiple times)
        do! ensureMigrationsTableExists connectionString

        // Step 2: Get applied migrations
        let! appliedVersions =
            getAppliedMigrations connectionString
            |> TaskResult.teeError (fun err -> logger.Error("Error getting applied migrations: {Error}", err))

        // Step 3: Check that no duplicate migrations exist.
        let appliedSet = appliedVersions |> Set.ofList

        if appliedVersions <> (appliedSet |> Set.toList) then
            return! Error(DbError.MigrationError "Duplicate entries found in migrations table")

        logger.Information("Migrations already applied: {AppliedVersions}", appliedSet |> Set.map string)

        // Step 4: Find pending migrations
        let pendingMigrations =
            migrations |> List.filter (fun m -> not (appliedSet.Contains m.Version))

        // Step 5: Apply each pending migration
        if pendingMigrations |> List.isEmpty then
            logger.Information "No pending migrations found"
        else
            logger.Information("Found {Count} pending migrations", pendingMigrations.Length)

            do!
                pendingMigrations
                |> List.sortBy _.Version
                |> List.traverseTaskResultM (fun migration -> applyMigration connectionString migration)
                |> TaskResult.ignore

            logger.Information "All migrations completed successfully"
    }
```

This system works very well in practice and I can understand every part of it.
It doesn't have an advanced rollback mechanism, but you can apply an extra migration that reverses a previous one, if the data is available to do so.
There isn't any consistency checks that ensures the migration scripts are unaltered either, but since the migrations live in the codebase, any tampering would show up during code review.

All in all, I am quite satisfied by the simplicity and elegance.
