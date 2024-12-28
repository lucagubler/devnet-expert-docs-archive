this["content/frontend/default/environment"] = this["content/frontend/default/environment"] || {};
this["content/frontend/default/environment"].js = (function (exports) {
  'use strict';

  /**
   * Utilities for determining site environment.
   */
  var GlHosts = [{
    environment: 'production',
    host: 'docs.gitlab.com'
  }, {
    environment: 'review',
    host: '35.193.151.162.nip.io'
  }, {
    environment: 'local',
    host: 'localhost'
  }];
  function isGitLabHosted() {
    return GlHosts.some(function (e) {
      return window.location.host.includes(e.host);
    });
  }

  exports.GlHosts = GlHosts;
  exports.isGitLabHosted = isGitLabHosted;

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;

})({});
