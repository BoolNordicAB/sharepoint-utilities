/** @namespace sputils.helper */

(function () {
  var resolveDependency = function (dep) {
    var file = dep.file,
        namespace = dep.namespace;

    return new Promise(function (resolve, reject) {
      SP.SOD.registerSod(file, SP.Utilities.Utility.getLayoutsPageUrl(file));
      SP.SOD.executeFunc(file, namespace, resolve);
    });
  };

  // Returns a promise which resolves when
  // all the specified dependencies are loaded.
  //
  // Takes a list of strings which correspond
  // to SP JS dependencies. Each dependency is
  // registered and loaded.
  var withSharePointDependencies = function (deps) {
    return new Promise(function (resolve, reject) {
      // sp.js is a dependency for our resolveDependency
      // function, so we load it separately before
      // the rest.
      SP.SOD.executeFunc('sp.js', 'SP.ClientContext', function () {
        var promises = deps.map(resolveDependency);
        Promise.all(promises).then(resolve);
      });
    });
  };

  sputils.helpers = {
    withSharePointDependencies: withSharePointDependencies
  };
})();
