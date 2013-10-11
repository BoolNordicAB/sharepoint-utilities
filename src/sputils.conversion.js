function $_global_sputils_conversion () {
  (function (window) {
    'use strict';

    var convertClaimsToAd = function (string) {
      return string.split("|")[1];
    };

    window.sputils = window.sputils || {};
    window.sputils.conversion = {
      convertClaimsToAd: convertClaimsToAd
    };
	})(window);
}
$_global_sputils_conversion();
