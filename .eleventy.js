module.exports = function(eleventyConfig) {
  eleventyConfig.addWatchTarget("./pcss/tailwind.pcss");
  // eleventyConfig.setWatchThrottleWaitTime(5000); // in milliseconds

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

}
