this["content/frontend/default/directives/stick_to_footer"] = this["content/frontend/default/directives/stick_to_footer"] || {};
this["content/frontend/default/directives/stick_to_footer"].js = (function (exports) {
  'use strict';

  var NAV_INLINE_BREAKPOINT = 1100;
  var NAV_TOP_MARGIN = 55;

  var isTouchingBottom = function isTouchingBottom(height, offsetHeight) {
    if (window.innerWidth < NAV_INLINE_BREAKPOINT) {
      return false;
    }

    return offsetHeight <= window.scrollY + height;
  };

  var getTopOffset = function getTopOffset(height, offsetHeight) {
    if (isTouchingBottom(height, offsetHeight)) {
      return offsetHeight - (window.scrollY + height);
    }

    return 0;
  };

  var StickToFooter = {
    bind: function bind(el, _ref) {
      var value = _ref.value;
      var contentHeight;
      var mainEl = document.querySelector(value);

      el.$_stickToFooter_listener = function () {
        if (!contentHeight) {
          contentHeight = el.getBoundingClientRect().height + NAV_TOP_MARGIN;
        }

        var offsetHeight = mainEl.offsetHeight;
        var topOffset = getTopOffset(contentHeight, offsetHeight);
        el.style.top = topOffset < 0 ? "".concat(topOffset, "px") : '';
      }; // When we scroll down to the bottom, we don't want the footer covering
      // the TOC list (sticky behavior)


      document.addEventListener('scroll', el.$_stickToFooter_listener, {
        passive: true
      });
    },
    unbind: function unbind(el) {
      el.style.top = '';
      document.removeEventListener('scroll', el.$_stickToFooter_listener);
    }
  };

  exports.StickToFooter = StickToFooter;

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;

})({});
