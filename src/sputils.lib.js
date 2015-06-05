/** @namespace sputils.lib */

/**
"taps" a function to produce a side effect
but wrap it in an identity fn.
**/
var tap = function (fn) {
  return function (value) {
    fn();
    return value;
  };
};


/**
Get a value deeply from an object without crashing on nulls.
@function sputils.lib.getval
@param {string} subscript - the subscript string, i.e. 'a.b.c.prop'
@param {Optional<object>} root - the root object
@returns {string} the value of the prop, if exists else undefined
@example
var obj = {a:{b:{c:{}}}}
var c = sputils.lib.getval('a.b.c', obj);
c === obj.a.b.c;
var none = sputils.lib.getval('a.b.1.notHere', obj);
none === void 0;
**/
var getval = function recur(subscript, root) {
  root = root || this || {};
  var parts = subscript.split('.');
  var nextProp = parts[0];
  var next = root[nextProp];
  if (next) {
    if (parts.length > 1) {
      return recur(parts.slice(1).join('.'), next);
    }

    return next;
  }

  return void 0;
};

sputils.lib = {
  getval: getval
};
