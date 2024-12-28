this["content/frontend/shared/dom"] = this["content/frontend/shared/dom"] || {};
this["content/frontend/shared/dom"].js = (function (exports) {
  'use strict';

  /* global $ */

  /**
   * Returns outerHeight of element **even if it's hidden**
   *
   * NOTE: Uses jQuery because there is no trivial way to do this in
   * vaniall JS, and it's nice that jQuery has a reliable out-of-the-box
   * solution.
   *
   * @param {Element} el
   */
  var getOuterHeight = function getOuterHeight(el) {
    return $(el).outerHeight();
  };
  /**
   * Find the first child of the given element with the given tag name
   *
   * @param {Element} el
   * @param {String} tagName
   * @returns {Element | null} Returns first child that matches the given tagName (or null if not found)
   */

  var findChildByTagName = function findChildByTagName(el, tagName) {
    return Array.from(el.childNodes).find(function (x) {
      return x.tagName === tagName.toUpperCase();
    });
  };

  exports.findChildByTagName = findChildByTagName;
  exports.getOuterHeight = getOuterHeight;

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;

})({});
