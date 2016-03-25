(function () {
  /** @namespace sputils.list.files */
  var checkFile = function (dir, fileUrl) {
    var cctxPromise = sputils.helpers.clientContext(fileUrl);
    return cctxPromise.then(function (cctx) {
      var web = cctx.get_web();
      var page = web.getFileByServerRelativeUrl(
        sputils.helpers.abs2rel(fileUrl));

      if (dir === 'in') {
        page.checkIn();
      } else if (dir === 'out') {
        page.checkOut();
      }

      return new Cctx(cctx).executeQuery();
    });
  };

  var checkIn = function (url) {
    return checkFile('in', url);
  };

  var checkOut = function (url) {
    return checkFile('out', url);
  };

  // public API for this submodule.
  sputils.list = fjs.assign(sputils.list || {}, {
    files: {
      /**
       * Initiates a checkIn operation on the file located at the supplied URL.
       * @function sputils.list.files.checkIn
       * @param {string} url - the URL of the file
       * @returns {Promise} the promise of fulfilling the operation
       * @example
       *
       * sputils.list.files.checkIn('/pages/default.aspx')
       *   .then(function () { console.log('page was checked in') });
       */
      checkIn: checkIn,
      /**
       * Initiates a checkOut operation on the file located at the supplied URL.
       * @function sputils.list.files.checkOut
       * @param {string} url - the URL of the file
       * @returns {Promise} the promise of fulfilling the operation
       * @example
       *
       * sputils.list.files.checkOut('/pages/default.aspx')
       *   .then(function () { console.log('page was checked out') });
       */
      checkOut: checkOut
    }
  });
})();
