(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var mobileToggle = document.querySelector('.mobile-nav-toggle');
    var classes = [document.querySelector('.main'), document.querySelector('.nav-wrapper')];

    if (!mobileToggle) {
      return;
    }

    mobileToggle.addEventListener('click', function () {
      return classes.forEach(function (el) {
        el.classList.toggle('active');
      });
    });
  });

})();
