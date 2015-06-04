describe('SharePoint User Profile Helpers', function () {
  describe('getCurrentUserPersonalSiteUrl', function () {
   it('should have correct config settings', function (done) {
      // Mock jQuery
      fetch = function (url, config) {
        expect(config)
          .to.have.deep.property('headers.accept',
                                 'application/json;odata=verbose');
        expect(url)
          .to.equal('/_api/SP.UserProfiles.PeopleManager/GetMyProperties?$select=UserUrl');
        expect(config)
          .to.have.property('method', 'GET');

        return {
          d: {
            UserUrl: ''
          }
        };
      };

      sputils.userprofile.getCurrentUserPersonalSiteUrl()
        .then(function (res) {
          done();
        });
    });
  });
});
