chrome.storage.sync.set({
  favoriteColor: color,
  likesColor: likesColor
}, function() {
  // Update status to let user know options were saved.
  var status = document.getElementById('status');
  status.textContent = 'Options saved.';
  setTimeout(function() {
    status.textContent = '';
  }, 750);
});