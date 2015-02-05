function $_global_sputils_userprofile () {
  (function (window, $, _spPageContextInfo) {

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

    window.sputils = window.sputils || {};
    window.sputils.userprofile = {
      getCurrentUserPersonalSiteUrl: getCurrentUserPersonalSiteUrl
    };
  })(window, jQuery, _spPageContextInfo);
}
$_global_sputils_userprofile();
