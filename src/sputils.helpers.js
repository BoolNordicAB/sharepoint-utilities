(function () {
  'use strict';

  /**
   * @ignore
   * @summary
   * Uses SP builtin dependency management to load a specific dependency.
   * @function sputils.helpers.resolveDependency
   * @param {object} dep
   * <pre>
   * {
   *   file: {string},
   *   namespace: {string}
   * }
   * - `file` is the filename of the module, e.g. sp.taxonomy.js
   * - `namespace` is the namespace provided by the SP module, e.g. SP.Taxonomy
   * </pre>
   * @returns {Promise<Void>} - resolved when the SP dependency is loaded.
   */
  var resolveDependency = function (dep) {
    var file = dep.file,
        namespace = dep.namespace;

    return new Promise(function (resolve, reject) {
      SP.SOD.registerSod(file, SP.Utilities.Utility.getLayoutsPageUrl(file));
      SP.SOD.executeFunc(file, namespace, resolve);
    });
  };


  /**
   * Returns a promise which resolves when
   * all the specified dependencies are loaded.
   *
   * Takes a list of strings which correspond
   * to SP JS dependencies. Each dependency is
   * registered and loaded.
   *
   * Uses SP builtin dependency management to load a specific dependency.
   *
   * @function sputils.helpers.withSharePointDependencies
   * @param {Array<dep>} deps
   * An array containing hashes with the following keys: {file, namespace}
   * <pre>
   * [ { file: string, namespace: string } ]
   * </pre>
   * @returns {Promise<Void>} - resolved when all deps are loaded.
   */
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
  * Get the relative (to the root) portion of an absolute url.
  *
  * @function sputils.helpers.abs2rel
  * @param {string} - the absolute url
  * @returns {string} - the relative url
  * @example
  * var aurl = 'http://example.com/a/path/to.html';
  * var rurl = sputils.helpers.abs2rel(aurl);
  * rurl === '/a/path/to.html';
  **/
  var abs2rel = function (absUrl) {
    var hostname = sputils.lib.getval('location.hostname');

    // splitting on the hostname should yield an array with 2 elements
    // the 1st element should be empty string and the second the rel path.
    // coalesce into an array with the result being a '/'
    var parts = (absUrl || '').split(hostname);

    return parts[1] || '/';
  };

  /**
   * @function sputils.helpers.parseQueryString
   * @param {Optional<string>} optArg
   * a query string, as in the form of "?k1=v1&k2=v2"
   * @returns {Object}
   * an object representing the dictionary of the query string.
   * @example
   * console.log(location.search); // => '?a=1&b=some value'
   * var qsHash = parseQueryString(); // no argument, will use the current browsing context's location.search
   * // qsHash ~=~ {a:1, b: 'some value'};
   * parseQueryString('?a=1&b=some value'); // ~=~ qsHash
   **/
  var parseQueryString = function (optArg) {
    var result = {};
    var qs = (optArg || sputils.lib.getval('location.search')).replace('?', '');
    var parts = qs.split('&');
    parts = fjs.filter(function (a) {
      return a !== '';
    }, parts);
    fjs.each(function (part) {
      var kvp = part.split('=');
      result[kvp[0]] = kvp[1];
    }, parts);
    return result;
  };

  /**
  * Get a promise for a client context that could be on another
  * site/web.
  *
  * This client context is augmented to contain extra info in the
  * `_info` property.
  *
  * @function sputils.helpers.clientContextForWeb
  * @param {string} absoluteUrl the absolute url of the listitem, file or other asset.
  * @returns {Promise<SP.ClientContext>} - the promise of a client context
  * @example
  * console.log(location);// => http://contoso.com/sub1
  * var fileUrl = 'http://contoso.com/sub21231/Shared Documents/file1.docx';
  * var cctxPromise = sputils.helpers.clientContext(fileUrl);
  * cctxPromise.then(function (cctx) {
  *   var webUrl = cctx._info.WebFullUrl;
  *   var web = cctx.get_web();
  *   var file = web.getFileByServerRelativeUrl(sputils.helpers.abs2rel(fileUrl));
  *   // ...
  * });
  **/
  var clientContext = function (absoluteUrl) {
    // TODO: handle URLs to sites/webs
    var url = absoluteUrl.substring(
      0, absoluteUrl.lastIndexOf('/')) ;

    return sputils.rest.contextInfo(url).then(function (info) {
      // create the context and set the extra prop.
      var cctx = new SP.ClientContext(info.WebFullUrl);
      cctx._info = info;

      return cctx;
    });
  };
  /**
  * Download a file using javascript
  * Useful to implement Export functionality in Search.
  *
  * You can download as csv or text. The function triggers the download
  * not the actual csv creation.
  *
  * Works with utf-8
  *
  * @function sputils.helpers.downloadContent
  * @param {Array<string>} options.
  * @returns {nil}
  * @example
  * var separator = ';';
  * downloadContent({
  *   type: 'text/csv;charset=utf-8',
  *   filename: 'results.csv',
  *   content: ['ASCII', separator,
  *      'Åbäcka sig', separator,
  *      'to się podoba: żźćąęłć',
  *      separator, 'Яшлӑхӑма туйаймарӑм'].join('')
  * });
  **/
  var downloadContent = function (options) {
    if (!options || !options.content) {
      throw new Error('You have at least to provide content to download');
    }
    options.filename = options.filename || 'download.txt';
    options.type = options.type || 'text/plain;charset=utf-8';
    options.bom = options.bom || decodeURIComponent('%ef%bb%bf');
    if (window.navigator.msSaveBlob) {
      var blob = new Blob([options.bom + options.content],
                 {type: options.type});
      window.navigator.msSaveBlob(blob, options.filename);
    }
    else {
      var link = document.createElement('a');
      var content = options.bom + options.content;
      var uriScheme = ['data:', options.type, ','].join('');
      link.href = uriScheme + content;
      link.download = options.filename;
      //FF requires appending it to the DOM to make it clickable
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  /** @namespace */
  sputils.helpers = {
    withSharePointDependencies: withSharePointDependencies,
    abs2rel: abs2rel,
    clientContext: clientContext,
    parseQueryString: parseQueryString,
    downloadContent: downloadContent
  };
})();
