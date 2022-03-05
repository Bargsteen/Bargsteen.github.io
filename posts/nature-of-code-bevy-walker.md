---
title: "Nature of Code in Bevy: Random Walker"
date: '2022-02-27'
tags: ["nature-of-code-bevy"]
---

Today, I'll start reading and exploring the [Nature of
Code](https://natureofcode.com/) book and the [Bevy Game Engine](https://bevyengine.org/)!
I've been interested in the book for a couple of years and I also completed some of
the first chapters in both [Processing](https://processing.org/) (the Java framework used in the book) and
Haskell.
In my early days at University, I was also a semi-regular follower of [The Coding
Train](https://www.youtube.com/c/TheCodingTrain) YouTube channel, which the
author of the book Daniel Shiffman runs.
As for Bevy, I've looked at it now and again since it came into my awareness a
year ago. I think it is a refreshing new engine and I love the principles they
adhere to.

With the motivation explained, let's move on to the first example from the
introduction chapter: a random walker, which simply is a dot on the screen that
moves around randomly.

## Random Walker
Let us first create a new project and import the most recent version of `bevy` along with
the `rand` crate, which we'll also need.

```toml
# Cargo.toml
[dependencies]
bevy = { version = "0.6" }
rand = "0.8.5"
```

Next, we create a new bevy `App` with the `DefaultPlugins` and run it.
And voila, an empty gray window shows up.
The `DefaultPlugins` add a game loop, a window system, audio and all
sort of things you expect from a game engine.

```rust
use bevy::prelude::*;

fn main() {
    App::new()
        .add_plugins(DefaultPlugins)
        .run();
}
```

Then we need a black dot that can function as our random walker.
At first, I looked at the
[bevy_prototype_lyon](https://github.com/Nilirad/bevy_prototype_lyon) crate, but
I opted for a simpler option: using a sprite.

Let's add the black dot with our first system.
We'll specify the system to run once at startup and
we'll make it spawn an orthographic camera and a sprite with a black circle texture.
The `AssetServer` will look for files in an `/assets` folder by default, so
that's where we'll put the image file `./assets/black-circle.png`.

```rust
use bevy::prelude::*;

fn main() {
    App::new()
        .add_plugins(DefaultPlugins)
        .add_startup_system(startup_system) // <- Also added this line.
        .run();
}

fn startup_system(mut commands: Commands, asset_server: Res<AssetServer>) {
    commands.spawn_bundle(OrthographicCameraBundle::new_2d());
    commands
        .spawn_bundle(SpriteBundle {
            texture: asset_server.load("black-circle.png"),
            ..Default::default()
        });
}
```

Okay, so far so good. But a little boring.
Let's add some random movement.
For this, we'll create our first component, a `Walker` struct, and derive
`Component` for it.
It doesn't need any fields, because it only serves as a marker for the entity.
```rust
#[derive(Component)]
struct Walker;
```

We'll use the `rand` crate and create a `walk` system, which generates two random
numbers and moves the black circle by the random amount.
Take note of the query type `Query<&mut Transform, With<Walker>>`, which
specifies that we want all `Transform` components on entities that also has a
`Walker` component.

```rust
use bevy::prelude::*;
use rand::prelude::*;

fn main() {
    App::new()
        .add_plugins(DefaultPlugins)
        .add_startup_system(startup_system)
        .add_system(walk)
        .run();
}

// fn startup_system(...){...}

fn walk(mut query: Query<&mut Transform, With<Walker>>) {
    let speed = 5.;
    let mut rng = rand::thread_rng();
    let mut walker_transform = query.single_mut();
    walker_transform.translation.x += rng.gen_range(-speed..speed);
    walker_transform.translation.y += rng.gen_range(-speed..speed);
}
```

If you run this, it will crash immediately, because we use `single_mut()` on the
query, which will crash if there is anything other than a single entity that
matches the given query.
At present, our little game has two entities with a `Transform` component.
The camera and the sprite.
But no entities have the `Walker` component yet.
Let's address that.

```rust
...
commands.spawn_bundle(SpriteBundle {
    texture: asset_server.load("black-circle.png"),
    ..Default::default()
}).insert(Walker); // <- Add a Walker component to the SpriteBundle.
...
```

And.. It works!

{% figure "/img/nature-of-bevy/random-walker.gif" "The random walker" %}

## Final thoughts
I tried to trace the path of the walker by _not_ drawing the background at every
frame, similar to what as Daniel Shiffman does in his
example, but I couldn't figure out how to do it in Bevy.
I'll skip it for now, as this is just a warmup exercise to get our feet wet.
Perhaps I'll figure out how to do it once I get deeper into Bevy.

You can see the full example on [GitHub](https://github.com/Bargsteen/nature-of-code-bevy).

I guess that's it for now.
Stay tuned for more Nature of Code in Bevy posts ;)

– Kasper
