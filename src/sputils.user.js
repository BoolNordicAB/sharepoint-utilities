(function () {
  /**
   * @function sputils.user.loginAsAnotherUser
   * @returns {void}
   * @example
   * sputils.user.loginAsAnotherUser();
   */
  var loginAsAnotherUser = function () {
    global.location.href = '/_layouts/closeconnection.aspx?loginasanotheruser=true';
  };

  /**
   * @function sputils.user.logoutUser
   * @returns {void}
   * @example
   * sputils.user.logoutUser();
   */
  var logoutUser = function () {
    global.location.href = '/_layouts/closeconnection.aspx';
  };


  /**
   * Returns a promise with the current spuser object.
   * @function sputils.user.getCurrentUser
   * @returns {Promise<object>} the promise with the user object
   * @example
   * sputils.user.getCurrentUser().then(function (data) {
   *   console.log(data);
   */
  var getCurrentUser = function () {
    return new Promise(function (resolve, reject) {
      var clientContext = new SP.ClientContext.get_current();
      var web = clientContext.get_web();
      var currentUser = web.get_currentUser();

      // Load currentUser to the context in order to retrieve the user data.
      clientContext.load(currentUser);

      // Execute the query. Takes two functions: success and failed
      // that returns the SPUser object or an error message.
      clientContext.executeQueryAsync(function () {
        resolve(currentUser);
      }, function (sender, args) {
        reject(new Error(args.get_message()));
      });
    });
  };

  /**
   * Returns full url to profile page of current user
   * @function sputils.user.getCurrentUserPersonalSiteUrl
   * @param {object} config - an object containing config for the REST call
   * @returns {Promise<object>}
   * @example
   *  sputils.user.getCurrentUserPersonalSiteUrl()
   *    .then(function (data) { console.log(data) });
   */
  var getCurrentUserPersonalSiteUrl = function (config) {
    var url =
          '/_api/SP.UserProfiles.PeopleManager/GetMyProperties?$select=UserUrl';
    return sputils.rest.get(url, config)
      .then(function (data) {
        return data.d.UserUrl;
      });
  };

  /** @namespace */
  sputils.user = {
    loginAsAnotherUser: loginAsAnotherUser,
    logoutUser: logoutUser,
    getCurrentUser: getCurrentUser,
    getCurrentUserPersonalSiteUrl: getCurrentUserPersonalSiteUrl
  };
})();
