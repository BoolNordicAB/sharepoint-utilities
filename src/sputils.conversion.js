/** @namespace sputils.conversion */

(function () {
  /**
  Get the user name from the claims token string
  @param {string} claimsString - the claims string
  @returns {string} username
  @example ```
  var claimsToken = 'i:0ǵ.t|ipdomain|jdoe';
  var username = sputils.getUserNameFromClaim(claimsToken);
  console.log(username); // => 'jdoe'
  ```
  **/
  var getUserNameFromClaim = function (claimsString) {
    var splitUserName = claimsString.split("|");
    return splitUserName[splitUserName.length -1];
  };

  /** @module sputils/conversion */
  sputils.conversion = {
    getUserNameFromClaim: getUserNameFromClaim
  };
})();
