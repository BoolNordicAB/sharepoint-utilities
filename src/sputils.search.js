(function () {
  /**
   * @private
   * @const search.POST_URL_PATH the sub-path used for POST requests */
  var POST_URL_PATH = '_api/search/postquery';

  /**
   * @private
   * @const search.GET_URL_PATH the sub-path used for GET requests */
  var GET_URL_PATH = '_api/search/query';

  /**
   * @private
   * @returns {object}
   * __metadata for use in POST requests' bodies to search API */
  var __metadata = function () {
    return {
      __metadata: {
        type: 'Microsoft.Office.Server.Search.REST.SearchRequest'
      }
    };
  };

  /**
   * An example search configuration
   * @function sputils.search.searchCfgExample
   * @see {@link https://msdn.microsoft.com/en-us/library/office/jj163876.aspx}
   * @returns {object} a new object instance of a SearchConfigurationExample
   */
  var searchCfgExample = function () {
    return {
      // A string that contains the text for the search query.
      'Querytext': 'sharepoint',
      // A string that contains the text that replaces the query text, as part
      // of a query transform.
      'Querytemplate': '{searchterms} Author:johndoe',
      // A 'Boolean' value that specifies whether the result tables that are
      // returned for the result block are mixed with the result tables that
      // are  returned for the original query.
      // true to mix the ResultTables; otherwise, false. The default value
      // is true. Change this value only if you want to provide your own
      // interleaving implementation.
      'EnableInterleaving': 'True',
      // The result source ID to use for executing the search query.
      'SourceId': '8413cd39-2156-4e00-b54d-11efd9abdb89',
      // The ID of the ranking model to use for the query.
      'RankingModelId': 'CustomRankingModelID',
      // The first row that is included in the search results that are
      //  returned. You use this parameter when you want to implement
      // paging for search results.
      'StartRow': '10',
      // The maximum number of rows overall that are returned in the search
      //  results. Compared to RowsPerPage, RowLimit is the maximum number
      //  of rows returned overall.
      'RowLimit': '30',
      // The maximum number of rows to return per page. Compared to RowLimit,
      // RowsPerPage refers to the maximum number of rows to return per
      // page, and is used primarily when you want to implement paging for
      // search results.
      'RowsPerPage': '10',
      // The managed properties to return in the search results. To return
      // a managed property, set the property's retrievable flag to true
      //  in the search schema.
      'SelectProperties': {
        'results': [
          'Title',
          'Author'
        ]
      },
      // The locale ID (LCID) for the query.
      // https://msdn.microsoft.com/en-us/goglobal/bb964664.aspx
      'Culture': '1044',
      // The set of refinement filters used when issuing a refinement
      // query. For GET requests, the RefinementFilters parameter is
      // specified as an FQL filter. For POST requests, the RefinementFilters
      // parameter is specified as an array of FQL filters.
      'RefinementFilters': {
        'results': ['fileExtension:equals("docx")']
      },
      // The set of refiners to return in a search result.
      'Refiners': {
        'results': ['author,size']
      },
      // The additional query terms to append to the query.
      'HiddenConstraints': 'developer',
      // The list of properties by which the search results are ordered.
      'SortList': {
        'results': [
          {
            'Property': 'Created',
            'Direction': '0'
          },
          {
            'Property': 'FileExtension',
            'Direction': '1'
          }
        ]
      },
      // A Boolean value that specifies whether stemming is enabled.
      'EnableStemming': 'False',
      // A Boolean value that specifies whether duplicate items are removed
      // from the results.
      'TrimDuplicates': 'False',
      // The amount of time in milliseconds before the query request times
      // out. The default value is 30000.
      'Timeout': '60000',
      // A Boolean value that specifies whether the exact terms in the search
      // query are used to find matches, or if nicknames are used also.
      'EnableNicknames': 'True',
      'EnablePhonetic': 'True',
      'EnableFQL':'True',
      'BypassResultTypes': 'true',
      'ProcessBestBets': 'true',
      'ClientType':'custom',
      'PersonalizationData': '<GUID>',
      'ResultURL': 'http://server/site/resultspage.aspx',
      'QueryTag': 'tag1;tag2',
      'Properties': {
        'results': [
          {
            'Name': 'sampleBooleanProperty',
            'Value': {
              'BoolVal': 'True',
              // QueryPropertyValueType specifies the type for the property;
              // each type has a specific index value.
              // https://msdn.microsoft.com/en-us/library/office/microsoft.office.server.search.query.querypropertyvaluetype.aspx
              'QueryPropertyValueTypeIndex': 3
            }
          },
          {
            'Name': 'sampleIntProperty',
            'Value': {
              'IntVal': '1234',
              'QueryPropertyValueTypeIndex': 2
            }
          }
        ]
      },
      'EnableQueryRules': 'False' ,
      'ReorderingRules':  {
        'results': [
          {
            'MatchValue': '<someValue>',
            'Boost': '10',
            'MatchType': '0'
          }
        ]
      },
      'ProcessPersonalFavorites': 'false',
      'QueryTemplatePropertiesUrl': 'spfile://webroot/queryparametertemplate.xml',
      'HitHighlihtedMultivaluePropertyLimit': '2',
      'CollapseSpecification': 'Author:1 ContentType:2',
      'EnableSorting': 'false',
      'GenerateBlockRankLog': 'true',
      'UILanguage': '1044',
      'DesiredSnippetLength': '80',
      'MaxSnippetLength': '100' ,
      'Summarylength': '150'
    };
  };

  var ensureEndsWithSlash = function (str) {
    var SLASH = '/';
    var lastIsSlash = (str || '').slice(-1)[0] === SLASH;
    if (!lastIsSlash) {
      return str + SLASH;
    }

    return str;
  };

  /**
   * Make a search request with a POST method. Useful if complex data needs
   * to be sent to the server.
   * <pre>
   * Use POST requests in the following scenarios:
   * - When you'll exceed the URL length restriction with a GET request.
   * - When you can't specify the query parameters in a simple URL.
   *   For example, if you have to pass parameter values that contain
   *   a complex type array, or comma-separated strings, you have more
   *   flexibility when constructing the POST request.
   * - When you use the ReorderingRules parameter because it is supported only with POST requests.
   * </pre>
   * @function sputils.search.postSearch
   * @param {object} cfg the search configuration.
   * @see sputils.search.searchCfgExample or SharePoint Search Query Tool
   * @param {string} [webUrl] the url of the web to use as the context.
   * @returns {Promise<object>} the search result
   * @example
   * sputils.search.postSearch({Querytext: 'ContentType:0x01*'})
   *   .then(function (result) { console.log(result) });
   */
  var postSearch = function (cfg, webUrl) {
    var url = webUrl || _spPageContextInfo.siteServerRelativeUrl;
    var data = {
      request: fjs.assign(cfg, __metadata())
    };

    return sputils.rest.post(
      ensureEndsWithSlash(url) + POST_URL_PATH,
      data)
      .then(function unwrap(data) {
        return data.d.postquery;
      });
  };

  /**
   * @ignore
   * @summary
   * checks an object returned from the search API to be a specific type.
   */
  var checkType = function (obj, type) {
    var err;
    if (obj.__metadata.type !== type) {
      if (sputils.DEBUG) {
        err = new TypeError([
          'Do not know how to handle an object with __metadata ===',
          obj.__metadata.type
        ].join(''));

        console.warn(err);
      }

      return false;
    }

    return true;
  };

  /**
   * @summary
   * takes an object of type `Microsoft.Office.Server.Search.REST.SearchResult`,
   * and gets the actual result rows.
   * @param {Microsoft.Office.Server.Search.REST.SearchResult} postqueryObject
   * the postquery object of the result from doing a request to the search API.
   * @returns {Array<SP.SimpleDataRow>} the result rows
   * @example
   * sputils.search.postSearch({Querytext: '*'})
   *   .then(function (result) {
   *     var rows = sputils.search.extractResultRows(result);
   *     return rows;
   *   });
   */
  var extractResultRows = function (postqueryObject) {
    var type = 'Microsoft.Office.Server.Search.REST.SearchResult';
    if (!checkType(postqueryObject, type)) {
      return {};
    }

    return postqueryObject.PrimaryQueryResult.RelevantResults.Table.Rows.results;
  };

  /**
   * @summary
   * Takes an object returned from the SP Search API, which contains
   * a `Cells` property, which in turn, contains the data in the form
   * of key/value pairs.
   * @param {SP.SimpleDataRow} row - the row.
   * @returns {object} - the object hash representation of the row.
   * @example
   * sputils.search.postSearch({Querytext: '*'})
   *   .then(function (result) {
   *     var rows = sputils.search.extractResultRows(result);
   *     return sputils.fjs.map(
   *       sputils.search.mapRowToHash,
   *       rows);
   *   })
   *   .then(function (parsed) {
   *     console.log(parsed);
   *   });
   */
  var mapRowToHash = function (row) {
    var type = 'SP.SimpleDataRow';
    if (!checkType(row, type)) {
      return {};
    }

    var kvPairs = row.Cells.results;

    var map = fjs.fold(function (out, next) {
      out[next.Key] = next.Value;
      return out;
    }, {});

    return map(kvPairs);
  };

  /** @namespace */
  sputils.search = {
    searchCfgExample: searchCfgExample,
    postSearch: postSearch,
    mapRowToHash: mapRowToHash,
    extractResultRows: extractResultRows
  };
})();
