describe('SharePoint User Profile Helpers', function () {
  describe('loginAsAnotherUser', function () {
    it('alters location correctly', function () {
      global = {location: {}};
      sputils.user.loginAsAnotherUser();

      expect(global.location.href)
        .to.equal('/_layouts/closeconnection.aspx?loginasanotheruser=true');
      global = null;
    });
  });

  describe('logoutUser', function () {
    it('alters location correctly', function () {
      global = {location: {}};
      sputils.user.logoutUser();

      expect(global.location.href)
        .to.equal('/_layouts/closeconnection.aspx');
      global = null;
    });
  });

  describe('getCurrentUser ', function () {
    var initMocks = function (opts) {
      var counter = 0;
      var inc = function () {
        counter++;
      };

      var user = {};
      var web = {
        get_currentUser: function () {
          inc();
          return user;
        }
      };

      SP = {
        ClientContext: {
          get_current: function () {
            return {
              load: function (what) {
                inc();
                what.should.equal(user);
              },
              executeQueryAsync: function (ok, err) {
                inc();
                if (opts.success) {
                  ok();
                } else {
                  err();
                }
              },
              get_web: function () {
                inc();
                return web;
              }
            };
          }
        }
      };

      return {
        user: user,
        getCounter: function () {
          return counter;
        }
      };
    };

    it('returns a promise which is resolved with the current user', function (done) {
      var testData = initMocks({success: true});

      var p = sputils.user.getCurrentUser().then(function (result) {
        result.should.equal(testData.user);
        testData.getCounter().should.equal(4);
      });

      p.then(done, done);
    });

    it('rejects the Promise when something bad happens', function (done) {
      var testData = initMocks({success: false});

      var p = sputils.user.getCurrentUser().then(function () {
        throw new Error('should not happen');
      }, function (err) {
        void err.should.be.ok;
      });

      p.then(done, done);
    });
  });

  describe('getCurrentUserPersonalSiteUrl', function () {
    it('should have correct config settings', function (done) {
      // Mock request object
      fetch = function (url, config) {
        expect(config)
          .to.have.deep.property('headers.Accept',
                                 'application/json;odata=verbose');
        expect(url)
          .to.equal('http://example.com/_api/SP.UserProfiles.PeopleManager/GetMyProperties?$select=UserUrl');
        expect(config)
          .to.have.property('method', 'GET');

        return stdPromise({
          d: {
            UserUrl: ''
          }
        });
      };

      sputils.user.getCurrentUserPersonalSiteUrl()
       .then(done, done);
    });
  });
});
