function setCookie() {
  const bannerCloseBtn = document.querySelector('#banner-close button');
  bannerCloseBtn.addEventListener("click", function() {
    const d = new Date();
    d.setTime(d.getTime() + (1 * 24 * 60 * 60 * 1000));
    const expires = "expires=" + d.toUTCString();
    document.cookie = 'bannerclose' + "=" + 'yes' + "; " + expires;
  });
}

function getCookie(cname) {
  let name = cname + "=";
  let ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1);
    if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
  }
  return "";
}

(function() {
  const bannerClose = document.querySelector('#banner-close');
  if (getCookie("bannerclose") !== "yes") {
    bannerClose.classList.remove('d-none');
    setCookie();
  }
})();