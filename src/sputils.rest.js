(function () {
  // This is used to cache results
  // from grabbing the request digest.
  var requestDigest;

  // Simple AJAX request for fetching the request digest
  // from /_api/contextinfo. This is used as a fallback
  // for the one embedded in the SharePoint page.

  // Returns a promise resolving to the digest string.
  var requestFormDigest = function () {
    return contextInfo()
      .then(function (info) {
        return info.FormDigestValue;
      });
  };

  function contextInfo(webUrl) {
    var CONTEXT_INFO_API = '/_api/contextinfo';
    return post(webUrl + CONTEXT_INFO_API)
      .then(function (data) {
        return data.d.GetContextWebInformation;
      });
  }

  // Utility for grabbing the digest off the page in
  // an asynchronous manner. Solves the issue of script
  // running before page has loaded proper.
  // --
  // Returns a promise resolving to the digest string.
  var withRequestDigest = function (refresh) {
    return new Promise(function (resolve, reject) {
      if (requestDigest && refresh !== true) {
        resolve(requestDigest);
      } else {
        var rd = global.document.getElementById('__REQUESTDIGEST');
        if (rd !== null && rd.value !== 'InvalidFormDigest') {
          requestDigest = rd.value;
          resolve(requestDigest);
        } else {
          var tapCache = tap(function (digest) {
            // `tap` will pass the digest to the next handler
            requestDigest = digest;
          });
          requestFormDigest()
            .then(tapCache).then(resolve);
        }
      }
    });
  };

  // Gets the default config object for ajax requests.
  // Is asynchronous for consistency.

  // Returns a promise resolving to the ajax defaults.
  var getDefaults = function (url, config) {
    return new Promise(function (resolve, reject) {
      var defaults = {
        // If the URL is not absolute, get the missing part
        // from _spPageContextInfo
        url: url.indexOf('http') > -1 ? url : _spPageContextInfo.webAbsoluteUrl + url,
        method: 'GET',
        credentials: 'include',
        headers: {
          'accept': 'application/json;odata=verbose'
        }
      };

      // fjs assign has the destination last (because curry), i.e. data flow:
      // config => defaults
      resolve(fjs.assign(config || {}, defaults));
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
          getval('headers', config) || {},
          getval('headers', defaults) || {},
          {'X-RequestDigest': digest});

        var added = {
          method: 'POST',
          body: data,
          contentType: 'application/json;odata=verbose'
        };

        var cfg = fjs.assign(config || {}, added, defaults);
        cfg.headers = headers;
        return cfg;
      });
  };

  /**
  * Rest API get helper. Uses sane defaults to speak to the API. Additional
  * configuration can be passed with the config argument.
  * @function sputils.rest.get
  * @param {string} url an SP endpoint
  * @param {object} config additional configuration
  * @returns {object} a promise that resolves to the response data
  * @example
  * sputils.rest.get('/_api/web/lists').then(function (data) {
  *   $.each(data.d.results, function (idx,el) {
  *     console.log(el);
  *   });
  * });
  */
  var get = function (url, config) {
    url = url || '/';
    return getDefaults(url, config)
      .then(function (defaults) {
        return fetch(defaults.url, defaults).then(jsonify);
      });
  };

  /**
  * Rest API post helper. Uses sane defaults to speak to the API. Additional
  * configuration can be passed with the config argument.
  * @function sputils.rest.post
  * @param {string} url an SP endpoint
  * @param {object} data the payload
  * @param {object} config additional configuration
  * @returns {object} a promise that resolves to the response data
  * @example
  * var data = {'Title':'REST API FTW',
  *             '__metadata': { 'type': 'SP.Data.AnnouncementsListItem'}};
  *
  * sputils.rest.post('/_api/Web/Lists/getByTitle('Announcements')/items/', data)
  *   .then(function (data) { console.log(data) });
  */
  var post = function (url, data, config) {
    data = typeof data === 'string' ? data : JSON.stringify(data);
    return postDefaults(url, data, config).then(function (defaults) {
      return fetch(url, defaults).then(jsonify);
    });
  };

  /**
  * Results from the standard SharePoint REST APIs come
  * wrapped in objects. This convenience function unwraps
  * them for you. See example use.
  * @function sputils.rest.unwrapResults
  * @param {object} object raw SP API response data
  * @returns {object} unwrapped SP API data
  * @example
  * sputils.rest.get('/_api/web/lists')
  *   .then(sputils.rest.unwrapResults)
  *   .then(function (data) {
  *     $.each(data, function (idx,el) {
  *       console.log(el);
  *     });
  *   });
  */
  var unwrapResults = function (object) {
    return object.d.results || object.d;
  };

  // If the given argument has a json method
  // we call it, otherwise just return the argument.
  var jsonify = function (result) {
    return typeof result.json === 'function' ? result.json() : result;
  };

  /** @namespace */
  sputils.rest = {
    get: get,
    post: post,
    withRequestDigest: withRequestDigest,
    unwrapResults: unwrapResults,
    contextInfo: contextInfo
  };
})();
