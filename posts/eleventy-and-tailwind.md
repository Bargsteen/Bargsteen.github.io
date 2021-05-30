---
title: Rebuilding my blog with Eleventy and TailwindCSS
---

I've been wanting to get back into writing for some time now.
But I was not satisfied with my existing blog built using [Hugo](https://gohugo.io/) and basic CSS.
So I decided to rebuild my blog using [Eleventy](https://11ty.dev/) and
[TailwindCSS](https://tailwindcss.com/) and write about it.

There were three primary problems I wanted to address:
 1. I wanted a simpler setup than I had with Hugo in terms of configuration and
    folder structure.
 2. I wanted a setup that I could easily extend to eventually show off my
    photos and music in a nice way. While Hugo has a decent ecosystem, I found
    it lacking for my needs.
 3. I wanted to change parts of the design but dreaded using CSS, especially
    extending my old CSS.

Let's look at the tools I decided to use to solve these problems.

## Eleventy

Let's start with the first problem.
I stumbled upon Eleventy and was immediately intrigued by its simplicity.
One of my favourite design principles is that simple things should be simple, and
complex things should only be as complex as they are themselves.
In other words, we want to [avoid accidental complexity](https://en.wikipedia.org/wiki/No_Silver_Bullet).

Eleventy hits the mark by its tweetable setup:

```shell
npm install -g @11ty/eleventy
echo '# Page header' > README.md
eleventy
```

In comparison, the basic setup for Hugo involves multiple folders and files which
confused me every time I would come back after a long hiatus.
With Eleventy, the structure is only as complex as you need it to be.

Let's address the second problem.
Eleventy is built in Javascript and thereby comes with a large ecosystem
targeted for the web.
While I haven't started experimenting with the relevant plugins, it seems like
there are ample options to choose from.

## Tailwind CSS

The third and final problem relates to CSS.
I had written the CSS for the previous iteration of my blog myself, but I did
not particularly like the process.
The traditional approach to CSS quickly becomes an intertangled mess unless you
really know what you are doing.
With the reuse of complex classes and cascading effects, it reminds of writing
effectful object-oriented code with inheritance hierarchies.
Something which I've left behind a long time ago (and for good reason) now that
I mostly work in Haskell and Rust.

Since creating the last iteration of my blog, I've been introduced to
utility-first CSS "frameworks" such as [Tachyons](https://tachyons.io/) and
[TailwindCSS](https://tailwindcss.com/), and I found them to be quite intriguing (I
decided to go with Tailwind as it is more polished, but Tachyons has some unique
ideas on its own).
The basic idea with these frameworks is that each class has a *single* function or
utility, which you combine to get the desired styling by adding them to an HTML element.
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
Since you only work in HTML, you have fewer *context switches*, each of which is
detrimental to your productivity.
Every time you switch from HTML to CSS or back your brain has to adjust, which
uses up its scarce resources.

### Double compositioning / composition confusion
With traditional CSS I often find myself thinking:

- "Should this element have multiple classes on it, or should I create a new
class that encompasses all the parts I need?"
- "Will I reuse this new class elsewhere?"
- "What should I name this new class?"

The primary problem is that there are *two* places in which design elements can be
composed: in CSS *and* HTML.

With utility-based CSS frameworks, the decision between composing in CSS and
HTML disappears and so does the naming problem.
Again, this helps with your productivity by reducing the noise of unnecessary
decisions.

### Sane defaults and plugins
There are a lot of different ways to achieve the same things in CSS.
Choosing the "best" approach requires some research.
For example, should I use `px`, `em`, `rem`?
Tailwind comes with sane defaults to most of these questions.
This frees up your mind to simply think about how it looks.

And if Tailwind doesn't offer a solution, there are [lots of
plugins](https://www.telerik.com/blogs/top-15-tailwind-css-plugins-resources/)
you can reach for, which might.

### Dark mode
With Tailwind, having a dark and light mode of your website is a breeze.
You simply add a `dark:` prefix to classes you want to be applied in dark mode.
For example, this button is black with white text in light mode, and white with
black text in dark mode. Easy.
``` html
<button class="bg-black dark:bg-white
               text-white dark:text-black
               p-2">
  Click me!
</button>
```

## Workflow improvements with Eleventy
What follows is a bag of tips and tricks that I found or created for this website.
Feel free to be inspired (or tell me why my solution sucks ;D).

### Reloading page on PostCSS compilations
Tailwind recommends the use of [PostCSS](https://postcss.org).
I added default classes for the HTML elements generated from the post files
written in markdown.
While developing the design, I wanted changes to the PostCSS file to cause the page in
the browser to reload, so that I could see the effect.
You can get Eleventy to watch for file changes and automatically rebuild your
site, but watching the PostCSS file did not work.
The reason was that Eleventy would reload the site *before* the PostCSS compiler
could finish generating the new CSS.

My solution was to make Eleventy watch for changes in generated CSS:

**Step 1:** To run PostCSS along with Eleventy, with both of them watching and
rebuilding your site automatically, add this start script to your `package.json`:

```json
...
"scripts": {
  "start": "eleventy --serve & postcss pcss/tailwind.pcss --o generated_css/style.css --watch --verbose"
}
...
```
This puts the generated CSS into `generated_css/style.css`.

**Step 2:** We don't want to include generated content in our git repository, so
add the folder to your `.gitignore`:
```gitignore
# PostCSS output
generated_css/
```

**Step 3:** By default, Eleventy does not watch files listed in your
`.gitignore`, but we can disable that behavior in `.eleventy.js`.
While we're at it, we will also tell Eleventy to copy the generated CSS folder
into our site:
```javascript
module.exports = function (eleventyConfig) {
  eleventyConfig.setUseGitIgnore(false);
  eleventyConfig.addPassThroughCopy({ "generated_css": "css" });
}
```

**Step 4:** With the change in the ignore behaviour, Eleventy will suddenly start
compiling *any* markdown files it finds. Including the ones from
`node_modules/`.
Luckily, Eleventy also ignores files listed in `.eleventyignore`.
Create the file and add the following:
```gitignore
README.md
node_modules/
_site/
```

And that's it!

### Drafts
I wanted to have a draft feature similar to the one in Hugo, where you can add
`draft: true` to the front matter of posts to mark them as drafts.
Drafts are then excluded when building the site unless you add a special flag.
Inspired by [this blog post](https://giustino.blog/how-to-drafts-eleventy/
), I created my solution, but with one extra feature: a toggle for
including/excluding the drafts.

In your `.eleventy.js` file add the following (assuming your posts are located
in `posts/`):

```javascript
const includeDrafts = true; // Toggle this to include/exclude drafts in development mode.
const isDevelopment = !process.env.ELEVENTY_PRODUCTION;
const postsToShow = (post) => isDevelopment && includeDrafts || !post.data.draft;

eleventyConfig.addCollection("posts", function(collectionApi) {
  return collectionApi.getFilteredByGlob("posts/*.md")
                      .filter(postsToShow);
});

```

By toggling the `includeDrafts` variable, you decide whether drafts, i.e. posts
with `draft: true`, should be included when in development mode.

## Outro

I've been quite satisfied with my choice of stack and I am looking forward to
making tweaks and improvements as I go.

Feel free to [take a look at the source code for my website on GitHub.](https://github.com/bargsteen/bargsteen.com)

Or look at the resources I used:
  - [Build your own Blog from Scratch using Eleventy](https://www.filamentgroup.com/lab/build-a-blog/)
  - [A basic blog template in Eleventy](https://github.com/11ty/eleventy-base-blog)
  - [Build a blog with Eleventy and TailwindCSS](https://stubborncode.com/posts/build-a-blog-with-eleventy-and-tailwindcss-part-1/)

Until next time,

— Kasper
