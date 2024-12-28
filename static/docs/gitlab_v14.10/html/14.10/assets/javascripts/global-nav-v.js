(function() {
  const menu = document.getElementById('global-nav');
  const activeMenuItem = menu.querySelector('.nav-link .active');
  const collapsedMenu = activeMenuItem ? activeMenuItem.closest('.collapse') : null;

  expand(collapsedMenu);
  toggleSidebar();

  // Expands the menu tree for the selected menu item
  function expand(menu) {

    if(!menu) {
      return;
    }

    const collapseToggle = menu.previousElementSibling.querySelector('.collapse-toggle');

    menu.previousElementSibling.classList.add('active');
    menu.classList.add('show');

    if(collapseToggle) {
      collapseToggle.classList.remove('collapsed');
      collapseToggle.setAttribute('aria-expanded', true);
    }

    if(menu.parentElement.classList.contains('collapse')) {
      // This will traverse up until all parents are expanded
      expand(menu.parentElement);
    } else if (menu.parentElement.classList.contains('global-nav-section')) {
      menu.parentElement.classList.add('expanded');
    }

    activeMenuItem.scrollIntoView({block: "center"});
  }

  function toggleSidebar() {
    const mediaQuery = window.matchMedia('(max-width: 1199px)');
    const navWrapper = document.querySelector('.nav-wrapper');
    const main = document.querySelector('.main');

    if (mediaQuery.matches) {
      navWrapper.classList.remove('active');
      main.classList.remove('active');
      return;
    }

    navWrapper.classList.add('active');
    main.classList.add('active');
  }
})();
