'use strict';

window.github = null;

var setupGithub = function(token) {
  window.github = new Github({
    token: token,
    auth: "oauth"
  });
};

var auth = function() {
  var authDeferred = function() {
    var defer = $.Deferred();

    // Check if we already have the token
    chrome.storage.local.get("token", function(data) {
      if (data && data["token"]) {
        // Yes, we do
        setupGithub(data["token"]);
        return defer.resolve();
      }

      // No, we don't. Go get it!
      gh.tokenFetcher.getToken(true, function(error, token) {
        if (error) {
          return defer.reject(error);
        }

        // Keep it for later
        chrome.storage.local.set({"token": token}, function() {
          setupGithub(token);
          return defer.resolve();
        });
      });
    });

    return defer;
  }();

  // After auth
  authDeferred.done(function() {
    // Set user
    window.user = window.github.getUser();

    // Get all notifications
    return getAllNotifications();
  }).done(function() {

    // Get all user repos
    return getAllRepos();
  }).done(function() {
    // Set interval for checking new notifications
    setNotificationInterval();
  });

};

// Get all notifications and store them
var getAllNotifications = function() {
  var defer = $.Deferred();

  user.notifications(null, function(err, notifications) {
    if (err) {
      return defer.reject(err);
    }

    // Store notifications
    chrome.storage.local.set({'notifications': notifications}, function() {
      // Set the number of notifications in the badge
      chrome.browserAction.setBadgeText({text: notifications.length+''});

      defer.resolve();
    });
  });

  return defer;
};

// Get all user repos and store them
var getAllRepos = function() {
  var defer = $.Deferred();

  user.repos(function(err, repos) {
    if (err) {
      return defer.reject(err);
    }
    console.log(repos);

    chrome.storage.local.set({'repos': repos}, function() {

      console.log("NICE");

      defer.resolve();
    });

  });

  return defer;
};


// Notifications check
var setNotificationInterval = function(){
  // Check every
  var minutes = 1;
  var user = window.user;

  // Get notifications from this time and afterwards
  var lastTimeChecked = (new Date(Date.now())).toISOString();

  window.notificationInterval = setInterval(function() {
    var param = "?since="+lastTimeChecked+"&all=true";
    lastTimeChecked = (new Date(Date.now())).toISOString();

    user.notifications(param, function(err, notifications) {
      // If there's something
      if (notifications.length > 0) {
        // Create a notification
        var notification = webkitNotifications.createNotification(
          'images/icon-48.png',  // icon url - can be relative
          '', // notification title
          chrome.i18n.getMessage("newNotifications", [notifications.length+''])  // notification text
        );

        notification.show();
      }
    });
  }, 30000*minutes);

};

chrome.runtime.onInstalled.addListener(function(details) {
  console.log('previousVersion', details.previousVersion);
  auth();
});

chrome.runtime.onStartup.addListener(function() {
  auth();
});