function $_global_sputils_user () {
  (function (window) {
    'use strict';

    var loginAsAnotherUser = function () {
      window.location.href = "/_layouts/closeconnection.aspx?loginasanotheruser=true";
    };

    var logoutUser = function () {
      window.location.href = "/_layouts/closeconnection.aspx";
    };

    window.sputils = window.sputils || {};
    window.sputils.user = {
      loginAsAnotherUser: loginAsAnotherUser,
      logoutUser: logoutUser
    };
  })(window);
}
$_global_sputils_user();
