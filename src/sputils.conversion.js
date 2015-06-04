function $_global_sputils_conversion () {
  (function (window) {
    'use strict';

    var getUserNameFromClaim = function (string) {
      var splitUserName = string.split("|");
      return splitUserName[splitUserName.length -1];
    };

    window.sputils = window.sputils || {};
    window.sputils.conversion = {
      convertClaimsToAd: convertClaimsToAd
    };
	})(window);
}
$_global_sputils_conversion();
