const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

module.exports = function (eleventyConfig) {

  eleventyConfig.addPlugin(syntaxHighlight);

  eleventyConfig.addFilter("min", (...numbers) => {
    return Math.min.apply(null, numbers);
  });

  // Get `n` elements of a collection. Use negative `n` to take from the end.
  eleventyConfig.addFilter("take", (array, n) => {
    if (n < 0) {
      return array.slice(n);
    }

    return array.slice(0, n);
  });

  eleventyConfig.addShortcode("youtube", function (id, caption) {
    const video = `<div class="aspect-w-16 aspect-h-9">
                   <iframe src="https://www.youtube.com/embed/${id}"
                     frameborder="0"
                     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                     allowfullscreen
                    title="${caption}"></iframe>
                 </div>`;
    return figureWithCaption(video, caption, "");
  });

  eleventyConfig.addShortcode("figure", function (src, caption) {
    const img = `<img class="mx-auto" src="${src}" alt="${caption}">`;

    // Add the 'table' class to make img and figcaption to be same width.
    return figureWithCaption(img, caption, "table");
  });

  eleventyConfig.addPassthroughCopy("img");

  // PostCSS outputs to generated_css. Compilation is slow, but page will update after 5 seconds or so.
  eleventyConfig.addPassthroughCopy({ "generated_css": "css" });

  eleventyConfig.addPassthroughCopy({ "prism_css": "css" });

  eleventyConfig.setUseGitIgnore(false);
}

function figureWithCaption(child, caption, extraFigureClasses) {
    return `<figure class="max-w-4xl mx-auto center mt-8 mb-8 ${extraFigureClasses}">
              ${child}
              <figcaption class="mx-auto text-center text-white p-2 text-sm italic bg-gray-800 dark:bg-gray-900 border-solid rounded-b">${caption}</figcaption>
            </figure>`
}
