describe('SharePoint List API Wrapper', function () {
  'use strict';

  it('should have a namespace', function () {
    expect(sputils).to.have.ownProperty('list');
  });

  beforeEach(function () {
    initialize_jquery();
    initialize_dom();
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

        return { d: { results: [] } };
      };

      sputils.list.getListByName("Announcements")
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

        return { d: { results: [] } };
      };

      sputils.list.postListByName("Announcements", { "test": "test" })
        .then(function (res) {
          done();
        });
    });
  });
});
