(function () {

  /*

    SETUP

  */

  // This is used to cache results
  // from grabbing the request digest.
  var requestDigest;

  // Simple AJAX request for fetching the request digest
  // from /_api/contextinfo. This is used as a fallback
  // for the one embedded in the SharePoint page.

  // Returns a promise resolving to the digest string.
  var requestFormDigest = function () {
    return post("/_api/contextinfo", { })
      .then(function (data) {
        return data.d.GetContextWebInformation.FormDigestValue;
      });
  };

  // Utility for grabbing the digest off the page in
  // an asynchronous manner. Solves the issue of script
  // running before page has loaded proper.
  // --
  // Returns a promise resolving to the digest string.
  var withRequestDigest = function () {
    return new Promise(function(resolve, reject) {
      if (requestDigest) {
        resolve(requestDigest);
      } else {
        var rd = global.document.getElementById("__REQUESTDIGEST");
        if (rd !== null && rd.value !== "InvalidFormDigest") {
          requestDigest = rd.value;
          resolve(requestDigest);
        } else {
          return requestFormDigest()
            .then(tap(function (digest) {
              // `tap` will pass the digest to the next handler
              requestDigest = digest;
            }));
        }
      }
    });
  };

  // Gets the default config object for ajax requests.
  // Is asynchronous for consistency.

  // Returns a promise resolving to the ajax defaults.
  var getDefaults = function (url, config) {
    return new Promise(function(resolve, reject) {
      var defaults = {
        // If the URL is not absolute, get the missing part
        // from _spPageContextInfo
        url: url.indexOf('http') > -1 ? url : _spPageContextInfo.webAbsoluteUrl + url,
        type: "GET",
        headers: {
          "accept": "application/json;odata=verbose"
        }
      };

      // fjs assign has the destination last (because curry), i.e. data flow:
      // config => defaults
      deferred.resolve(fjs.assign(config, defaults));
    });
  };

  // Gets the default config object for ajax post requests,
  // which includes the getConfig and the request digest.

  // Returns a promise resolving to the ajax post defaults.
  var postDefaults = function (url, data, config) {
    return Promise.all([getDefaults(url), withRequestDigest()])
      .then(function (results) {
        var defaults = results[0],
            digest = results[1];

        var headers = fjs.assign(
          config.headers || {},
          "X-RequestDigest": digest,
        });

        var added = {
          method: "POST",
          body: data,
          contentType: "application/json;odata=verbose"
        };

        var cfg = fjs.assign(config, added, defaults);
        cfg.headers = headers;
        return cfg;
      });
  };

  /*

    API

  */

  var get = function (url, config) {
    url = url || '/';
    return getDefaults(url, config)
      .then(function (defaults) {
        return fetch(url, defaults);
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
      return fetch(url, defaults);
    });
  };

  /*

  EXAMPLE USE

  var data = {"Title":"REST API FTW",
              "__metadata": { "type": "SP.Data.AnnouncementsListItem"}};

  sputils.rest.post("/_api/Web/Lists/getByTitle('Announcements')/items/", data)
    .then(function (data) { console.log(data) });

  */

  // Results from the standard SharePoint REST APIs come
  // wrapped in objects. This convenience function unwraps
  // them for you. See example use.
  var unwrapResults = function (object) {
    return object.d.results;
  };

  /*

  EXAMPLE USE:

  sputils.rest.get("/_api/web/lists")
    .then(sputils.rest.unwrapResults)
    .then(function (data) {
      $.each(data, function (idx,el) {
        console.log(el);
      });
  });

  */

  sputils.rest = {
    get: get,
    post: post,
    unwrapResults: unwrapResults
  };
})();
