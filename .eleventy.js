module.exports = function(eleventyConfig) {
  eleventyConfig.addFilter("min", (...numbers) => {
    return Math.min.apply(null, numbers);
  });

  // Get the first `n` elements of a collection.
  eleventyConfig.addFilter("head", (array, n) => {
    if( n < 0 ) {
      return array.slice(n);
    }

    return array.slice(0, n);
  });

  eleventyConfig.addShortcode("youtube", function(id, caption) {
    return `<figure class="size-3">
              <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden;">
                <iframe src="https://www.youtube.com/embed/${id}"
                  style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border:0;" allowfullscreen
                  title="${caption}"></iframe>
              </div>
              <figcaption>${caption}</figcaption>
            </figure>`;
  });

  eleventyConfig.addShortcode("figure", function(src, caption) {
    return `<figure>
              <img src="${src}" alt="${caption}">
              <figcaption>${caption}</figcaption>
            </figure>`
  });

  eleventyConfig.addPassthroughCopy("img");

  // PostCSS outputs to generated_css. Compilation is slow, but page will update after 5 seconds or so.
  eleventyConfig.addPassthroughCopy({"generated_css": "css"});
}
