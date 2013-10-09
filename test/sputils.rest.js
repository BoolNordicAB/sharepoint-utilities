describe('SharePoint REST API Wrapper', function () {
  'use strict';
  it('should have a namespace', function () {
    expect(sputils).to.have.ownProperty('rest');
  });

  beforeEach(function () {
    initialize_jquery();
  });

  describe('get', function () {
    it('should have correct config settings', function (done) {
      // Mock jQuery ajax
      jQuery.ajax = function (config) {
        expect(config)
          .to.have.deep.property('headers.accept',
                                 'application/json;odata=verbose');
        expect(config)
          .to.have.property('url');
        expect(config)
          .to.have.property('type', 'GET');
      };

      sputils.rest.get("/")
        .then(function (res) {
          done();
        });
    });
  });

  describe('post', function () {
    it('should have correct config settings', function (done) {

      /* jshint evil: true */
      document.write("<input id=__REQUESTDIGEST val=TestValue />");
      /* jshint evil: false */

      jQuery.ajax = function (config) {
        expect(config)
          .to.have.deep.property('headers.accept',
                                 'application/json;odata=verbose');
        expect(config)
          .to.have.property('url');
        expect(config)
          .to.have.property('type', 'POST');
      };

      sputils.rest.post("/", {"test":"test"})
        .then(function (res) {
          done();
        });
    });
  });
});
