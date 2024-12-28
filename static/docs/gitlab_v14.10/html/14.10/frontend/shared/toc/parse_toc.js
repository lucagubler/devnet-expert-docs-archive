this["content/frontend/shared/toc/parse_toc"] = this["content/frontend/shared/toc/parse_toc"] || {};
this["content/frontend/shared/toc/parse_toc"].js = (function (exports) {
  'use strict';

  /* global $ */
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

  /* eslint-disable import/prefer-default-export */
  var TAG_LI = 'LI';
  var TAG_A = 'A';
  var TAG_UL = 'UL';
  /**
   * Parses the given HTML Table of Contents into a data structure
   *
   * ```
   * type Item = { text: String, href: String, id: String, items: Item[] }
   *
   * parseTOC: Element => Item[]
   * ```
   *
   * @param {Element} menu Parent <ul> element
   */

  var parseTOC = function parseTOC(menu) {
    var items = [];

    if (!menu) {
      return items;
    }

    menu.childNodes.forEach(function (li) {
      if (li.tagName !== TAG_LI) {
        return;
      }

      var link = findChildByTagName(li, TAG_A);
      var subMenu = findChildByTagName(li, TAG_UL);

      if (!link) {
        return;
      }

      var item = {
        text: link.textContent,
        href: link.getAttribute('href'),
        id: link.id,
        items: parseTOC(subMenu)
      };
      items.push(item);
    });
    return items;
  };

  exports.parseTOC = parseTOC;

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;

})({});
