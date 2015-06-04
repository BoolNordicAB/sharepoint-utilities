/** @namespace sputils.conversion */

(function () {
  /**
   * This is a description of the foo function.
   * @param {string} str The string
   * @returns {string}
   */

  var getUserNameFromClaim = function (string) {
    var splitUserName = string.split("|");
    return splitUserName[splitUserName.length -1];
  };

  sputils.conversion = {
    getUserNameFromClaim: getUserNameFromClaim
  };
})();
