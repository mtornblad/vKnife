"use strict";

/**

OAuth 2.0 migration due to deprecation as per http://googleappsdeveloper.blogspot.com.au/2015/03/changes-to-oauth-in-apps-script.html

Steps to run:
1. Refer to https://github.com/googlesamples/apps-script-oauth2 and add the Google open source OAuth2 library MswhXl8fVhTFUH_Q3UOJbXvxhMjh3Sh48 to your project
2. Go Resources > Developer Console Project.. and create a project then go APIs > Credentials and create an OAuth Client and set the Redirect URI to https://script.google.com/macros/d/{PROJECT KEY}/usercallback and the JavaScript Origin to https://script.google.com.
3. Copy all the below to your project - note in getSharedContactsService() you need to set your own values (from step 2) in setClientId, setClientSecret and setProjectKey.
4. Run auth() to provoke authentication for Apps Script.
5. Now deploy as a web app, visit the /dev page and click Authorize to provoke OAuth authorization.
6. Now you can run test() and then View > Logs to confirm that the code displays the first shared domain contact's full name.

**/


function test() {
  
  //Add this one line to your production code
  SharedContactsApp.setOAuth2AccessToken(getSharedContactsService().getAccessToken());
  
  var contact = SharedContactsApp.getContacts()[0];
    
  Logger.log('The first Domain Shared Contact is %s <%s>', contact.getFullName(), contact.getEmails()[0].getAddress()); 

}

function auth() {
  //provoke authorization
}

//Source for the rest of this code is https://github.com/googlesamples/apps-script-oauth2
// Add these functions to your production code

function doGet2(request) {
  //Visit this as a web app to authorize the very first time
  var sharedContactsService = getSharedContactsService();
  if (!sharedContactsService.hasAccess()) {
    var authorizationUrl = sharedContactsService.getAuthorizationUrl();
    var template = HtmlService.createTemplate(
      '<a href="<?= authorizationUrl ?>" target="_blank">Authorize</a>');
    template.authorizationUrl = authorizationUrl;
    var page = template.evaluate();
    return HtmlService.createHtmlOutput( page);
  }
} 

function authCallback(request) {
  var sharedContactsService = getSharedContactsService();
  var isAuthorized = sharedContactsService.handleCallback(request);
  if (isAuthorized) {
    return HtmlService.createHtmlOutput('Success! You can close this tab.');
  } else {
    return HtmlService.createHtmlOutput('Denied. You can close this tab');
  }
}

function getSharedContactsService() {
  // Create a new service with the given name. The name will be used when
  // persisting the authorized token, so ensure it is unique within the
  // scope of the property store.
  return OAuth2.createService('sharedcontacts')

      // Set the endpoint URLs, which are the same for all Google services.
      .setAuthorizationBaseUrl('https://accounts.google.com/o/oauth2/auth')
      .setTokenUrl('https://accounts.google.com/o/oauth2/token')

      // Set the client ID and secret, from the Google Developers Console.
      .setClientId('')
      .setClientSecret('')


      // Set the name of the callback function in the script referenced
      // above that should be invoked to complete the OAuth flow.
      .setCallbackFunction('authCallback')

      // Set the property store where authorized tokens should be persisted.
      .setPropertyStore(PropertiesService.getUserProperties())

      // Set the scopes to request (space-separated for Google services).
      .setScope('https://www.google.com/m8/feeds/')

      // Below are Google-specific OAuth2 parameters.

      // Sets the login hint, which will prevent the account chooser screen
      // from being shown to users logged in with multiple accounts.
      .setParam('login_hint', Session.getActiveUser().getEmail())

      // Requests offline access.
      .setParam('access_type', 'offline')

      // Forces the approval prompt every time. This is useful for testing,
      // but not desirable in a production application.
      .setParam('approval_prompt', 'auto');
}



function doGet() {
  return HtmlService
      .createTemplateFromFile('index')
      .evaluate();
}

function getData() {
  return SpreadsheetApp
      .openById('1P8D3oRWdRLgAF5nSrbiktvGYFNFENNA-N5dVJ1S313k')
  .getSheetByName('participants')
      .getDataRange()
      .getValues();
}