'use strict';

console.log('\'Allo \'Allo! Popup');

var background = chrome.extension.getBackgroundPage();

background.auth.then(function(){
  var github = background.github;
  var user = github.getUser();

  user.repos(function(err, repos) {
    for (var i = repos.length - 1; i >= 0; i--) {
      $('#repos').append("<li>"+repos[i].name);
    };
  });

  chrome.browserAction.setBadgeText({text: '\'Opa'});
});