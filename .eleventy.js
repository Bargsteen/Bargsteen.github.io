const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

module.exports = function (eleventyConfig) {

  eleventyConfig.addPlugin(syntaxHighlight);

  eleventyConfig.addFilter("min", (...numbers) => {
    return Math.min.apply(null, numbers);
  });

  eleventyConfig.addFilter("toThreeLetterMonth", n => {
    switch(n) {
      case 0: return "Jan";
      case 1: return "Feb";
      case 2: return "Mar";
      case 3: return "Apr";
      case 4: return "May";
      case 5: return "Jun";
      case 6: return "Jul";
      case 7: return "Aug";
      case 8: return "Sep";
      case 9: return "Oct";
      case 10: return "Nov";
      case 11: return "Dec";
      default: return `${n}`;
    }
  });

  // Get `n` elements of a collection. Use negative `n` to take from the end.
  eleventyConfig.addFilter("excerpt", (content) => {
    if (!content) return "";
    const text = content
      .replace(/<[^>]+>/g, ' ')
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    const limit = 200;
    return text.length > limit ? text.slice(0, limit).trim() + '…' : text;
  });

  eleventyConfig.addFilter("take", (array, n) => {
    if (n < 0) {
      return array.slice(n);
    }

    return array.slice(0, n);
  });

  // Filter to get content tags (excluding structural ones)
  const structuralTags = new Set(["posts", "misadventures", "all", "nav", "post", "tagList"]);
  eleventyConfig.addFilter("contentTags", (tags) => {
    if (!tags) return [];
    return tags.filter(tag => !structuralTags.has(tag));
  });

  // Pretty tag name filter
  eleventyConfig.addFilter("tagDisplay", (tag) => {
    const map = {
      "ai": "AI",
      "software-engineering": "Software Engineering",
      "fsharp": "F#",
      "dotnet": ".NET",
      "rust": "Rust",
      "gamedev": "Game Dev",
      "web-dev": "Web Dev",
      "travel": "Travel",
      "music": "Music",
      "testing": "Testing",
      "leadership": "Leadership",
      "writing": "Writing",
      "go": "Go",
    };
    return map[tag] || tag;
  });

  // Related posts filter: finds posts sharing tags with the current post
  // Usage: collections.posts | relatedPosts(page.url, tags)
  eleventyConfig.addFilter("relatedPosts", (collection, pageUrl, pageTags) => {
    const postTags = (pageTags || []).filter(t => !structuralTags.has(t));
    if (postTags.length === 0) return [];

    const scored = collection
      .filter(p => p.url !== pageUrl)
      .map(p => {
        const pTags = (p.data.tags || []).filter(t => !structuralTags.has(t));
        const shared = postTags.filter(t => pTags.includes(t)).length;
        return { post: p, shared };
      })
      .filter(s => s.shared > 0)
      .sort((a, b) => b.shared - a.shared || b.post.date - a.post.date);

    return scored.slice(0, 3).map(s => s.post);
  });

  // Collect all unique content tags across published posts
  eleventyConfig.addCollection("tagList", function(collectionApi) {
    const includeDrafts = true;
    const isDevelopment = !process.env.ELEVENTY_PRODUCTION;
    const showPost = (post) => isDevelopment && includeDrafts || !post.data.draft;
    const tagSet = new Set();
    collectionApi.getFilteredByGlob("posts/*.md").filter(showPost).forEach(post => {
      (post.data.tags || []).forEach(tag => {
        if (!structuralTags.has(tag)) {
          tagSet.add(tag);
        }
      });
    });
    return [...tagSet].sort();
  });

  eleventyConfig.addShortcode("youtube", function (id, caption) {
    const video = `<div class="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-md border border-base-300">
                   <iframe src="https://www.youtube.com/embed/${id}"
                     frameborder="0"
                     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                     allowfullscreen
                    title="${caption}"></iframe>
                 </div>`;
    return figureWithCaption(video, caption, "");
  });

  eleventyConfig.addShortcode("currentYear", () => `${new Date().getFullYear()}`);

  eleventyConfig.addShortcode("figure", function (src, caption) {
    const img = `<img class="mx-auto" src="${src}" alt="${caption}">`;

    // Add the 'table' class to make img and figcaption to be same width.
    return figureWithCaption(img, caption, "table");
  });

  eleventyConfig.addPassthroughCopy({"img": "img",
                                     "prims_css": "css",
                                     // Files related to my project with University of Southern Denmark.
                                     "sdu": "sdu",
                                     // PostCSS outputs to generated_css.
                                     // Compilation is slow, but page will update after 5 seconds or so.
                                     "generated_css": "css",
                                     "CNAME": "CNAME" // CNAME file used by github pages.
                                     });

  eleventyConfig.setUseGitIgnore(false);

  // Toggle inclusion of drafts
  const includeDrafts = true;
  const isDevelopment = !process.env.ELEVENTY_PRODUCTION;
  const postsToShow = (post) => isDevelopment && includeDrafts || !post.data.draft;

  eleventyConfig.addCollection("posts", function(collectionApi) {
    return collectionApi.getFilteredByGlob("posts/*.md")
                        .filter(postsToShow);
  });
}

function figureWithCaption(child, caption, extraFigureClasses) {
    return `<figure class="figure-styled max-w-4xl mx-auto center mt-8 mb-8 ${extraFigureClasses}">
              ${child}
              <figcaption class="mx-auto text-center text-sm italic text-base-content/50 pt-3 mt-0">${caption}</figcaption>
            </figure>`
}
