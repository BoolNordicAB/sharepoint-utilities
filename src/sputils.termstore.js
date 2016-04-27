(function () {
  // a function that creates common properties on a Node-like
  // object. A Node-like object has children, and sortedChildren
  var initNode = function (n) {
    // indexed by name, no guaranteed order
    n.children = {};
    // indexed by order (by custom sort order if defined)
    n.sortedChildren = [];
  };

  var TermsTree = function (termSet) {
    this.termSet = termSet;

    initNode(this);
  };

  TermsTree.prototype = {
    getSortOrder: function () {
      return this.termSet.get_customSortOrder();
    }
  };

  // A data structure wrapping SP.Term objects
  // with convenience functions and a children object
  var Node = function (term) {
    this.term = term;

    initNode(this);
  };

  Node.prototype = {
    getName: function () {
      return this.term.get_name();
    },

    getUrl: function () {
      return this.term.get_localCustomProperties()
        ._Sys_Nav_SimpleLinkUrl;
    },

    getSortOrder: function () {
      return this.term.get_customSortOrder();
    },

    getIsRoot: function () {
      return this.term.get_isRoot();
    },

    getGuid: function () {
      return this.term.get_id();
    },

    getLocalCustomProperty: function (propertyName) {
      return this.term.get_localCustomProperties()[propertyName];
    },

    toString: function () {
      return this.getName();
    },
    toLocaleString: function () {
      return this.getName();
    }
  };

  var generateList = function (terms) {
    var termsEnumerator = terms.getEnumerator(),
        result = [];

    while (termsEnumerator.moveNext()) {
      result.push(termsEnumerator.get_current());
    }

    return result;
  };

  // Generates the link tree by going through them one
  // by one and putting them in the correct hierarchy
  var generateTree = function (terms) {
    // Get the hidden _termSet property
    // we put on the original terms object.
    var termSet = terms._termSet;
    var mainTree = new TermsTree(termSet);

    var populateTree = function (tree, term, path) {
      var name = path[0];

      if (path.length === 1) {
        if (tree[name]) {
          tree[name].term = term;
        } else {
          tree[name] = new Node(term);
        }
      } else {
        if (!tree[name]) {
          tree[name] = new Node();
        }

        populateTree(tree[name].children, term, path.slice(1));
      }
    };

    // Reuse generateList to turn the terms
    // object into a list of terms.
    generateList(terms).forEach(function (currentTerm) {
      populateTree(mainTree.children, currentTerm, currentTerm.get_pathOfTerm().split(';'));
    });

    return mainTree;
  };

  var getDefaultTermStore = function (context) {
    var session = SP.Taxonomy.TaxonomySession.getTaxonomySession(context);

    return session.getDefaultSiteCollectionTermStore();
  };

  // Returns a promise which resolves when SP Taxonomy is loaded
  var withTaxonomyDeps = function () {
    return sputils.helpers.withSharePointDependencies([{
      file: 'sp.taxonomy.js',
      namespace: 'SP.Taxonomy'
    }]);
  };

  var sortTerms = function (parent) {
    var sortOrder = parent.getSortOrder();
    function accordingToSortOrder(childA, childB) {
      var getGuid = function (x) {
        return x.getGuid().toString();
      };
      var a = sortOrder.indexOf(getGuid(childA)),
          b = sortOrder.indexOf(getGuid(childB));

      // numerically, ascending
      return a - b;
      // numerically, descending
      // return b - a;
    }

    var secondEl = fjs.pluck(1);
    var cArr = secondEl(fjs.toArray(parent.children));
    parent.sortedChildren = cArr;

    if (sortOrder) {
      // Sort order is a string of guids
      // separated by ":".
      sortOrder = sortOrder.split(':');

      // Replace children with an array sorted
      // according to the sortOrder.
      cArr.sort(accordingToSortOrder);
    } else {
      // sortBy with no second parameter
      // sorts on identity (just compares the values)
      // lexicographically, i.e. "alphabetically".
      cArr.sort();
    }
  };

  // Takes a tree and recursively
  // sorts all levels
  var sortTree = function (tree) {
    sortTerms(tree);

    if (tree.sortedChildren.length) {
      fjs.each(sortTree, tree.sortedChildren);
    }

    return tree;
  };

  /**
  * Returns a promise which resolves with
  * an object containing all the terms
  * corresponding to the given termset id.
  * @function sputils.termstore.getTerms
  * @param {string} id a termset guid
  * @returns {Promise<SP.TermCollection>}
  */
  var getTerms = function (id) {
    return withTaxonomyDeps().then(function () {
      var context = SP.ClientContext.get_current(),
          termStore = getDefaultTermStore(context),
          termSet = termStore.getTermSet(id),
          terms = termSet.getAllTerms();

      context.load(terms);
      context.load(termSet);
      return new Cctx(context).executeQuery()
        .then(function () {
          // Add the termSet on the terms
          // object so we can access it later.
          terms._termSet = termSet;
          return terms;
        });
    });
  };

  /**
  * Returns a promise which resolves
  * to an array. Each element
  * is a taxonomy term object.
  * @function sputils.termstore.getTermsList
  * @param {string} id a termset guid
  * @returns {Promise<Array>}
  */
  var getTermsList = function (id) {
    return getTerms(id)
      .then(generateList);
  };

  /**
  * Returns a promise which resolves
  * to a tree object. Each node has
  * a children property which is sorted
  * according to customSortOrder.
  * @function sputils.termstore.getTermsTree
  * @param {string} id a termset guid
  * @returns {Promise<TermsTree>}
  */
  var getTermsTree = function (id) {
    return getTerms(id)
      // The terms are unordered and without
      // a useful way of interpreting the hierarchy,
      // so we turn them into a tree.
      .then(generateTree)
      // And then sorted according to customSortOrder
      .then(sortTree);
  };

  /** @namespace */
  sputils.termstore = {
    getTerms: getTerms,
    getTermsList: getTermsList,
    getTermsTree: getTermsTree,
    withTaxonomyDeps: withTaxonomyDeps
  };
})();
