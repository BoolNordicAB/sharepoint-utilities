(function () {
  /*

    API

  */

  // Returns full url to profile page of current user
  var getCurrentUserPersonalSiteUrl = function (config) {
    var url =
      '/_api/SP.UserProfiles.PeopleManager/GetMyProperties?$select=UserUrl';
    return sputils.rest.get(url, config)
      .then(function (data) {
        return data.d.UserUrl;
      });
  };

  /* EXAMPLE USE

  sputils.userprofile.getCurrentUserPersonalSiteUrl()
    .then(function (data) { console.log(data) });

  */

  sputils.userprofile = {
    getCurrentUserPersonalSiteUrl: getCurrentUserPersonalSiteUrl
  };
})();
