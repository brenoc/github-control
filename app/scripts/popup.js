'use strict';

console.log('\'Allo \'Allo! Popup');

var appName = chrome.i18n.getMessage("appName");
var background = chrome.extension.getBackgroundPage();

var showOAuth = function() {
  background.auth();

  var notification = webkitNotifications.createNotification(
    'images/icon-48.png',  // icon url - can be relative
    chrome.i18n.getMessage("oAuthRequired"),  // notification title
    chrome.i18n.getMessage("requiresOAuth", [appName])  // notification body text
  );

  notification.show();
  setTimeout(function(){ notification.cancel(); }, 5000);

  $(document).ready(function(){
    $('body').html(chrome.i18n.getMessage("requiresOAuth", [appName]));
  });
};


var happyPath = function() {
  var github = background.github;
  window.user = background.user;

  chrome.storage.local.get(['repos'], function(data) {
    var repos = [];
    if (data) {
      var repos = data['repos']
    }
    _.each(repos, function(repo){
      $('#repos').append("<li class='list-group-item'>"+repo.name);
    });
  });

};


if (!background.github) {
  showOAuth();
} else {
  happyPath();
}
