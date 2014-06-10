'use strict';

window.github;

window.auth = function() {
  var defer = $.Deferred();
  gh.tokenFetcher.getToken(false, function(error, token) { 
    if (error) {
      return defer.reject(error);
    }

    window.github = new Github({
      token: token,
      auth: "oauth"
    });
    
    return defer.resolve();
  });
  return defer;
}();

chrome.runtime.onInstalled.addListener(function (details) {
	console.log('previousVersion', details.previousVersion);
});

chrome.browserAction.setBadgeText({text: '\'0'});
