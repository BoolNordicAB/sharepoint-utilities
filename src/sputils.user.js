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
      var currentUser = web.get_currentUser();

      // Load currentUser to the context in order to retrieve the user data.
      clientContext.load(currentUser);

      // Execute the query. Takes two functions: success and failed that returns the SPUser object or an error message.
      clientContext.executeQueryAsync(function () {
        deferred.resolve(currentUser);
      }, function (sender, args) {
        deferred.reject(args.get_message());
      });

      return deferred.promise();
    };

    window.sputils = window.sputils || {};
    window.sputils.user = {
      loginAsAnotherUser: loginAsAnotherUser,
      logoutUser: logoutUser,
      getCurrentUser: getCurrentUser
    };
  })(window);
}
$_global_sputils_user();
