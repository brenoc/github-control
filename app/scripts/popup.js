'use strict';

console.log('\'Allo \'Allo! Popup');

var github = new Github({
	username: "brenoc",
	password: "159357gh",
	auth: "basic"
});

var repo = github.getRepo("brenoc", "opentracks");

repo.show(function(err, repo) {
	console.log(repo);
});

chrome.browserAction.setBadgeText({text: '\'Opa'});