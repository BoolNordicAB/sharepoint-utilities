describe('SharePoint REST API Wrapper', function () {
  'use strict';
  it('should have a namespace', function () {
    expect(sputils).to.have.ownProperty('rest');
  });

  beforeEach(function () {
    initialize_jquery();
    initialize_dom();
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
        expect(config.url)
          .to.equal('http://example.com/');
        expect(config)
          .to.have.property('type', 'GET');
      };

      sputils.rest.get("/")
        .then(function (res) {
          done();
        });
    });

    it('should allow absolute urls', function (done) {
      // Mock jQuery ajax
      jQuery.ajax = function (config) {
        expect(config.url)
          .to.equal('http://example.com/');
      };

      sputils.rest.get("http://example.com/")
        .then(function (res) {
          done();
        });
    });
  });

  describe('post', function () {
    it('should have correct config settings', function (done) {
      // Mock jQuery ajax
      jQuery.ajax = function (config) {
        expect(config)
          .to.have.deep.property('headers.accept',
                                 'application/json;odata=verbose');
        expect(config)
          .to.have.deep.property('headers.X-RequestDigest',
                                 'TestValue');
        expect(config)
          .to.have.property('url');
        expect(config)
          .to.have.property('type', 'POST');
        expect(config)
          .to.have.property('data', '{"test":"test"}');
      };

      sputils.rest.post("/", {"test":"test"})
        .then(function (res) {
          done();
        });
    });
  });

  describe('getListByName', function () {
    it('should have correct config settings', function (done) {
      //Mock jQuery ajax
      jQuery.ajax = function (config) {
        expect(config)
          .to.have.deep.property('headers.accept',
                                 'application/json;odata=verbose');
        expect(config)
          .to.have.property('url',
            'http://example.com/_api/Web/Lists/getByTitle(\'Announcements\')/items/');
        expect(config)
          .to.have.property('type', 'GET');
      };

      sputils.rest.getListByName("Announcements")
        .then(function (res) {
          done();
        });
    });
  });

  describe('postListByName', function () {
    it('should have correct config settings', function (done) {
      //Mock jQuery ajax
      jQuery.ajax = function (config) {
        expect(config)
          .to.have.deep.property('headers.accept',
                                 'application/json;odata=verbose');
        expect(config)
          .to.have.deep.property('headers.X-RequestDigest',
                                 'TestValue');
        expect(config)
          .to.have.property('url',
            'http://example.com/_api/Web/Lists/getByTitle(\'Announcements\')/items/');
        expect(config)
          .to.have.property('type', 'POST');
        expect(config)
          .to.have.property('data', '{"test":"test"}');
      };

      sputils.rest.postListByName("Announcements", { "test": "test" })
        .then(function (res) {
          done();
        });
    });
  });
});
