function $_global_sputils_user () {
  (function (window) {
    'use strict';

    var loginAsAnotherUser = function () {
      window.location.href = "/_layouts/closeconnection.aspx?loginasanotheruser=true";
    };

    var logoutUser = function () {
      window.location.href = "/_layouts/closeconnection.aspx";
    };

    // Returns a promise with the current spuser object.
    var getCurrentUser = function () {
      var deferred = $.Deferred();

      var clientContext = new SP.ClientContext.get_current();
      var currentWeb = clientContext.get_web();
      clientContext.load(currentWeb);
      var currentUser = web.get_currentUser();

      //Load currentUser to the context in order to retrieve the user data.
      clientContext.load(currentUser);

      var successHandler = function (currentUser) {
        deferred.resolve(currentUser);
      };

      var errorHandler = function () {
        deferred.reject('error');
      };

      clientContext.executeQueryAsync(successHandler, errorHandler);

      return deferred.promise();
    };

    window.sputils = window.sputils || {};
    window.sputils.user = {
      loginAsAnotherUser: loginAsAnotherUser,
      logoutUser: logoutUser
    };
  })(window);
}
$_global_sputils_user();
