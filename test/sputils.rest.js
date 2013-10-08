describe('SharePoint REST API Wrapper', function () {
  'use strict';
  it('should have a namespace', function () {
    expect(sputils).to.have.ownProperty('rest');
  });

  describe('get', function () {
    it('should have JSON/OData accept header', function (done) {
      // Stub jQuery ajax
      jQuery.ajax = function (config) {
        expect(config)
          .to.have.deep.property('headers.accept',
                                 'application/json;odata=verbose');
      };

      sputils.rest.get("/")
        .then(function (res) {
          done();
        });
    });
  });
});
