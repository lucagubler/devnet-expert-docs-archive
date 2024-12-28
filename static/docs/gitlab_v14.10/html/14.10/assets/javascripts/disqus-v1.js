var disqus_config = function () {
  this.page.url = 'https://docs.gitlab.com/assets/javascripts/disqus.html';
  this.page.title = 'GitLab Documentation';

  this.page.identifier = 'https://docs.gitlab.com/assets/javascripts/disqus.html';

};

var is_disqus_loaded = false;
window.loadDisqus = function() {
  if (!is_disqus_loaded){
    is_disqus_loaded = true;
    var disqusThread = document.getElementById('disqus_thread');
    var d = document, s = d.createElement('script');
    disqusThread.innerHTML = '';
    s.src = 'https://gitlab-docs.disqus.com/embed.js';
    s.setAttribute('data-timestamp', +new Date());
    (d.head || d.body).appendChild(s);
  }
};
