---
title: Rebuilding my blog with 11ty and TailwindCSS
draft: true
---

<!-- ## Outline -->
<!-- Why Eleventy -->
<!--   - For fun -->
<!--   - Wanted to change things more easily -->
<!--   - Love the simplicity: tweetable setup -->
<!--   - Later: experiences -->

<!-- Why TailwindCSS -->
<!--   - Tachyons but more developed -->
<!--   - Functional/utility -->
<!--   - Better building blocks -->
<!--   - No need for double collections (especially true for component-based, e.g. react) -->
<!--   - Fewer context switches -->

<!-- Hacks: -->
<!--   - start script and watching generated CSS -->
<!--     - Context: automatic classes added to markdown -->
<!--     - gitignore fix -->
<!--   - drafts -->



<!-- ## Post -->

I've been wanting to get back into writing for a while now.
While I already had a functioning blog built with Hugo and basic CSS, I took the opportunity to
rebuild my blog with [11ty](11ty.dev) and [TailwindCSS](tailwindcss.com).
There were a few reasons for doing so:
 1. I wanted a simpler setup than I had with Hugo in terms of configuration and
    folder structure.
 2. I wanted a setup which I could easily extend and eventually show off my
    photos in a nice way. Hugo had some plugins for handling photos and albums,
    but I found all of them lacking in one way or another.
 3. I wanted to change parts of the design but dreaded using CSS, especially
    extending my old CSS.

## Reasons for Eleventy

*Addressing reason 1.:*
I stumbled upon Eleventy and was immediately intrigued by its simplicity.
One of my favorite design principles is that simple things should be simple, and
complex things should only be as complex as they are themselves.
In other words, ignoring [accidental complexity](TODO).

Eleventy hits the mark by its tweetable setup:

TODO: Insert screenshot of tweet.

In comparison, the basic setup for Hugo involves multiple folders, files which
confused me every time I would come back after a longer hiatus.

*Addressing reason 2.*
Eleventy is built in Javascript and thereby comes with a large ecosystem
targeted for the web.
I quickly found some good options for dealing with photos and albums.

## Reasons for Tailwind CSS

The third and final problem relates to CSS.
I had written the CSS for the previous iteration of my blog myself, but I did
not particularly like the process.
The traditional approach to CSS quickly becomes a intertangled mess unless you
really know what you are doing.
Along with the cascading effects, it reminds me of writing object-oriented code
with side effects.
Something which I've left behind a long time ago now that I mostly work in
Haskell and Rust.

Since creating the last iteration of my blog, I've been introduced to
utility-first CSS "frameworks" such as (Tachyons)[TODO] and
(TailwindCSS)[tailwindcss.com], and I found them to be quite intriguing (I
decided to go with Tailwind as it is more polished, but Tachyons has some unique
ideas on its own).
The basic idea with these frameworks is that each class has a single function or
utility and that you then add multiple classes to a HTML element to the desired
styling.
The way I see it is that you move the composition of design elements from CSS to
HTML.
So instead of:
``` css
.btn {
  background-color: black;
  color: white;
  padding: 0.5rem;
}
/* <button class="btn">Click me!</button> */
```

You do:

``` html
<!-- Tailwind CSS -->
<button class="bg-black text-white p-2">Click me!</button>
```

So why is this preferable?

### Context switching
Since you only work in HTML, you have fewer *context switches*, which are
detrimental to your productivity.
Every time you switch from HTML to CSS or back your brain has to adjust, which
uses up its precious, limited energy.

### Double compositioning / composition confusion
With traditional CSS, I often find myself thinking:

- "Should this element have multiple classes on it, or should I create a new
class which encompasses all the parts I need?"
- "Will I reuse this new class elsewhere?"
- "What should I name this new class?"

The problem is that there are *two* places in which design elements can be
composed: in CSS *and* in HTML.
If you use a component-based Javascript framework such as React, then there is
actually three: CSS, HTML, and components.

With utility-based CSS frameworks, the decision between composing in CSS and
HTML disappears.
Again, this helps with your productivity by reducing the noise of unnecessary
decisions.

### Sane defaults
There are a lot of different ways to achieve the same things in CSS.
Choosing the "best" approach requires some research.
For example, should I use `px`, `em`, `rem`?
Tailwind comes with sane defaults to most of these questions.
This frees up your mind to simply think about how it looks.

### Dark mode
With Tailwind, having a dark and light mode of your website a breeze.
You simply add a `dark:` prefix to classes you want applied in dark mode.
This button is black with white text in light mode, and white with black text in
dark mode. Easy.
``` html
<button class="bg-black dark:bg-white
               text-white dark:text-black
               p-2">
  Click me!
</button>
```

## Workflow improvements with Eleventy
What follows is a bag of tips and tricks that I found or created for the purpose
of this website.
Feel free to be inspired (or tell me why my solution is laughable ;D).

### Reloading page on PostCSS compilations
Tailwind recommends the use of [PostCSS](http://postcss.org).
I added default classes for the HTML elements generated from the post files
written in markdown.
While developing design, I wanted changes the PostCSS file to cause the page in
the browser to reload, so that I could see the effect.

This was my solution:
  1. Add this start script to your `package.json`:

     ```json
     ...
     "scripts": {
       "start": "eleventy --serve & postcss pcss/tailwind.pcss --o generated_css/style.css --watch --verbose"
     }
     ...
     ```
     This causes eleventy and postcss to automatically watch and rebuild your
     site.

  2. Add `generated_css` to your `.gitignore` file as you don't want to track
     the generated files.

  3. Eleventy does not watch files listed in `.gitignore`, so you need to add
     the following to `.eleventy.js`:
     ```javascript
     module.exports = function (eleventyConfig) {
       eleventyConfig.setUseGitIgnore(false);
       eleventyConfig.addPassThroughCopy({ "generated_css": "css" });
     }
     ```

   4. Create the file `.eleventyignore`, since we are no longer just using the
      gitignore for deciding what to compile:
      ```gitignore
      README.md
      node_modules/
      _site/
      ```

Now, is this the best solution?
Probably not, but it works quite well.
Only problem is that the postcss compiler takes a few seconds on my machine with
every change.
But that only affects changes to styling of the markdown.


### Drafts
I wanted to have a draft feature similar to the one in Hugo, where you can add
`draft:true` to its preamble to make it a draft.
And then it won't be included when compiling the site, unless you add a special
flag.
My solution is inspired by TODO, but it has an additional option for including
the drafts.

In your `.eleventy.js` file add the following (assuming your posts are located
in `posts/`):

```javascript
  const includeDrafts = true; // Toggle this to include/exclude drafts.
  const postsToShow = (post) => includeDrafts || !post.data.draft;

  eleventyConfig.addCollection("posts", function(collectionApi) {
    return collectionApi.getFilteredByGlob("posts/*.md")
                        .filter(postsToShow);
  });

```

By toggling the `includeDrafts` variable, you decide whether drafts should be
included in the build.

## Outro

I've been quite satisfied with my choice of stack and I am looking forward to
making tweaks and improvements as I go.

[Look at the source code for my website on GitHub.](https://github.com/bargsteen/bargsteen.com)

Thanks to guides:
  - https://github.com/11ty/eleventy-base-blog
  - https://giustino.blog/how-to-drafts-eleventy/
  - https://www.filamentgroup.com/lab/build-a-blog/
  - [stubborncode](https://stubborncode.com/posts/build-a-blog-with-eleventy-and-tailwindcss-part-1/)

Until next time

— Kasper
