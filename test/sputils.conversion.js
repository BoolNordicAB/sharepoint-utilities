describe('SharePoint Conversion Helpers', function () {
  describe('convertClaimsToAd', function () {
    it('should convert claims string', function () {
      expect(sputils.conversion.convertClaimsToAd("i:0#.w|contoso\\anatoly"))
        .to.equal("contoso\\anatoly");
    });
  });
});
