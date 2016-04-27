var sputils = {};
var global; // mock/stub this in tests, where applicable
var expect = chai.expect;
chai.should();
var fetch;
var SP;
var noop = function () {};
var stdPromise = function (result) {
  return new Promise(function (resolve) {
    resolve({
      json: function () {
        return result || { d: { results: [] } };
      }
    });
  });
};
