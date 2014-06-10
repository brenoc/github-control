'use strict';


chrome.runtime.onInstalled.addListener(function (details) {
	console.log('previousVersion', details.previousVersion);
});



chrome.browserAction.setBadgeText({text: '\'0'});

chrome.identity.getAccounts(function(accounts){
	console.log(accounts);
})