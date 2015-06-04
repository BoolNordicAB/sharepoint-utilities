(function () {
  var getUserNameFromClaim = function (string) {
    var splitUserName = string.split("|");
    return splitUserName[splitUserName.length -1];
  };

  sputils.conversion = {
    getUserNameFromClaim: getUserNameFromClaim
  };
})();
