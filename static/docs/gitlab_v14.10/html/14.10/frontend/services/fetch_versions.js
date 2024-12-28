this["content/frontend/services/fetch_versions"] = this["content/frontend/services/fetch_versions"] || {};
this["content/frontend/services/fetch_versions"].js = (function (exports) {
  'use strict';

  function getVersions() {
    return fetch('https://docs.gitlab.com/versions.json').then(function (response) {
      return response.json();
    }).then(function (data) {
      return data[0];
    }).catch(function (error) {
      return console.error(error);
    }); // eslint-disable-line no-console
  }

  exports.getVersions = getVersions;

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;

})({});
