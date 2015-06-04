
// "taps" a function to produce a side effect
// but wrap it in an identity fn.
var tap = function (fn) {
  return function (value) {
    fn();
    return value;
  };
};
