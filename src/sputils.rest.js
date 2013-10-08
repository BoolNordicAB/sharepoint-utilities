function $_global_sputils_rest () {
  (function ($, _spPageContextInfo) {
    'use strict';

    /*

      SETUP

    */

    Type.registerNamespace('sputils.rest');

    // This is used to cache results
    // from grabbing the request digest.
    var requestDigest;

    // Simple AJAX request for fetching the request digest
    // from /_api/contextinfo. This is used as a fallback
    // for the one embedded in the SharePoint page.

    // Returns a promise resolving to the digest string.
    var requestFormDigest = function () {
      var deferred = $.Deferred();

      sputils.rest.get("/_api/contextinfo", { "method": "POST" })
        .then(function (data) {
          deferred.resolve(data.d.GetContextWebInformation.FormDigestValue);
        });

      return deferred.promise();
    };

    // Utility for grabbing the digest off the page in
    // an asynchronous manner. Solves the issue of script
    // running before page has loaded proper.

    // Returns a promise resolving to the digest string.
    var withRequestDigest = function () {
      var deferred = $.Deferred();

      if (requestDigest) {
        deferred.resolve(requestDigest);
      }
      else {
        var rd = $("#__REQUESTDIGEST");

        if (rd.length > 0 && rd.val() !== "InvalidFormDigest") {
          requestDigest = rd.val();
          deferred.resolve(rd.val());
        }
        else {
          requestFormDigest()
            .then(function (digest) {
              requestDigest = digest;
              deferred.resolve(digest);
            });
        }
      }

      return deferred.promise();
    };

    // Gets the default config object for ajax requests.
    // Is asynchronous for consistency.

    // Returns a promise resolving to the ajax defaults.
    var getDefaults = function (url, config) {
      var deferred = $.Deferred();
      var defaults = {
        url: _spPageContextInfo.webAbsoluteUrl + url,
        type: "GET",
        headers: {
          "accept": "application/json;odata=verbose"
        }
      };

      $.extend(defaults, config);
      deferred.resolve(defaults);
      return deferred.promise();
    };

    // Gets the default config object for ajax post requests,
    // which includes the getConfig and the request digest.

    // Returns a promise resolving to the ajax post defaults.
    var postDefaults = function (url, data, config) {
      return $.when(getDefaults(url), withRequestDigest())
        .then(function (defaults, digest) {
          var added = {
            type: "POST",
            data: data,
            contentType: "application/json;odata=verbose",
            headers: {
              "X-RequestDigest": digest,
            }
          };

          return $.extend(true, defaults, added, config);
        });
    };

    /*

      API

    */

    var get = function (url, config) {
      return getDefaults(url, config)
        .then(function (defaults) {
          return $.ajax(defaults);
        });
    };

    /*

    EXAMPLE USE:

    sputils.rest.get("/_api/web/lists").then(function (data) {
      $.each(data.d.results, function (idx,el) {
        console.log(el);
      });
    });

    */

    var post = function (url, data, config) {
      data = typeof data === 'string' ? data : JSON.stringify(data);
      return postDefaults(url, data, config).then(function (defaults) {
        return $.ajax(defaults);
      });
    };

    /*

    EXAMPLE USE

    var data = {"Title":"REST API FTW",
                "__metadata": { "type": "SP.Data.AnnouncementsListItem"}};

    sputils.rest.post("/_api/Web/Lists/getByTitle('Announcements')/items/", data)
      .then(function (data) { console.log(data) });

    */

    /*

      SPECIALIZED

    */

    var getListByName = function (name, config) {
      var url = '/_api/Web/Lists/getByTitle(\'' + name + '\')/items/';
      return get(url, config);
    };

    /*

    EXAMPLE USE

    sputils.rest.getListByName('Announcements')
      .then(function (data) { console.log(data.d.results) });

    */

    var postListByName = function (name, data, config) {
      var url = '/_api/Web/Lists/getByTitle(\'' + name + '\')/items/';
      return post(url, data, config);
    };

    /*

    EXAMPLE USE

    var data = {"Title": "RESTlessly POSTing",
                "__metadata": { type: "SP.Data.AnnouncementsListItem"} };
    sputils.rest.postListByName("Announcements", data)
      .then(function (data) { console.log(data); });

    */

    sputils.rest = {
      get: get,
      post: post,
      getListByName: getListByName,
      postListByName: postListByName
    };
  })(jQuery, _spPageContextInfo);
}
$_global_sputils_rest();
