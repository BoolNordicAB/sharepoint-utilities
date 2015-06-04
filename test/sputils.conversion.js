describe('SharePoint Conversion Helpers', function () {
  describe('getUserNameFromClaim', function () {
    it('should convert claims string', function () {
      expect(sputils.conversion.getUserNameFromClaim("i:0#.w|contoso\\anatoly"))
        .to.equal("contoso\\anatoly");
    });
  });
});
