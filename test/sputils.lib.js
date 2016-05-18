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
        c: {es: '', n: false, z: 0, e: null, f: function () {}},
        d: [null, 1, {'long prop name': 9}]
      }
    }
  };

  describe('Cctx', function () {
    var message = 'MESSAGE';
    var guid = 'GUID';
    var spClientContext = {
      executeQueryAsync: function (ok, err) {
        err(spClientContext, {
          get_message: function () {
            return message;
          },
          get_errorTraceCorrelationId: function () {
            return guid;
          }
        });
      }
    };

    it('should handle errors nicely', function (done) {
      var ctx = new Cctx(spClientContext);

      var p = ctx.executeQuery().then(function () {
        throw new Error('no');
      }, function (err) {
        err.constructor.should.equal(Error);
        void err.message.indexOf(message).should.be.ok;
        void err.message.indexOf(guid).should.be.ok;
      });

      p.then(done, done);
    });
  });

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

  describe('tap', function () {
    it('should produce a side effect', function () {
      var tap = sputils.lib.tap;
      var a = 0;
      function inc() {
        a++;
      }

      var identityWithSideEffect = tap(inc);

      var id = {};
      expect(a).to.equal(0);
      expect(identityWithSideEffect(id)).to.equal(id);
      expect(a).to.equal(1);
    });
  });
});
