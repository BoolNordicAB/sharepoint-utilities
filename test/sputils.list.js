describe('SharePoint List API Wrapper', function () {
  'use strict';

  it('should have a namespace', function () {
    expect(sputils).to.have.ownProperty('list');
  });

  beforeEach(function () {
    initialize_dom();
  });

  describe('getListByName', function () {
    it('should have correct config settings', function (done) {
      //Mock jQuery ajax
      fetch = function (url, config) {
        expect(config)
          .to.have.deep.property('headers.accept',
                                 'application/json;odata=verbose');
        expect(config)
          .to.have.property('url',
            'http://example.com/_api/Web/Lists/getByTitle(\'Announcements\')/items/');
        expect(config)
          .to.have.property('method', 'GET');

        return stdPromise();
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
      fetch = function (url, config) {
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
          .to.have.property('method', 'POST');
        expect(config)
          .to.have.property('body', '{"test":"test"}');

        return stdPromise();
      };

      sputils.list.postListByName("Announcements", { "test": "test" })
        .then(function (res) {
          done();
        });
    });
  });


  describe('getListItemById', function () {
    it('should get an item by its id', function (done) {
      var listName = 'Announcements',
          id = 1,
          result = {d: 'success'},
          expUrl = _spPageContextInfo.webAbsoluteUrl +
            "/_api/Web/Lists/getByTitle('" +
            listName + "')/items/getbyid(" + id + ")";

      fetch = function (url, cfg) {
        expect(url.toLowerCase()).to.equal(expUrl.toLowerCase());
        return stdPromise(result);
      };

      sputils.list.getListItemById(listName, id).then(function (item) {
        done();
        expect(item).to.equal(result.d);
      });
    });
  });


  describe('checkFile', function () {
    it('should check a file out or in', function (done) {
      var fileUrl = window.location.hostname + '/subweb1/list1/doc.txt';
      var checkIns = 0;
      var checkOuts = 0;
      fetch = function () {
        return stdPromise({
          d: {
            GetContextWebInformation: {
              WebFullUrl: window.location.hostname + '/subweb1'
            }
          }
        });
      };

      function Ctor(url) {
        // check that code uses `new`
        var is = this instanceof Ctor;
        expect(is).to.equal(true);
        expect(url).to.equal(window.location.hostname + '/subweb1');

        this.executeQueryAsync = function (resolve, reject) {
          resolve({ });
        };

        this.get_web = function () {
          return {
            getFileByServerRelativeUrl: function (relUrl) {
              expect(relUrl).to.equal('/subweb1/list1/doc.txt');
              return {
                checkIn: function () {
                  checkIns++;
                },
                checkOut: function () {
                  checkOuts++;
                }
              };
            }
          };
        };
      }

      SP = {
        ClientContext: Ctor
      };

      sputils.list.checkFile('out', fileUrl).then(function () {
        expect(checkOuts).to.equal(1);
        return sputils.list.checkFile('in', fileUrl);
      }).then(function () {
        expect(checkIns).to.equal(1);
        done();
      });
    });
  });
});
