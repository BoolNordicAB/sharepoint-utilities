/** @namespace sputils.helper */

(function () {
  var resolveDependency = function (dep) {
    var file = dep.file,
        namespace = dep.namespace;

    return new Promise(function (resolve, reject) {
      SP.SOD.registerSod(file, SP.Utilities.Utility.getLayoutsPageUrl(file));
      SP.SOD.executeFunc(file, namespace, resolve);
    });
  };

  // Returns a promise which resolves when
  // all the specified dependencies are loaded.
  //
  // Takes a list of strings which correspond
  // to SP JS dependencies. Each dependency is
  // registered and loaded.
  var withSharePointDependencies = function (deps) {
    return new Promise(function (resolve, reject) {
      // sp.js is a dependency for our resolveDependency
      // function, so we load it separately before
      // the rest.
      SP.SOD.executeFunc('sp.js', 'SP.ClientContext', function () {
        var promises = deps.map(resolveDependency);
        Promise.all(promises).then(resolve);
      });
    });
  };


  /**
  Get the relative (to the root) portion of an absolute url.

  @function sputils.helpers.abs2rel
  @param {string} - the absolute url
  @returns {string} - the relative url
  @example
var aurl = 'http://example.com/a/path/to.html';
var rurl = sputils.helpers.abs2rel(aurl);
rurl === '/a/path/to.html';
  **/
  function abs2rel(absUrl) {
    var hostname = sputils.lib.getval('location.hostname', global) || '';

    // splitting on the hostname should yield an array with 2 elements
    // the 1st element should be empty string and the second the rel path.
    // coalesce into an array with the result being a '/'
    var parts = (absUrl || '').split(hostname) || ['', '/'];

    return parts[1];
  }

  function urlQuery(optArg) {
    var result = {};
    var qs = (optArg || global.location.search).replace('?', '');
    var parts = qs.split('&');
    fjs.each(function (part) {
      var kvp = part.split('=');
      result[kvp[0]] = result[kvp[1]];
    });
    return result;
  }

  /**
  Get a promise for a client context that could be on another
  site/web.

  This client context is augmented to contain extra info in the
  `_info` property.

  @function sputils.helpers.clientContextForWeb
  @param {string} - the absolute url of the listitem, file or other asset.
  @returns {Promise<object>} - the promise of a client context
  @example
console.log(location);// => http://contoso.com/sub1
var fileUrl = 'http://contoso.com/sub21231/Shared Documents/file1.docx';
var cctxPromise = sputils.helpers.clientContext(fileUrl);
cctxPromise.then(function (cctx) {
  var webUrl = cctx._info.WebFullUrl;
  var web = cctx.get_web();
  var file = web.getFileByServerRelativeUrl(sputils.helpers.abs2rel(fileUrl));
  // ...
});
  **/
  function clientContext(absoluteFileOrWebUrl) {
    var url = absoluteFileOrWebUrl.substring(
      0, absoluteFileOrWebUrl.lastIndexOf('/')) ;

    return sputils.rest.contextInfo(url).then(function (info) {
      // create the context and set the extra prop.
      var cctx = new SP.ClientContext(info.WebFullUrl);
      cctx._info = info;

      return cctx;
    });
  }


  sputils.helpers = {
    withSharePointDependencies: withSharePointDependencies,
    abs2rel: abs2rel,
    clientContext: clientContext
  };
})();
