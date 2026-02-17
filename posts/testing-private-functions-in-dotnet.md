---
title: Testing private functions in .NET
date: '2026-02-20'
---

At University we were told to always test our code but also to hide complexity using the `private` keyword.
I found these two dogmas incongruent as it forced me to either make a function `public` just to test it,
or write a complex test of the `public` function that used the inner `private` one.
Neither option pleased me.

After University I got a job where I was lucky enough to work primarily in Rust.
In Rust, it is not only easy to test `private` functions but also encouraged by the community.
The tests live inside the same module as the `private` functions.
Some find this invasive, but I quite like that things that belong together stay together.
When I later switched to .NET, I wanted the same thing.
The typical .NET answer is to mark functions `internal` and use `[InternalsVisibleTo]` to expose them to a test project.
I find this unsatisfying: `internal` functions are discoverable by everything in the same project, which increases the surface area of each module and invites unnecessary coupling.

After a few attempts, I found a way to test truly `private` functions.
The technique is surprisingly simple and even uses a pattern very similar to how you do it in Rust.

## Test private functions in F#

In the same project where your code lives, add the following to your `.fsproj` file:

```xml
  <ItemGroup Condition="'$(Configuration)'=='Debug'">
    <PackageReference Include="Your.Preferred.Test.Lib" Version="1.2.3">
      <PrivateAssets>all</PrivateAssets>
    </PackageReference>
  </ItemGroup>
```

This adds a conditional set of dependencies that are only included in `Debug` builds.
If you're testing `private` functions in a library, it is important to add the `<PrivateAssets>all</PrivateAssets>`, such that consumers of the library don't get the testing libraries as transient dependencies.

We use [Expecto](https://github.com/haf/expecto), so for us the following set of packages are required:
```xml
  <ItemGroup Condition="'$(Configuration)'=='Debug'">
    <PackageReference Include="Expecto" Version="10.2.3">
      <PrivateAssets>all</PrivateAssets>
    </PackageReference>
    <PackageReference Include="YoloDev.Expecto.TestSdk" Version="0.14.3">
      <PrivateAssets>all</PrivateAssets>
    </PackageReference>
    <PackageReference Include="Microsoft.NET.Test.Sdk" Version="17.13.0">
      <PrivateAssets>all</PrivateAssets>
    </PackageReference>
  </ItemGroup>
```

`Microsoft.NET.Test.SDK` is needed for any .NET test project, `Expecto` is our preferred testing library, and `YoloDev.Expecto.TestSdk` glues those two together so we can use `dotnet test` to run the tests.

Then write tests for your `private` functions:

```fsharp
module MyModule

let private add (x: int) (y: int) = x + y

#if DEBUG

open Expecto

[<Tests>]
let test =
    testList "MyModule" [
        test "add 2 2 = 4" {
            let result = add 2 2
            Expect.equal result 4 "Should have been 4"
        }
    ]
#endif
```

Notice that the `test` variable itself unfortunately has to be `public` if using Expecto, due to how it discovers tests.
With xUnit in C#, the test method itself can also be `private`.

Finally, you run the tests directly in your library or executable project with `dotnet test`.

### Fable

If you are using [Fable](fable.io) to compile to JavaScript, then you'll have to ensure that it won't try to compile the
tests and testing libraries with Fable, as that will fail.

You thus have to extend the conditional in the `.fsproj` to:

```xml
    <ItemGroup Condition="'$(Configuration)'=='Debug' and '$(FABLE_COMPILER)'!='true'">
```

And extend the compiler directive above your tests to:

```fsharp
#if DEBUG && !FABLE_COMPILER
```

## Testing private functions in C#

It is nearly the same story in C#, except that the test functions exist inside the class it is testing, instead of at the module level.
Start by conditionally adding the test libraries to your `.csproj` file:

```xml
  <ItemGroup Condition="'$(Configuration)'=='Debug'">
    <PackageReference Include="xunit" Version="2.9.*">
      <PrivateAssets>all</PrivateAssets>
    </PackageReference>
    <PackageReference Include="xunit.runner.visualstudio" Version="3.0.*">
      <PrivateAssets>all</PrivateAssets>
    </PackageReference>
    <PackageReference Include="Microsoft.NET.Test.Sdk" Version="17.*">
      <PrivateAssets>all</PrivateAssets>
    </PackageReference>
  </ItemGroup>
```

Then add the tests inside the same class as the `private` functions:

```csharp
public class MyModule
{
    private static int Add(int x, int y) => x + y;

#if DEBUG
    [Xunit.Fact]
    private void Add_returns_correct_sum()
    {
        var result = Add(2, 2);
        Xunit.Assert.Equal(4, result);
    }
#endif
}
```

And that's really all there is to it.
No `[InternalsVisibleTo]`, no extra test projects mirroring your source tree, and no compromises on encapsulation.
Things that belong together stay together.
