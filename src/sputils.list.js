(function () {
  var listByNameGetItems = function (name, config) {
    var url = "/_api/Web/Lists/getByTitle('%NAME')/items/".replace('%NAME', name);
    return sputils.rest.get(url, config)
      .then(sputils.rest.unwrapResults);
  };

  var listByNamePostItems = function (name, data, config) {
    var url = "/_api/Web/Lists/getByTitle('%NAME')/items/".replace('%NAME', name);
    return sputils.rest.post(url, data, config)
      .then(sputils.rest.unwrapResults);
  };

  var listByNameGetItemById = function (name, itemId, config) {
    var url = "/_api/Web/Lists/getByTitle('%NAME')/items/getbyid(%ID)"
          .replace('%NAME', name)
          .replace('%ID', itemId);
    return sputils.rest.get(url, config)
      .then(sputils.rest.unwrapResults);
  };

  /**
   * exposes operations on a list qualified by name.
   * @function sputils.list.byName
   * @param {string} name a list name
   * @returns {object} an object exposing operations possible on the list.
   *
   * @example
   *
   * var list = sputils.list.byName('announcements');
   * list.getItems().then(...);
   */
  var byName = function (name) {
    return {
      /**
       * Returns the list items from the given list name.
       * @function sputils.list.byName(name).getItems
       * @memberof! sputils.list
       * @param {Optional<object>} config the http config
       * @returns {Promise<array>} the array containing the list items.
       *
       * @example
       *
       * sputils.list.byName('Announcements').getItems()
       *   .then(function (data) { console.log(data.d.results) });
       *
       */
      getItems: function (config) {
        return listByNameGetItems(name, config);
      },

      /**
       * Returns the list item with the specified id.
       * @function sputils.list.byName(name).getItemById
       * @memberof! sputils.list
       * @param {object} data the payload
       * @param {Optional<object>} config the http config
       * @returns {Promise<object>} List item
       *
       * @example
       *
       * sputils.list.byName('Announcements').getItemById(1)
       *   .then(function (data) { console.log(data) });
       */
      getItemById: function (id, config) {
        return listByNameGetItemById(name, id, config);
      },

      /**
       * Modifies list items in the given list.
       * @function sputils.list.byName(name).postItems
       * @memberof! sputils.list
       * @param {object} data the payload
       * @param {object} config the http config
       * @returns {Promise<object>}
       *
       * @example
       *
       * var data = {
       *   __metadata: { type: "SP.Data.AnnouncementsListItem"}
       *   Title: "listlessly POSTing",
       * };
       * sputils.list.byName("Announcements").postItems(data)
       *   .then(function (data) { console.log(data); });
       */
      postItems: function (data, config) {
        return listByNamePostItems(name, data, config);
      }
    };
  };

  /** @namespace */
  sputils.list = fjs.assign(sputils.list || {}, {
    byName: byName
  });
})();
