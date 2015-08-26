(function () {
  /**
  * Returns the list items from the given list name.
  * @function sputils.lists.getListByName
  * @param {string} name a list name
  * @returns {array}
  * @example
  *
  * sputils.list.getListByName('Announcements')
  *   .then(function (data) { console.log(data.d.results) });
  *
  */
  var getListByName = function (name, config) {
    var url = '/_api/Web/Lists/getByTitle(\'' + name + '\')/items/';
    return sputils.rest.get(url, config)
      .then(sputils.rest.unwrapResults);
  };

  /**
  * Modifies list items in the given list.
  * @function sputils.lists.postListByName
  * @param {string} name a list name
  * @param {object} data the payload
  * @param {object} config the config
  * @returns {object} Promise
  * @example
  *
  * var data = {"Title": "listlessly POSTing",
  *             "__metadata": { type: "SP.Data.AnnouncementsListItem"} };
  * sputils.list.postListByName("Announcements", data)
  *   .then(function (data) { console.log(data); });
  */
  var postListByName = function (name, data, config) {
    var url = '/_api/Web/Lists/getByTitle(\'' + name + '\')/items/';
    return sputils.rest.post(url, data, config)
      .then(sputils.rest.unwrapResults);
  };

  /**
  * Returns the list item with the specified id.
  * @function sputils.lists.getListItemById
  * @param {string} name a list name
  * @param {object} data the payload
  * @param {object} config the config
  * @returns {array} List items
  * @example
  *
  * sputils.list.getListItemById('Announcements', 1)
  *   .then(function (data) { console.log(data.d.results) });
  */
  var getListItemById = function (listName, itemId, config) {
    var url = '/_api/Web/Lists/getByTitle(\'' + listName + '\')/items/getbyid(' + itemId + ')';
    return sputils.rest.get(url, config)
      .then(sputils.rest.unwrapResults);
  };

  var files = (function () {
    function checkFile(dir, fileUrl) {
      var cctxPromise = sputils.helpers.clientContext(fileUrl);
      return cctxPromise.then(function (cctx) {
        var web = cctx.get_web();
        var page = web.getFileByServerRelativeUrl(
          fileUrl.split(global.location.hostname)[1]);

        if (dir === 'in') {
          page.checkIn();
        } else if (dir === 'out') {
          page.checkOut();
        }

        return new Promise(cctx.executeQueryAsync);
      });
    }

    function checkIn(url) {
      return checkFile('in', url);
    }

    function checkOut(url) {
      return checkFile('out', url);
    }

    // public API for this submodule.
    return {
      /**
      * Initiates a checkIn operation on the file located at the supplied URL.
      * @function sputils.lists.files.checkIn
      * @param {string} url: the URL of the file
      * @returns {Promise} the promise of fulfilling the operation
      * @example
      *
      * sputils.list.files.checkIn('/pages/default.aspx')
      *   .then(function () { console.log('page was checked in') });
      */
      checkIn: checkIn,
      /**
      * Initiates a checkOut operation on the file located at the supplied URL.
      * @function sputils.lists.files.checkOut
      * @param {string} url: the URL of the file
      * @returns {Promise} the promise of fulfilling the operation
      * @example
      *
      * sputils.list.files.checkOut('/pages/default.aspx')
      *   .then(function () { console.log('page was checked in') });
      */
      checkOut: checkOut
    };
  })();

  /** @namespace */
  sputils.list = {
    getListByName: getListByName,
    postListByName: postListByName,
    getListItemById: getListItemById,
    files: files
  };
})();
