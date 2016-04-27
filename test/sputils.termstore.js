describe('Termstore', function () {

  it('should have a namespace', function () {
    expect(sputils).to.have.ownProperty('termstore');
  });

  var origWithSharePointDependencies;
  var termSetId = 'unique_id#001';
  var terms = [

  ];

  beforeEach(function () {
    // yes, mocking SP libs is a full time job :P
    var cctx = {
      load: noop,
      executeQueryAsync: function (ok, err) {
        ok();
      }
    };
    var termSet = {
      getAllTerms: function () {
        return terms;
      }
    };
    var termStore = {
      getTermSet: function (id) {
        id.should.equal(termSetId);
        return termSet;
      }
    };
    var taxSession = {
      getDefaultSiteCollectionTermStore: function () {
        return termStore;
      }
    };
    var initSPLibs = function () {
      SP = {
        ClientContext: {
          get_current: function () {
            return cctx;
          }
        },
        Taxonomy: {
          TaxonomySession: {
            getTaxonomySession: function (localCtx) {
              localCtx.should.equal(cctx);
              return taxSession;
            }
          }
        }
      };
    };
    // this is not the function we are testing now, so mock it.
    var origWithSharePointDependencies = sputils.helpers.withSharePointDependencies;
    sputils.helpers.withSharePointDependencies = function (deps) {
      deps.length.should.equal(1);
      deps[0].file.should.equal('sp.taxonomy.js');
      deps[0].namespace.should.equal('SP.Taxonomy');

      initSPLibs();
      return Promise.resolve();
    };
  });

  afterEach(function () {
    SP.Taxonomy = null;
    // reset old fn
    sputils.helpers.withSharePointDependencies = origWithSharePointDependencies;
  });

  describe('withTaxonomyDeps', function () {
    it('should return a Promise that resolves after the taxonomy deps are loaded',
       function (done) {
         sputils.termstore.withTaxonomyDeps().then(function () {
           // the deps are now loaded!
           done();
         }, done);
       });
  });

  describe('getTerms', function () {

    it('should return all terms in the termSet with the supplied ID',
       function (done) {
         var p = sputils.termstore.getTerms(termSetId).then(function (result) {
           result.should.equal(terms);
         });

         p.then(done, done);
       });
  });
});
