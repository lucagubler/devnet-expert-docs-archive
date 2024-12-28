(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var hasCommentAnchor = window.location.hash.includes('#comment-');

    if (hasCommentAnchor) {
      window.loadDisqus();
    }
  });

})();
