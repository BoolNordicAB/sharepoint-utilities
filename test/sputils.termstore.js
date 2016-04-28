describe('Termstore', function () {

  it('should have a namespace', function () {
    expect(sputils).to.have.ownProperty('termstore');
  });

  var origWithSharePointDependencies;
  var termSetId = 'unique_id#001';
  var termsAsArray;
  var terms;
  var sortOrder = '2:3:0:1';

  function MockTerm(props) {
    fjs.assign(props, this);
  }

  MockTerm.prototype = {
    get_customSortOrder: function () {
      return sortOrder;
    },
    get_id: function () {
      return this.id;
    },
    get_pathOfTerm: function () {
      return this.path;
    },
    get_name: function () {
      return 'NAME#' + this.id;
    },
    get_isRoot: function () {
      var anySemiColonsIn = fjs.any(function (c) {
        return c === ';';
      });

      return !anySemiColonsIn(this.path.split(''));
    }
  };

  beforeEach(function () {
    // yes, mocking SP libs is a full time job :P
    termsAsArray = [
      new MockTerm({ id: '0', path: 'root1' }),
      new MockTerm({ id: '1', path: 'root1;a' }),
      new MockTerm({ id: '2', path: 'root2' }),
      new MockTerm({ id: '3', path: 'root2;b' }),
    ];
    terms = {
      data: termsAsArray,
      // I can't believe I am doing this...
      // talk about over-engineering.
      // a simple for-loop just didn't cut it!
      getEnumerator: function () {
        var idx = -1;
        return {
          get_current: function () {
            return terms.data[idx];
          },
          moveNext: function () {
            idx++;
            return idx < terms.data.length;
          }
        };
      }
    };

    var cctx = {
      load: noop,
      executeQueryAsync: function (ok, err) {
        ok();
      }
    };
    var termSet = {
      get_customSortOrder: function () {
        return sortOrder;
      },
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

  describe('getTermsList', function () {
    it('should result in the array representation of the terms', function (done) {

      var p = sputils.termstore.getTermsList(termSetId).then(function (termsArray) {
        fjs.each(function (node, i) {
          var origTerm = termsAsArray[i];
          origTerm.should.equal(node.term);
        }, termsArray);
      });

      p.then(done, done);
    });
  });

  describe('getTermsTree', function () {
    it('should result in a "tree" representation of the terms', function (done) {

      var p = sputils.termstore.getTermsTree(termSetId).then(function (termsTree) {
        void termsTree.should.be.ok;

        // the direct sorted children of the tree should be the "roots"
        var sc = termsTree.sortedChildren;
        var byId = function (id) {
          return function (node) {
            return node.getGuid() === id.toString();
          };
        };

        var root1 = fjs.first(byId(0), sc);
        var root2 = fjs.first(byId(2), sc);

        // the sortOrder is '2:3:0:1', where 2 and 0 are "roots"
        sc[0].should.equal(root2);
        sc[1].should.equal(root1);

        var root1a = fjs.first(byId(1), root1.sortedChildren);
        var root2b = fjs.first(byId(3), root2.sortedChildren);

        sc[1].sortedChildren[0].should.equal(root1a);
        sc[0].sortedChildren[0].should.equal(root2b);
      });

      p.then(done, done);
    });
  });

  describe('Wrappers', function () {

    it('should expose a nice(r) API to the taxonomy objects', function (done) {

      var p = sputils.termstore.getTermsList(termSetId).then(function (list) {
        list.length.should.not.equal(0);
        var t = list[0]; // not sorted by sortOrder, so will be equivalent to root1

        t.getGuid().should.equal('0');
        t.getIsRoot().should.equal(true);
        t.getName().should.equal('NAME#0');
      });

      p.then(done, done);
    });
  });
});
