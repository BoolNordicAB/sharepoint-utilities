window.jQuery = window.$ = window.jQuery || function (el) {
  var val = "A REQUEST DIGEST";

  var ajax = function (config) {
    var deferred = $.Deferred();
    deferred.resolve(config);
    return deferred.promise();
  };
};
