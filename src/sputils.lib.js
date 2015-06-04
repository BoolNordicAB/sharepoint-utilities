/** @namespace sputils.lib */

// "taps" a function to produce a side effect
// but wrap it in an identity fn.
var tap = function (fn) {
  return function (value) {
    fn();
    return value;
  };
};

var getval = function recur(subscript, root) {
  root = root || this || {};
  var parts = subscript.split('.');
  var nextProp = parts[0];
  var next = root[nextProp];
  if (next) {
    if (parts.length > 1) {
      return recur(parts.join('.'), next);
    }

    return next;
  }

  return void 0;
};
