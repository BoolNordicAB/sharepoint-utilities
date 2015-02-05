describe('SharePoint User Profile Helpers', function () {
  describe('getCurrentUserPersonalSiteUrl', function () {
   it('should have correct config settings', function (done) {
      // Mock jQuery ajax
      jQuery.ajax = function (config) {
        expect(config)
          .to.have.deep.property('headers.accept',
                                 'application/json;odata=verbose');
        expect(config)
          .to.have.property('url');
        expect(config.url)
          .to.equal('http://example.com/_api/SP.UserProfiles.PeopleManager/GetMyProperties?$select=UserUrl');
        expect(config)
          .to.have.property('type', 'GET');

        return {
          d: {
            UserUrl: ''
          }
        }
      };

      sputils.userprofile.getCurrentUserPersonalSiteUrl()
        .then(function (res) {
          done();
        });
    });
  });
});
