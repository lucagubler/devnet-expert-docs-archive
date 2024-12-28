// Add a copy button to every fenced code block
$('pre').append($('<button class="clip-btn" title="Click to copy" data-selector="true"><svg role="img" aria-label="" class="gl-icon ml-1 mr-1 s16"><use href="/assets/images/icons.svg#copy-to-clipboard" /> <title>  </title> </svg></button>'));

// Tooltip
$('button').tooltip({
  trigger: 'click',
  placement: 'left'
});

function setTooltip(btn, message) {
  $(btn).tooltip('hide')
    .attr('data-original-title', message)
    .tooltip('show');
}

function hideTooltip(btn) {
  setTimeout(function() {
    $(btn).tooltip('hide');
  }, 1000);
}

// trigger clipboardjs
var clipboard = new ClipboardJS('.clip-btn', {
  target: function(trigger) {
    return trigger.previousElementSibling;
  }
});

clipboard.on('success', function(e) {
  setTooltip(e.trigger, 'Copied!');
  hideTooltip(e.trigger);
  e.clearSelection();
});

clipboard.on('error', function(e) {
  setTooltip(e.trigger, 'Failed!');
  hideTooltip(e.trigger);
});
