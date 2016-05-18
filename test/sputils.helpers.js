describe('Helpers', function () {
  'use strict';

  it('should have a namespace', function () {
    expect(sputils).to.have.ownProperty('helpers');
  });

  beforeEach(function () {
    global = window;
  });

  describe('parseQueryString', function () {
    it('should return the query string as an object hash', function () {
      var u = ' \u0027';
      var query = '?k1=a&k2=' + encodeURIComponent('some string \u0027') + '&k3=false&k4=0&';
      var qHash = sputils.helpers.parseQueryString(query);

      expect(qHash.k1).to.equal('a');
      expect(qHash.k2).to.equal(encodeURIComponent('some string' + u));
      expect(qHash.k3).to.equal('false');
      expect(qHash.k4).to.equal('0');
    });

    it('should degrade gracefully', function () {
      var qHash = sputils.helpers.parseQueryString();
      expect(qHash).to.deep.equal({});
    });
  });

  describe('abs2rel', function () {
    it('should convert an abs url to the relative part.', function () {
      // mock
      var temp = sputils.lib.getval;
      sputils.lib.getval = function (path) {
        expect(path).to.equal('location.hostname');
        return 'example.com';
      };
      var aurl = 'http://example.com/a/path/to.html';
      var rurl = sputils.helpers.abs2rel(aurl);
      expect(rurl).to.equal('/a/path/to.html');
      sputils.lib.getval = temp;
    });

    it('should degrade gracefully', function () {
      expect(sputils.helpers.abs2rel()).to.equal('/');
    });
  });

  describe('clientContext', function () {
    it('should return a promise that resolves to a clientContext', function (done) {
      var webUrl = 'http://sp-devel:2016/test';
      var id = {};

      fetch = function (url, cfg) {
        return new Promise(function (resolve, reject) {
          resolve({
            d: {
              GetContextWebInformation: {
                WebFullUrl: webUrl
              }
            }
          });
        });
      };

      SP = {
        ClientContext: function (url) {
          expect(url).to.equal(webUrl);
          return id;
        }
      };

      var p = sputils.helpers.clientContext(webUrl + '/file.txt').then(function (cctx) {
        expect(cctx).to.equal(id);
      });

      p.then(done, done);
    });
  });

  describe('withSharePointDependencies', function () {
    it('should handle deps', function (done) {
      var deps = [
        {file: 'f1.js', namespace: 'ns1'},
        {file: 'f2.js', namespace: 'ns2'}
      ];

      SP = {
        Utilities: {
          Utility: {
            getLayoutsPageUrl: function (file) {
              return '/layouts/' + file;
            }
          }
        },
        SOD: {
          registerSod: function (file, url) {
            expect(url).to.equal('/layouts/' + file);
          },
          executeFunc: function (file, namespace, successHandler) {
            successHandler({file: file, namespace: namespace});
          }
        }
      };

      var p = sputils.helpers.withSharePointDependencies(deps).then(function (res) {
        var a = res[0],
            b = res[1];
        expect(a).to.deep.equal(deps[0]);
        expect(b).to.deep.equal(deps[1]);
      });

      p.then(done, done);
    });
  });
  describe('downloadContent', function () {
    it('should require content', function () {
      var options = {};
      var fn = function () {
        sputils.helpers.downloadContent(options);
      };
      expect(fn).to.throw(Error);
    });
  });
});
