/** @namespace sputils.lib */

/**
 * @ignore
 * @constructor
 * @desc
 * Internal API, for the time being.
 * `Cctx` is a usability wrapper for a SharePoint ClientContext
 * @example
 * new Cctx(sharepointClientContext)
 */
function Cctx(spClientContext) {
  this._cctx = spClientContext;
}

Cctx.prototype = {
  /**
   * wrapper around the clientContext.executeQueryAsync, that
   * returns a promise.
   * @returns {Promise<Void>}
   */
  executeQuery: function () {
    var c = this._cctx;
    return new Promise(function (resolve, reject) {
      c.executeQueryAsync(resolve, function fail(cctx, failInfo) {
        var msg = [
          'ClientContext.executeQueryAsync failed',
          failInfo.get_message(),
          '',
          'CorrelationId:',
          failInfo.get_errorTraceCorrelationId()
        ].join('\n');
        var err = new Error(msg);
        reject(err);
      });
    });
  }
};

/**
* "taps" a function to produce a side effect
* but wrap it in an identity fn.
*
* @function sputils.lib.tap
**/
var tap = function (fn) {
  return function (value) {
    fn(value);
    return value;
  };
};


/**
* Get a value deeply from an object without crashing on nulls.
*
* This function is dynamic, so can be bound or just assigned to an
* object.
*
* Can be used to "index" arrays.
*
* @function sputils.lib.getval
* @param {string} subscript - the subscript string, i.e. 'a.b.c.prop'
* @param {Optional<object>} root - the root object. Defaults to this.
* @returns {string} the value of the prop, if exists else undefined
* @example
* var obj = {a:{b:{c:{}}}}
* var c = sputils.lib.getval('a.b.c', obj);
* c === obj.a.b.c;
* var none = sputils.lib.getval('a.b.1.notHere', obj);
* none === void 0;
*
* // dynamic binding
* testObjects.getval = sputils.lib.getval;
* expect(testObjects.getval('a.b')).to.equal(testObjects.a.b);
*
* // any kind of property name is allowed, excepting period.
* var getval = sputils.lib.getval;
* var res = getval('a.b.d.2.long prop name', testObjects);
* expect(res).to.equal(testObjects.a.b.d[2]['long prop name']);
**/
var getval = function recur(subscript, root) {
  if (this === sputils.lib) {
    return recur.call(global, subscript, root);
  }
  root = (root || this) || global;

  // if subscript already is an array, just use it.
  var parts = subscript.constructor === ([]).constructor ?
    subscript : subscript.split('.');
  var nextProp = parts[0];
  var next = root[nextProp];
  if (next !== void 0) {
    if (parts.length > 1) {
      return recur(parts.slice(1), next);
    }

    return next;
  }

  return void 0;
};

sputils.lib = {
  getval: getval,
  tap: tap
};
