
(function () {
  // cf. https://msdn.microsoft.com/en-us/library/office/jj163876.aspx
  var POST_URL_PATH = '/_api/search/postquery';
  var GET_URL_PATH = '/_api/search/query';
  var __metadata = function () {
    return {
      type: 'Microsoft.Office.Server.Search.REST.SearchRequest'
    };
  };

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

  var postSearch = function (cfg, webUrl) {
    return sputils.rest.post(
      (webUrl || _spPageContextInfo.siteServerRelativeUrl) + POST_URL_PATH,
      fjs.assign(cfg, __metadata()));
  };

  /** @namespace */
  sputils.search = {
    searchCfgExample: searchCfgExample,
    postSearch: postSearch
  };
})();
