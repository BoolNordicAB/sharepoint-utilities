describe('SharePoint REST API Wrapper', function () {
  'use strict';
  it('should have a namespace', function () {
    expect(sputils).to.have.ownProperty('rest');
  });

  function thrower(done) {
    return function () {
      throw new Error();
    };
  }

  beforeEach(function () {
    initialize_dom();
  });

  describe('requestFormDigest', function () {
    it('should fetch the form digest value', function (done) {
      var a = document.getElementById('__REQUESTDIGEST');
      a.parentNode.removeChild(a);
      var idVal = '#123';

      fetch = function (url, cfg) {
        return new Promise(function(resolve, reject) {
          resolve({
            d: {
              GetContextWebInformation: {
                FormDigestValue: idVal
              }
            }
          });
        });
      };

      sputils.rest.withRequestDigest(true).then(function (rd) {
        done();
        expect(rd).to.equal(idVal);
      }, thrower(done));
    });
  });

  describe('get', function () {
    it('should have correct config settings', function (done) {
      // Mock jQuery ajax
      fetch = function (url, config) {
        expect(config)
          .to.have.deep.property('headers.accept',
                                 'application/json;odata=verbose');
        expect(config)
          .to.have.property('url');
        expect(config.url)
          .to.equal('http://example.com/');
        expect(config)
          .to.have.property('method', 'GET');

        return stdPromise();
      };

      sputils.rest.get("/")
        .then(function (res) {
          done();
        });
    });

    it('should allow absolute urls', function (done) {
      // Mock jQuery ajax
      fetch = function (url, config) {
        expect(url)
          .to.equal('http://example.com/');

        return stdPromise();
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
      fetch = function (url, config) {
        expect(config)
          .to.have.deep.property('headers.accept',
                                 'application/json;odata=verbose');
        expect(config)
          .to.have.deep.property('headers.X-RequestDigest');
        expect(config)
          .to.have.property('method', 'POST');
        expect(config)
          .to.have.property('body', '{"test":"test"}');
        return stdPromise();
      };

      sputils.rest.post("/", {"test":"test"})
        .then(function (res) {
          done();
        }, thrower(done));
    });
  });
});
