_N_E=(window.webpackJsonp_N_E=window.webpackJsonp_N_E||[]).push([[16],{AJHg:function(e,n,t){(window.__NEXT_P=window.__NEXT_P||[]).push(["/_error",function(){return t("ZA9o")}])},YFqc:function(e,n,t){e.exports=t("cTJO")},cTJO:function(e,n,t){"use strict";var r=t("zoAU"),o=t("7KCV");n.__esModule=!0,n.default=void 0;var a=o(t("q1tI")),c=t("elyg"),u=t("nOHt"),i=t("vNVm"),l={};function f(e,n,t,r){if(e&&(0,c.isLocalURL)(n)){e.prefetch(n,t,r).catch((function(e){0}));var o=r&&"undefined"!==typeof r.locale?r.locale:e&&e.locale;l[n+"%"+t+(o?"%"+o:"")]=!0}}var s=function(e){var n=!1!==e.prefetch,t=(0,u.useRouter)(),o=t&&t.asPath||"/",s=a.default.useMemo((function(){var n=(0,c.resolveHref)(o,e.href,!0),t=r(n,2),a=t[0],u=t[1];return{href:a,as:e.as?(0,c.resolveHref)(o,e.as):u||a}}),[o,e.href,e.as]),d=s.href,p=s.as,v=e.children,h=e.replace,g=e.shallow,y=e.scroll,_=e.locale;"string"===typeof v&&(v=a.default.createElement("a",null,v));var w=a.Children.only(v),b=w&&"object"===typeof w&&w.ref,E=(0,i.useIntersection)({rootMargin:"200px"}),m=r(E,2),L=m[0],M=m[1],k=a.default.useCallback((function(e){L(e),b&&("function"===typeof b?b(e):"object"===typeof b&&(b.current=e))}),[b,L]);(0,a.useEffect)((function(){var e=M&&n&&(0,c.isLocalURL)(d),r="undefined"!==typeof _?_:t&&t.locale,o=l[d+"%"+p+(r?"%"+r:"")];e&&!o&&f(t,d,p,{locale:r})}),[p,d,M,_,n,t]);var C={ref:k,onClick:function(e){w.props&&"function"===typeof w.props.onClick&&w.props.onClick(e),e.defaultPrevented||function(e,n,t,r,o,a,u,i){("A"!==e.currentTarget.nodeName||!function(e){var n=e.currentTarget.target;return n&&"_self"!==n||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||e.nativeEvent&&2===e.nativeEvent.which}(e)&&(0,c.isLocalURL)(t))&&(e.preventDefault(),null==u&&(u=r.indexOf("#")<0),n[o?"replace":"push"](t,r,{shallow:a,locale:i,scroll:u}))}(e,t,d,p,h,g,y,_)},onMouseEnter:function(e){(0,c.isLocalURL)(d)&&(w.props&&"function"===typeof w.props.onMouseEnter&&w.props.onMouseEnter(e),f(t,d,p,{priority:!0}))}};if(e.passHref||"a"===w.type&&!("href"in w.props)){var I="undefined"!==typeof _?_:t&&t.locale,N=t&&t.isLocaleDomain&&(0,c.getDomainLocale)(p,I,t&&t.locales,t&&t.domainLocales);C.href=N||(0,c.addBasePath)((0,c.addLocale)(p,I,t&&t.defaultLocale))}return a.default.cloneElement(w,C)};n.default=s},vNVm:function(e,n,t){"use strict";var r=t("zoAU");n.__esModule=!0,n.useIntersection=function(e){var n=e.rootMargin,t=e.disabled||!c,i=(0,o.useRef)(),l=(0,o.useState)(!1),f=r(l,2),s=f[0],d=f[1],p=(0,o.useCallback)((function(e){i.current&&(i.current(),i.current=void 0),t||s||e&&e.tagName&&(i.current=function(e,n,t){var r=function(e){var n=e.rootMargin||"",t=u.get(n);if(t)return t;var r=new Map,o=new IntersectionObserver((function(e){e.forEach((function(e){var n=r.get(e.target),t=e.isIntersecting||e.intersectionRatio>0;n&&t&&n(t)}))}),e);return u.set(n,t={id:n,observer:o,elements:r}),t}(t),o=r.id,a=r.observer,c=r.elements;return c.set(e,n),a.observe(e),function(){c.delete(e),a.unobserve(e),0===c.size&&(a.disconnect(),u.delete(o))}}(e,(function(e){return e&&d(e)}),{rootMargin:n}))}),[t,n,s]);return(0,o.useEffect)((function(){if(!c&&!s){var e=(0,a.requestIdleCallback)((function(){return d(!0)}));return function(){return(0,a.cancelIdleCallback)(e)}}}),[s]),[p,s]};var o=t("q1tI"),a=t("0G5g"),c="undefined"!==typeof IntersectionObserver;var u=new Map}},[["AJHg",0,1,2,3,11]]]);