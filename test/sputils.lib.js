describe('SPUTILS LIB', function () {
  'use strict';

  it('should have a namespace', function () {
    expect(sputils).to.have.ownProperty('lib');
  });

  beforeEach(function () {
  });

  var testObjects = {
    a: {
      b: {
        c: { es: '', n: false, z: 0, e: null, f: function(){} },
        d: [null, 1, {'long prop name': 9}]
      }
    }
  };

  describe('getval()', function () {
    it('Fetch a deep property without crashing on nulls and undefined.', function () {
      var nul = sputils.lib.getval('a.b.c.e', testObjects);
      expect(nul).to.equal(null);

      // should not throw
      expect(sputils.lib.getval('a.nonexistant.c', testObjects)).to.equal(void 0);
    });

    it('should find falsy values', function () {
      var getval = sputils.lib.getval;
      expect(getval('a.b.c.z', testObjects)).to.equal(0);
      expect(getval('a.b.c.n', testObjects)).to.equal(false);
      expect(getval('a.b.c.es', testObjects)).to.equal('');
    })

    it('should use the global object as root if no root is supplied', function () {
      window.p = { q: 1 };

      var res = sputils.lib.getval('p.q');
      expect(res).to.equal(window.p.q);

      var getval = sputils.lib.getval;
      expect(getval('p.q')).to.equal(window.p.q);
    });

    it('should be dynamic', function () {
      testObjects.getval = sputils.lib.getval;
      expect(testObjects.getval('a.b')).to.equal(testObjects.a.b);
    });

    it('should allow any kind of property name', function () {
      var getval = sputils.lib.getval;
      var res = getval('a.b.d.2.long prop name', testObjects);
      expect(res).to.equal(9);
    });
  });
});
