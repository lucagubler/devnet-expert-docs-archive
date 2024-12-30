var runtime = typeof document === 'object';

function load(src, cb) {
  var e = document.createElement('script');
  e.src = src;
  e.async = true;
  e.onreadystatechange = function(){
    if (this.readyState === 'complete' || this.readyState === 'loaded') {
      if (typeof cb === 'function') {
        cb();
      }
    }
  };
  e.onload = cb;
  document.head.appendChild(e);
}

function xhr(href, func) {
  const xhr = new XMLHttpRequest();
  const bustCache = 't=' + new Date().getTime();
  const delim = (href.indexOf('?') === -1 && '?') || '&';
  const url = href + delim + bustCache;
  xhr.withCredentials = true;

  xhr.addEventListener('readystatechange', function () {
    if (this.readyState === 4) {
      func(this.responseText);
    }
  });

  xhr.open('GET', url);

  xhr.send();
}

if (runtime) {
  load('/pmt.js', function(){
    if (window.pmt) {
      window.pmt('setScalp', [{ property: 'postman-docs' }]);
      window.pmt('scalp', ['pm-analytics', 'load', document.location.pathname]);
    }

    if (!dnt) {
      load('/_ga.js', function(){
        var UACode = 'G-CX7P9K6W67';
        var GCode = UACode;
        var sitename = document.location.hostname;

        gtag('config', '${GCode}');
        window._iaq = window._iaq || {};

        if (window.pmt) {
          window.pmt('log', ['[GTag] config: ' + GCode]);
          window.pmt('ga', ['${UACode}', sitename]);
          window.pmt('log', ['initialized GA: ' + sitename + ' (' + UACode + ')']);
        }
      });

      xhr('/_nr.json', function(resp){
        var _nr = JSON.parse(resp);

        if (_nr.length) {
          load('/nr-browser.js', function() {
            nrBrowser(_nr);
          });
        }
      });
    }

    setTimeout(function() {
      if (document.forms.length) {
        load('/rm_fallback.js', function() {
          if (window.pmt) {
            window.pmt('log', ['[RampMetrics Fallback] ' + !!document.querySelector('[src*="/rm_fallback.js"]')]);
          }
        });
      }

      if (window.pmt) {
        window.pmt('trackClicks', []);
      }
    }, 1000);
  });
}
