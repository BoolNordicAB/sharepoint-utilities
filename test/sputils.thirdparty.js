describe('3rd party', function () {
  describe('moment', function () {
    it('should return the list of mappings', function () {
      var mappings = sputils.thirdParty.moment.tz.links();
      void expect(mappings).to.be.ok;
    });
  });
});
