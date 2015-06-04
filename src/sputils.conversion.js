/** @namespace sputils.conversion */

(function () {
  /**
  Get the user name from the claims token string
  @function sputils.conversion.getUserNameFromClaim
  @param {string} claimsString - the claims string
  @returns {string} username
  @example
var claimsToken = 'i:0ǵ.t|ipdomain|jdoe';
var username = sputils.conversion.getUserNameFromClaim(claimsToken);
console.log(username); // => 'jdoe'
  **/
  var getUserNameFromClaim = function (claimsString) {
    var splitUserName = claimsString.split("|");
    return splitUserName[splitUserName.length -1];
  };

  sputils.conversion = {
    getUserNameFromClaim: getUserNameFromClaim
  };
})();
