describe('Helpers', function () {
  'use strict';

  it('should have a namespace', function () {
    expect(sputils).to.have.ownProperty('helpers');
  });

  beforeEach(function () {
  });

  describe('abs2rel', function () {
    it('should convert an abs url to the relative part.', function () {
      // mock
      sputils.lib.getval = function (path) {
        expect(path).to.equal('location.hostname');
        return 'example.com';
      };
      var aurl = 'http://example.com/a/path/to.html';
      var rurl = sputils.helpers.abs2rel(aurl);
      expect(rurl).to.equal('/a/path/to.html');
    });
  });
});
