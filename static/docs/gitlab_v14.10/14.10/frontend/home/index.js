(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    // eslint-disable-next-line no-undef
    docsearch({
      apiKey: '89b85ffae982a7f1adeeed4a90bb0ab1',
      indexName: 'gitlab',
      container: '#docsearch',
      appId: '3PNCFOU757',
      placeholder: 'Search the docs',
      searchParameters: {
        facetFilters: ["version:14.10"]
      }
    });
  });

})();
