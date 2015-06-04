var expect = chai.expect;
var fetch;
var stdPromise = function (result) {
  return new Promise(function (resolve) {
    resolve({
      json: function () {
        return result || { d: { results: [] } };
      }
    });
  });
};
