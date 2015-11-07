describe('Search module', function () {
  'use strict';

  it('should have a namespace', function () {
    expect(sputils).to.have.ownProperty('search');
  });


  describe('searchCfgExample', function () {
    expect(sputils.search.searchCfgExample()).to.have.ownProperty('Querytext');
  });

  describe('postSearch', function (done) {
    fetch = function (url, config) {
      expect(config)
        .to.have.deep.property('headers.accept',
                               'application/json;odata=verbose');
      expect(config).to.have
        .deep.property('data.__metadata.type',
                       'Microsoft.Office.Server.Search.REST.SearchRequest');
      return stdPromise();
    };

    sputils.search.postSearch({ Querytext: '*' }).then(function (res) {
      done();
    });
  });
});
