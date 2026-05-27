(function() {
  function install(opts) {
    var container = document.querySelector(opts.filterContainer);
    var posts = document.querySelectorAll(opts.postSelector);
    var maxVisible = opts.maxVisible || Infinity;
    var stagger = opts.staggerSeconds || 0.06;
    var syncUrl = !!opts.syncUrl;

    function apply(tag, retrigger) {
      var shown = 0;
      posts.forEach(function(post) {
        var matches = tag === 'all' || post.getAttribute('data-tags').split(',').indexOf(tag) !== -1;
        if (matches && shown < maxVisible) {
          post.style.display = '';
          if (retrigger) {
            post.style.animation = 'none';
            void post.offsetWidth;
            post.style.animation = '';
            post.style.animationDelay = (shown * stagger) + 's';
          }
          shown++;
        } else {
          post.style.display = 'none';
        }
      });

      if (syncUrl) {
        var url = new URL(window.location);
        if (tag === 'all') url.searchParams.delete('tag');
        else url.searchParams.set('tag', tag);
        history.replaceState({}, '', url);
      }
    }

    function setActive(btn) {
      container.querySelectorAll('.tag-filter-btn').forEach(function(b) {
        b.classList.remove('active');
      });
      btn.classList.add('active');
    }

    container.addEventListener('click', function(e) {
      var btn = e.target.closest('.tag-filter-btn');
      if (!btn || !container.contains(btn)) return;
      setActive(btn);
      apply(btn.dataset.tag, true);
    });

    if (syncUrl) {
      var activeTag = new URLSearchParams(window.location.search).get('tag');
      if (activeTag) {
        var btn = container.querySelector('[data-tag="' + activeTag + '"]');
        if (btn) {
          setActive(btn);
          apply(activeTag, true);
          return;
        }
      }
    }
    apply('all', false);
  }

  window.TagFilter = { install: install };
})();
