describe('Search module', function () {
  'use strict';

  it('should have a namespace', function () {
    expect(sputils).to.have.ownProperty('search');
  });


  describe('searchCfgExample', function () {
    it('should be there', function () {
      expect(sputils.search.searchCfgExample()).to.have.ownProperty('Querytext');
    });
  });

  describe('postSearch', function () {
    it('should operate accordingly', function (done) {
      var result = {};

      fetch = function (url, config) {
        expect(config)
          .to.have.deep.property('headers.Accept',
                                 'application/json;odata=verbose');
        expect(config)
          .to.have.deep.property('headers.Content-Type',
                                 'application/json;odata=verbose;charset=utf-8');

        var body = JSON.parse(config.body);
        expect(body).to.have
          .deep.property('request.__metadata.type',
                         'Microsoft.Office.Server.Search.REST.SearchRequest');
        expect(body).to.have
          .deep.property('request.Querytext',
                         '*');
        return stdPromise({
          d: {
            postquery: result
          }
        });
      };

      var p = sputils.search.postSearch({ Querytext: '*' }).then(function (res) {
        res.should.equal(result);
      });

      p.then(done, done);
    });
  });

  describe('mapRowToHash', function () {
    it('should map a search result Row to an object hash', function () {
      sputils.DEBUG = true;
      var resultRow = {
        __metadata: {
          type: 'SP.SimpleDataRow'
        },
        Cells: {
          results: [
            {
              __metadata: {
                type: 'SP.KeyValue'
              },
              Key: 'Rank',
              Value: '7.377516746521',
              ValueType: 'Edm.Double'
            },
            {
              __metadata: {
                type: 'SP.KeyValue'
              },
              Key: 'piSearchResultId',
              Value: '0_1',
              ValueType: 'Edm.String'
            }
          ]
        }
      };

      var mapped = sputils.search.mapRowToHash(resultRow);

      expect(mapped.Rank).to.equal(resultRow.Cells.results[0].Value);
      expect(mapped.piSearchResultId).to.equal(resultRow.Cells.results[1].Value);
    });
  });

  describe('extractResultRows', function () {
    it('should get a specific deep property', function () {
      var ref = [];

      var result = {
        __metadata: {
          type: 'Microsoft.Office.Server.Search.REST.SearchResult'
        },
        PrimaryQueryResult: {
          RelevantResults: {
            Table: {
              Rows: {
                results: ref
              }
            }
          }
        }
      };

      var res = sputils.search.extractResultRows(result);

      expect(res).to.equal(ref);
    });
  });
});
