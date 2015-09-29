function $_global_sputils () {
'use strict';
// intentionally partial definitions

(function (global, undefined) {

global.sputils = global.sputils || {};
var sputils = global.sputils;
_spPageContextInfo = _spPageContextInfo || (function () {
  throw Error('_spPageContextInfo not found');
})();
;var fjs = (function () {
    "use strict";

    var fjs = {}, hardReturn = "hardReturn;";

    var lambda = function (exp) {
        if (!fjs.isString(exp)) {
            return;
        }

        var parts = exp.match(/(.*)\s*[=-]>\s*(.*)/);
        parts.shift();

        var params = parts.shift()
            .replace(/^\s*|\s(?=\s)|\s*$|,/g, "").split(" ");
        var body = parts.shift();

        parts = ((!/\s*return\s+/.test(body)) ? "return " : "" ) + body;
        params.push(parts);

        return Function.apply({}, params);
    };

    var sliceArgs = function (args) {
        return args.length > 0 ? [].slice.call(args, 0) : [];
    };

    fjs.isFunction = function (obj) {
        return !!(obj && obj.constructor && obj.call && obj.apply);
    };

    fjs.isObject = function (obj) {
        return fjs.isFunction(obj) || (!!obj && typeof (obj) === "object");
    };

    fjs.isArray = function (obj) {
        return Object.prototype.toString.call(obj) === "[object Array]";
    };

    var checkFunction = function (func) {
        if (!fjs.isFunction(func)) {
            func = lambda(func);
            if (!fjs.isFunction(func)) {
                throw "fjs Error: Invalid function";
            }
        }
        return func;
    };

    fjs.curry = function (func) {
        func = checkFunction(func);
        return function inner() {
            var _args = sliceArgs(arguments);
            if (_args.length === func.length) {
                return func.apply(null, _args);
            } else if (_args.length > func.length) {
                var initial = func.apply(null, _args);
                return fjs.fold(func, initial, _args.slice(func.length));
            } else {
                return function() {
                    var args = sliceArgs(arguments);
                    return inner.apply(null, _args.concat(args));
                };
            }
        };
    };

    fjs.each = fjs.curry(function (iterator, items) {
        iterator = checkFunction(iterator);
        if (!fjs.exists(items) || !fjs.isArray(items)) {
            return;
        }
        for (var i = 0; i < items.length; i += 1) {
            if (iterator.call(null, items[i], i) === hardReturn) {
                return;
            }
        }
    });

    fjs.map = fjs.curry(function (iterator, items) {
        iterator = checkFunction(iterator);
        var mapped = [];
        fjs.each(function () {
            mapped.push(iterator.apply(null, arguments));
        }, items);
        return mapped;
    });

    fjs.fold = fjs.foldl = fjs.curry(function (iterator, cumulate, items) {
        iterator = checkFunction(iterator);
        fjs.each(function (item, i) {
            cumulate = iterator.call(null, cumulate, item, i);
        }, items);
        return cumulate;
    });

    fjs.reduce = fjs.reducel = fjs.foldll = fjs.curry(function (iterator, items) {
        iterator = checkFunction(iterator);
        var cumulate = items[0];
        items.shift();
        return fjs.fold(iterator, cumulate, items);
    });

    fjs.clone = function (items) {
        var clone = [];
        fjs.each(function (item) {
            clone.push(item);
        }, items);
        return clone;
    };

    fjs.first = fjs.head = fjs.take = fjs.curry(function (iterator, items) {
        iterator = checkFunction(iterator);
        var first;
        fjs.each(function (item) {
            if (iterator.call(null, item)) {
                first = item;
                return hardReturn;
            }
        }, items);
        return first;
    });

    fjs.rest = fjs.tail = fjs.drop = fjs.curry(function (iterator, items) {
        var result = fjs.select(iterator, items);
        result.shift();
        return result;
    });

    fjs.last = fjs.curry(function (iterator, items) {
        var itemsClone = fjs.clone(items);
        return fjs.first(iterator, itemsClone.reverse());
    });

    fjs.every = fjs.all = fjs.curry(function (iterator, items) {
        iterator = checkFunction(iterator);
        var isEvery = true;
        fjs.each(function (item) {
            if (!iterator.call(null, item)) {
                isEvery = false;
                return hardReturn;
            }
        }, items);
        return isEvery;
    });

    fjs.any = fjs.contains = fjs.curry(function (iterator, items) {
        iterator = checkFunction(iterator);
        var isAny = false;
        fjs.each(function (item) {
            if (iterator.call(null, item)) {
                isAny = true;
                return hardReturn;
            }
        }, items);
        return isAny;
    });

    fjs.select = fjs.filter = fjs.curry(function (iterator, items) {
        iterator = checkFunction(iterator);
        var filtered = [];
        fjs.each(function (item) {
            if (iterator.call(null, item)) {
                filtered.push(item);
            }
        }, items);
        return filtered;
    });

    fjs.best = fjs.curry(function (iterator, items) {
        iterator = checkFunction(iterator);
        var compare = function (arg1, arg2) {
            return iterator.call(this, arg1, arg2) ?
                arg1 : arg2;
        };
        return fjs.reduce(compare, items);
    });

    fjs.while = fjs.curry(function (iterator, items) {
        iterator = checkFunction(iterator);
        var result = [];
        fjs.each(function (item) {
            if (iterator.call(null, item)) {
                result.push(item);
            } else {
                return hardReturn;
            }
        }, items);
        return result;
    });

    fjs.compose = function (funcs) {
        var anyInvalid = fjs.any(function (func) {
            return !fjs.isFunction(func);
        });
        funcs = sliceArgs(arguments).reverse();
        if (anyInvalid(funcs)) {
            throw "fjs Error: Invalid function to compose";
        }
        return function() {
            var args = arguments;
            var applyEach = fjs.each(function (func) {
                args = [func.apply(null, args)];
            });
            applyEach(funcs);
            return args[0];
        };
    };

    fjs.partition = fjs.curry(function (iterator, items) {
        iterator = checkFunction(iterator);
        var truthy = [],
            falsy = [];
        fjs.each(function (item) {
            (iterator.call(null, item) ? truthy : falsy).push(item);
        }, items);
        return [truthy, falsy];
    });

    fjs.group = fjs.curry(function (iterator, items) {
        iterator = checkFunction(iterator);
        var result = {};
        var group;
        fjs.each(function (item) {
            group = iterator.call(null, item);
            result[group] = result[group] || [];
            result[group].push(item);
        }, items);
        return result;
    });

    fjs.shuffle = function (items) {
        var j, t;
        fjs.each(function(item, i) {
            j = Math.floor(Math.random() * (i + 1));
            t = items[i];
            items[i] = items[j];
            items[j] = t;
        }, items);
        return items;
    };

    fjs.toArray = function (obj) {
        return fjs.map(function (key) {
            return [key, obj[key]];
        }, Object.keys(obj));
    };

    fjs.apply = fjs.curry(function (func, items) {
        var args = [];
        if (fjs.isArray(func)) {
            args = [].slice.call(func, 1);
            func = func[0];
        }
        return fjs.map(function (item) {
            return item[func].apply(item, args);
        }, items);
    });

    fjs.assign = fjs.extend = fjs.curry(function (obj1, obj2) {
        fjs.each(function (key) {
            obj2[key] = obj1[key];
        }, Object.keys(obj1));
        return obj2;
    });

    fjs.prop = function (prop) {
        return function (obj) {
            return obj[prop];
        };
    };

    fjs.pluck = fjs.curry(function (prop, items) {
        return fjs.map(fjs.prop(prop), items);
    });

    fjs.nub = fjs.unique = fjs.distinct = fjs.curry(function (comparator, items) {
    	var unique = items.length > 0 ? [items[0]] : [];

    	fjs.each(function (item) {
    		if (!fjs.any(fjs.curry(comparator)(item), unique)) {
    			unique[unique.length] = item;
    		}
    	}, items);

    	return unique;
    });

    fjs.exists = function (obj) {
        return obj != null; // jshint ignore:line
    };

    fjs.truthy = function (obj) {
        return fjs.exists(obj) && obj !== false;
    };

    fjs.falsy = function (obj) {
        return !fjs.truthy(obj);
    };

    fjs.each(function(type) {
        fjs["is" + type] = function (obj) {
            return Object.prototype.toString.call(obj) === "[object " + type + "]";
        };
    }, ["Arguments", "Date", "Number", "RegExp", "String"]);

    return fjs;
})();

if (typeof (exports) !== "undefined") {
    if (typeof (module) !== "undefined" && module.exports) {
        exports = module.exports = fjs;
    }
    exports.fjs = fjs;
}
;(function(global){

//
// Check for native Promise and it has correct interface
//

var NativePromise = global['Promise'];
var nativePromiseSupported =
  NativePromise &&
  // Some of these methods are missing from
  // Firefox/Chrome experimental implementations
  'resolve' in NativePromise &&
  'reject' in NativePromise &&
  'all' in NativePromise &&
  'race' in NativePromise &&
  // Older version of the spec had a resolver object
  // as the arg rather than a function
  (function(){
    var resolve;
    new NativePromise(function(r){ resolve = r; });
    return typeof resolve === 'function';
  })();


//
// export if necessary
//

if (typeof exports !== 'undefined' && exports)
{
  // node.js
  exports.Promise = Promise || NativePromise;
}
else
{
  // in browser add to global
  if (!nativePromiseSupported)
    global['Promise'] = Promise;
}


//
// Polyfill
//

var PENDING = 'pending';
var SEALED = 'sealed';
var FULFILLED = 'fulfilled';
var REJECTED = 'rejected';
var NOOP = function(){};

// async calls
var asyncSetTimer = typeof setImmediate !== 'undefined' ? setImmediate : setTimeout;
var asyncQueue = [];
var asyncTimer;

function asyncFlush(){
  // run promise callbacks
  for (var i = 0; i < asyncQueue.length; i++)
    asyncQueue[i][0](asyncQueue[i][1]);

  // reset async asyncQueue
  asyncQueue = [];
  asyncTimer = false;
}

function asyncCall(callback, arg){
  asyncQueue.push([callback, arg]);

  if (!asyncTimer)
  {
    asyncTimer = true;
    asyncSetTimer(asyncFlush, 0);
  }
}


function invokeResolver(resolver, promise) {
  function resolvePromise(value) {
    resolve(promise, value);
  }

  function rejectPromise(reason) {
    reject(promise, reason);
  }

  try {
    resolver(resolvePromise, rejectPromise);
  } catch(e) {
    rejectPromise(e);
  }
}

function invokeCallback(subscriber){
  var owner = subscriber.owner;
  var settled = owner.state_;
  var value = owner.data_;  
  var callback = subscriber[settled];
  var promise = subscriber.then;

  if (typeof callback === 'function')
  {
    settled = FULFILLED;
    try {
      value = callback(value);
    } catch(e) {
      reject(promise, e);
    }
  }

  if (!handleThenable(promise, value))
  {
    if (settled === FULFILLED)
      resolve(promise, value);

    if (settled === REJECTED)
      reject(promise, value);
  }
}

function handleThenable(promise, value) {
  var resolved;

  try {
    if (promise === value)
      throw new TypeError('A promises callback cannot return that same promise.');

    if (value && (typeof value === 'function' || typeof value === 'object'))
    {
      var then = value.then;  // then should be retrived only once

      if (typeof then === 'function')
      {
        then.call(value, function(val){
          if (!resolved)
          {
            resolved = true;

            if (value !== val)
              resolve(promise, val);
            else
              fulfill(promise, val);
          }
        }, function(reason){
          if (!resolved)
          {
            resolved = true;

            reject(promise, reason);
          }
        });

        return true;
      }
    }
  } catch (e) {
    if (!resolved)
      reject(promise, e);

    return true;
  }

  return false;
}

function resolve(promise, value){
  if (promise === value || !handleThenable(promise, value))
    fulfill(promise, value);
}

function fulfill(promise, value){
  if (promise.state_ === PENDING)
  {
    promise.state_ = SEALED;
    promise.data_ = value;

    asyncCall(publishFulfillment, promise);
  }
}

function reject(promise, reason){
  if (promise.state_ === PENDING)
  {
    promise.state_ = SEALED;
    promise.data_ = reason;

    asyncCall(publishRejection, promise);
  }
}

function publish(promise) {
  promise.then_ = promise.then_.forEach(invokeCallback);
}

function publishFulfillment(promise){
  promise.state_ = FULFILLED;
  publish(promise);
}

function publishRejection(promise){
  promise.state_ = REJECTED;
  publish(promise);
}

/**
* @class
*/
function Promise(resolver){
  if (typeof resolver !== 'function')
    throw new TypeError('Promise constructor takes a function argument');

  if (this instanceof Promise === false)
    throw new TypeError('Failed to construct \'Promise\': Please use the \'new\' operator, this object constructor cannot be called as a function.');

  this.then_ = [];

  invokeResolver(resolver, this);
}

Promise.prototype = {
  constructor: Promise,

  state_: PENDING,
  then_: null,
  data_: undefined,

  then: function(onFulfillment, onRejection){
    var subscriber = {
      owner: this,
      then: new this.constructor(NOOP),
      fulfilled: onFulfillment,
      rejected: onRejection
    };

    if (this.state_ === FULFILLED || this.state_ === REJECTED)
    {
      // already resolved, call callback async
      asyncCall(invokeCallback, subscriber);
    }
    else
    {
      // subscribe
      this.then_.push(subscriber);
    }

    return subscriber.then;
  },

  'catch': function(onRejection) {
    return this.then(null, onRejection);
  }
};

Promise.all = function(promises){
  var Class = this;

  if (!Array.isArray(promises))
    throw new TypeError('You must pass an array to Promise.all().');

  return new Class(function(resolve, reject){
    var results = [];
    var remaining = 0;

    function resolver(index){
      remaining++;
      return function(value){
        results[index] = value;
        if (!--remaining)
          resolve(results);
      };
    }

    for (var i = 0, promise; i < promises.length; i++)
    {
      promise = promises[i];

      if (promise && typeof promise.then === 'function')
        promise.then(resolver(i), reject);
      else
        results[i] = promise;
    }

    if (!remaining)
      resolve(results);
  });
};

Promise.race = function(promises){
  var Class = this;

  if (!Array.isArray(promises))
    throw new TypeError('You must pass an array to Promise.race().');

  return new Class(function(resolve, reject) {
    for (var i = 0, promise; i < promises.length; i++)
    {
      promise = promises[i];

      if (promise && typeof promise.then === 'function')
        promise.then(resolve, reject);
      else
        resolve(promise);
    }
  });
};

Promise.resolve = function(value){
  var Class = this;

  if (value && typeof value === 'object' && value.constructor === Class)
    return value;

  return new Class(function(resolve){
    resolve(value);
  });
};

Promise.reject = function(reason){
  var Class = this;

  return new Class(function(resolve, reject){
    reject(reason);
  });
};

})(new Function('return this')());
;(function() {
  'use strict';

  if (self.fetch) {
    return
  }

  function normalizeName(name) {
    if (typeof name !== 'string') {
      name = name.toString();
    }
    if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
      throw new TypeError('Invalid character in header field name')
    }
    return name.toLowerCase()
  }

  function normalizeValue(value) {
    if (typeof value !== 'string') {
      value = value.toString();
    }
    return value
  }

  function Headers(headers) {
    this.map = {}

    if (headers instanceof Headers) {
      headers.forEach(function(value, name) {
        this.append(name, value)
      }, this)

    } else if (headers) {
      Object.getOwnPropertyNames(headers).forEach(function(name) {
        this.append(name, headers[name])
      }, this)
    }
  }

  Headers.prototype.append = function(name, value) {
    name = normalizeName(name)
    value = normalizeValue(value)
    var list = this.map[name]
    if (!list) {
      list = []
      this.map[name] = list
    }
    list.push(value)
  }

  Headers.prototype['delete'] = function(name) {
    delete this.map[normalizeName(name)]
  }

  Headers.prototype.get = function(name) {
    var values = this.map[normalizeName(name)]
    return values ? values[0] : null
  }

  Headers.prototype.getAll = function(name) {
    return this.map[normalizeName(name)] || []
  }

  Headers.prototype.has = function(name) {
    return this.map.hasOwnProperty(normalizeName(name))
  }

  Headers.prototype.set = function(name, value) {
    this.map[normalizeName(name)] = [normalizeValue(value)]
  }

  Headers.prototype.forEach = function(callback, thisArg) {
    Object.getOwnPropertyNames(this.map).forEach(function(name) {
      this.map[name].forEach(function(value) {
        callback.call(thisArg, value, name, this)
      }, this)
    }, this)
  }

  function consumed(body) {
    if (body.bodyUsed) {
      return Promise.reject(new TypeError('Already read'))
    }
    body.bodyUsed = true
  }

  function fileReaderReady(reader) {
    return new Promise(function(resolve, reject) {
      reader.onload = function() {
        resolve(reader.result)
      }
      reader.onerror = function() {
        reject(reader.error)
      }
    })
  }

  function readBlobAsArrayBuffer(blob) {
    var reader = new FileReader()
    reader.readAsArrayBuffer(blob)
    return fileReaderReady(reader)
  }

  function readBlobAsText(blob) {
    var reader = new FileReader()
    reader.readAsText(blob)
    return fileReaderReady(reader)
  }

  var support = {
    blob: 'FileReader' in self && 'Blob' in self && (function() {
      try {
        new Blob();
        return true
      } catch(e) {
        return false
      }
    })(),
    formData: 'FormData' in self
  }

  function Body() {
    this.bodyUsed = false


    this._initBody = function(body) {
      this._bodyInit = body
      if (typeof body === 'string') {
        this._bodyText = body
      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
        this._bodyBlob = body
      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
        this._bodyFormData = body
      } else if (!body) {
        this._bodyText = ''
      } else {
        throw new Error('unsupported BodyInit type')
      }
    }

    if (support.blob) {
      this.blob = function() {
        var rejected = consumed(this)
        if (rejected) {
          return rejected
        }

        if (this._bodyBlob) {
          return Promise.resolve(this._bodyBlob)
        } else if (this._bodyFormData) {
          throw new Error('could not read FormData body as blob')
        } else {
          return Promise.resolve(new Blob([this._bodyText]))
        }
      }

      this.arrayBuffer = function() {
        return this.blob().then(readBlobAsArrayBuffer)
      }

      this.text = function() {
        var rejected = consumed(this)
        if (rejected) {
          return rejected
        }

        if (this._bodyBlob) {
          return readBlobAsText(this._bodyBlob)
        } else if (this._bodyFormData) {
          throw new Error('could not read FormData body as text')
        } else {
          return Promise.resolve(this._bodyText)
        }
      }
    } else {
      this.text = function() {
        var rejected = consumed(this)
        return rejected ? rejected : Promise.resolve(this._bodyText)
      }
    }

    if (support.formData) {
      this.formData = function() {
        return this.text().then(decode)
      }
    }

    this.json = function() {
      return this.text().then(JSON.parse)
    }

    return this
  }

  // HTTP methods whose capitalization should be normalized
  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT']

  function normalizeMethod(method) {
    var upcased = method.toUpperCase()
    return (methods.indexOf(upcased) > -1) ? upcased : method
  }

  function Request(url, options) {
    options = options || {}
    this.url = url

    this.credentials = options.credentials || 'omit'
    this.headers = new Headers(options.headers)
    this.method = normalizeMethod(options.method || 'GET')
    this.mode = options.mode || null
    this.referrer = null

    if ((this.method === 'GET' || this.method === 'HEAD') && options.body) {
      throw new TypeError('Body not allowed for GET or HEAD requests')
    }
    this._initBody(options.body)
  }

  function decode(body) {
    var form = new FormData()
    body.trim().split('&').forEach(function(bytes) {
      if (bytes) {
        var split = bytes.split('=')
        var name = split.shift().replace(/\+/g, ' ')
        var value = split.join('=').replace(/\+/g, ' ')
        form.append(decodeURIComponent(name), decodeURIComponent(value))
      }
    })
    return form
  }

  function headers(xhr) {
    var head = new Headers()
    var pairs = xhr.getAllResponseHeaders().trim().split('\n')
    pairs.forEach(function(header) {
      var split = header.trim().split(':')
      var key = split.shift().trim()
      var value = split.join(':').trim()
      head.append(key, value)
    })
    return head
  }

  Body.call(Request.prototype)

  function Response(bodyInit, options) {
    if (!options) {
      options = {}
    }

    this._initBody(bodyInit)
    this.type = 'default'
    this.url = null
    this.status = options.status
    this.ok = this.status >= 200 && this.status < 300
    this.statusText = options.statusText
    this.headers = options.headers instanceof Headers ? options.headers : new Headers(options.headers)
    this.url = options.url || ''
  }

  Body.call(Response.prototype)

  self.Headers = Headers;
  self.Request = Request;
  self.Response = Response;

  self.fetch = function(input, init) {
    // TODO: Request constructor should accept input, init
    var request
    if (Request.prototype.isPrototypeOf(input) && !init) {
      request = input
    } else {
      request = new Request(input, init)
    }

    return new Promise(function(resolve, reject) {
      var xhr = new XMLHttpRequest()

      function responseURL() {
        if ('responseURL' in xhr) {
          return xhr.responseURL
        }

        // Avoid security warnings on getResponseHeader when not allowed by CORS
        if (/^X-Request-URL:/m.test(xhr.getAllResponseHeaders())) {
          return xhr.getResponseHeader('X-Request-URL')
        }

        return;
      }

      xhr.onload = function() {
        var status = (xhr.status === 1223) ? 204 : xhr.status
        if (status < 100 || status > 599) {
          reject(new TypeError('Network request failed'))
          return
        }
        var options = {
          status: status,
          statusText: xhr.statusText,
          headers: headers(xhr),
          url: responseURL()
        }
        var body = 'response' in xhr ? xhr.response : xhr.responseText;
        resolve(new Response(body, options))
      }

      xhr.onerror = function() {
        reject(new TypeError('Network request failed'))
      }

      xhr.open(request.method, request.url, true)

      if (request.credentials === 'include') {
        xhr.withCredentials = true
      }

      if ('responseType' in xhr && support.blob) {
        xhr.responseType = 'blob'
      }

      request.headers.forEach(function(value, name) {
        xhr.setRequestHeader(name, value)
      })

      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit)
    })
  }
  self.fetch.polyfill = true
})();
;/** @namespace sputils.lib */

/**
* "taps" a function to produce a side effect
* but wrap it in an identity fn.
*
* @function sputils.lib.tap
**/
var tap = function (fn) {
  return function (value) {
    fn();
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
;(function () {
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


  /**
  * Get the relative (to the root) portion of an absolute url.
  *
  * @function sputils.helpers.abs2rel
  * @param {string} - the absolute url
  * @returns {string} - the relative url
  * @example
  * var aurl = 'http://example.com/a/path/to.html';
  * var rurl = sputils.helpers.abs2rel(aurl);
  * rurl === '/a/path/to.html';
  **/
  function abs2rel(absUrl) {
    var hostname = sputils.lib.getval('location.hostname');

    // splitting on the hostname should yield an array with 2 elements
    // the 1st element should be empty string and the second the rel path.
    // coalesce into an array with the result being a '/'
    var parts = (absUrl || '').split(hostname);

    return parts[1] || '/';
  }

  /**
  * @function sputils.helpers.urlQuery
  * @param {Optional<string>} a query string
  * @returns {Object} an object representing the dictionary of the query string.
  * @example
  * console.log(location.search); // => '?a=1&b=some value'
  * var qsHash = urlQuery();
  * // qsHash ~=~ {a:1, b: 'some value'};
  * urlQuery('?a=1&b=some value'); // ~=~ qsHash
  **/
  function urlQuery(optArg) {
    var result = {};
    var qs = (optArg || sputils.lib.getval('location.search')).replace('?', '');
    var parts = qs.split('&');
    parts = fjs.filter(function (a) {
      return a !== '';
    }, parts);
    fjs.each(function (part) {
      var kvp = part.split('=');
      result[kvp[0]] = kvp[1];
    }, parts);
    return result;
  }

  /**
  * Get a promise for a client context that could be on another
  * site/web.
  *
  * This client context is augmented to contain extra info in the
  * `_info` property.
  *
  * @function sputils.helpers.clientContextForWeb
  * @param {string} - the absolute url of the listitem, file or other asset.
  * @returns {Promise<SP.ClientContext>} - the promise of a client context
  * @example
  * console.log(location);// => http://contoso.com/sub1
  * var fileUrl = 'http://contoso.com/sub21231/Shared Documents/file1.docx';
  * var cctxPromise = sputils.helpers.clientContext(fileUrl);
  * cctxPromise.then(function (cctx) {
  *   var webUrl = cctx._info.WebFullUrl;
  *   var web = cctx.get_web();
  *   var file = web.getFileByServerRelativeUrl(sputils.helpers.abs2rel(fileUrl));
  *   // ...
  * });
  **/
  function clientContext(absoluteFileOrWebUrl) {
    var url = absoluteFileOrWebUrl.substring(
      0, absoluteFileOrWebUrl.lastIndexOf('/')) ;

    return sputils.rest.contextInfo(url).then(function (info) {
      // create the context and set the extra prop.
      var cctx = new SP.ClientContext(info.WebFullUrl);
      cctx._info = info;

      return cctx;
    });
  }

  /** @namespace */
  sputils.helpers = {
    withSharePointDependencies: withSharePointDependencies,
    abs2rel: abs2rel,
    clientContext: clientContext,
    urlQuery: urlQuery
  };
})();
;(function () {
  // This is used to cache results
  // from grabbing the request digest.
  var requestDigest;

  // Simple AJAX request for fetching the request digest
  // from /_api/contextinfo. This is used as a fallback
  // for the one embedded in the SharePoint page.

  // Returns a promise resolving to the digest string.
  var requestFormDigest = function () {
    return contextInfo()
      .then(function (info) {
        return info.FormDigestValue;
      });
  };

  function contextInfo(webUrl) {
    var CONTEXT_INFO_API = '/_api/contextinfo';
    return post(webUrl + CONTEXT_INFO_API)
      .then(function (data) {
        return data.d.GetContextWebInformation;
      });
  }

  // Utility for grabbing the digest off the page in
  // an asynchronous manner. Solves the issue of script
  // running before page has loaded proper.
  // --
  // Returns a promise resolving to the digest string.
  var withRequestDigest = function (refresh) {
    return new Promise(function (resolve, reject) {
      if (requestDigest && refresh !== true) {
        resolve(requestDigest);
      } else {
        var rd = global.document.getElementById('__REQUESTDIGEST');
        if (rd !== null && rd.value !== 'InvalidFormDigest') {
          requestDigest = rd.value;
          resolve(requestDigest);
        } else {
          requestFormDigest()
            .then(tap(function (digest) {
              // `tap` will pass the digest to the next handler
              requestDigest = digest;
            })).then(resolve);
        }
      }
    });
  };

  // Gets the default config object for ajax requests.
  // Is asynchronous for consistency.

  // Returns a promise resolving to the ajax defaults.
  var getDefaults = function (url, config) {
    return new Promise(function (resolve, reject) {
      var defaults = {
        // If the URL is not absolute, get the missing part
        // from _spPageContextInfo
        url: url.indexOf('http') > -1 ? url : _spPageContextInfo.webAbsoluteUrl + url,
        method: 'GET',
        credentials: 'include',
        headers: {
          'accept': 'application/json;odata=verbose'
        }
      };

      // fjs assign has the destination last (because curry), i.e. data flow:
      // config => defaults
      resolve(fjs.assign(config || {}, defaults));
    });
  };

  // Gets the default config object for ajax post requests,
  // which includes the getConfig and the request digest.

  // Returns a promise resolving to the ajax post defaults.
  var postDefaults = function (url, data, config) {
    return Promise.all([getDefaults(url), withRequestDigest()])
      .then(function (results) {
        var defaults = results[0],
            digest = results[1];

        var headers = fjs.assign(
          getval('headers', config) || {},
          getval('headers', defaults) || {},
          {'X-RequestDigest': digest});

        var added = {
          method: 'POST',
          body: data,
          contentType: 'application/json;odata=verbose'
        };

        var cfg = fjs.assign(config || {}, added, defaults);
        cfg.headers = headers;
        return cfg;
      });
  };

  /**
  * Rest API get helper. Uses sane defaults to speak to the API. Additional
  * configuration can be passed with the config argument.
  * @function sputils.rest.get
  * @param {string} url an SP endpoint
  * @param {object} config additional configuration
  * @returns {object} a promise that resolves to the response data
  * @example
  * sputils.rest.get('/_api/web/lists').then(function (data) {
  *   $.each(data.d.results, function (idx,el) {
  *     console.log(el);
  *   });
  * });
  */
  var get = function (url, config) {
    url = url || '/';
    return getDefaults(url, config)
      .then(function (defaults) {
        return fetch(defaults.url, defaults).then(jsonify);
      });
  };

  /**
  * Rest API post helper. Uses sane defaults to speak to the API. Additional
  * configuration can be passed with the config argument.
  * @function sputils.rest.post
  * @param {string} url an SP endpoint
  * @param {object} data the payload
  * @param {object} config additional configuration
  * @returns {object} a promise that resolves to the response data
  * @example
  * var data = {'Title':'REST API FTW',
  *             '__metadata': { 'type': 'SP.Data.AnnouncementsListItem'}};
  *
  * sputils.rest.post('/_api/Web/Lists/getByTitle('Announcements')/items/', data)
  *   .then(function (data) { console.log(data) });
  */
  var post = function (url, data, config) {
    data = typeof data === 'string' ? data : JSON.stringify(data);
    return postDefaults(url, data, config).then(function (defaults) {
      return fetch(url, defaults).then(jsonify);
    });
  };

  /**
  * Results from the standard SharePoint REST APIs come
  * wrapped in objects. This convenience function unwraps
  * them for you. See example use.
  * @function sputils.rest.unwrapResults
  * @param {object} object raw SP API response data
  * @returns {object} unwrapped SP API data
  * @example
  * sputils.rest.get('/_api/web/lists')
  *   .then(sputils.rest.unwrapResults)
  *   .then(function (data) {
  *     $.each(data, function (idx,el) {
  *       console.log(el);
  *     });
  *   });
  */
  var unwrapResults = function (object) {
    return object.d.results || object.d;
  };

  // If the given argument has a json method
  // we call it, otherwise just return the argument.
  var jsonify = function (result) {
    return typeof result.json === 'function' ? result.json() : result;
  };

  /** @namespace */
  sputils.rest = {
    get: get,
    post: post,
    withRequestDigest: withRequestDigest,
    unwrapResults: unwrapResults,
    contextInfo: contextInfo
  };
})();
;(function () {
  /**
  * Returns the list items from the given list name.
  * @function sputils.list.getListByName
  * @param {string} name a list name
  * @returns {array}
  * @example
  *
  * sputils.list.getListByName('Announcements')
  *   .then(function (data) { console.log(data.d.results) });
  *
  */
  var getListByName = function (name, config) {
    var url = '/_api/Web/Lists/getByTitle(\'' + name + '\')/items/';
    return sputils.rest.get(url, config)
      .then(sputils.rest.unwrapResults);
  };

  /**
  * Modifies list items in the given list.
  * @function sputils.list.postListByName
  * @param {string} name a list name
  * @param {object} data the payload
  * @param {object} config the config
  * @returns {object} Promise
  * @example
  *
  * var data = {"Title": "listlessly POSTing",
  *             "__metadata": { type: "SP.Data.AnnouncementsListItem"} };
  * sputils.list.postListByName("Announcements", data)
  *   .then(function (data) { console.log(data); });
  */
  var postListByName = function (name, data, config) {
    var url = '/_api/Web/Lists/getByTitle(\'' + name + '\')/items/';
    return sputils.rest.post(url, data, config)
      .then(sputils.rest.unwrapResults);
  };

  /**
  * Returns the list item with the specified id.
  * @function sputils.list.getListItemById
  * @param {string} name a list name
  * @param {object} data the payload
  * @param {object} config the config
  * @returns {array} List items
  * @example
  *
  * sputils.list.getListItemById('Announcements', 1)
  *   .then(function (data) { console.log(data.d.results) });
  */
  var getListItemById = function (listName, itemId, config) {
    var url = '/_api/Web/Lists/getByTitle(\'' + listName + '\')/items/getbyid(' + itemId + ')';
    return sputils.rest.get(url, config)
      .then(sputils.rest.unwrapResults);
  };

  /** @namespace sputils.list.files */
  var files = (function () {
    function checkFile(dir, fileUrl) {
      var cctxPromise = sputils.helpers.clientContext(fileUrl);
      return cctxPromise.then(function (cctx) {
        var web = cctx.get_web();
        var page = web.getFileByServerRelativeUrl(
          fileUrl.split(global.location.hostname)[1]);

        if (dir === 'in') {
          page.checkIn();
        } else if (dir === 'out') {
          page.checkOut();
        }

        return new Promise(cctx.executeQueryAsync);
      });
    }

    function checkIn(url) {
      return checkFile('in', url);
    }

    function checkOut(url) {
      return checkFile('out', url);
    }

    // public API for this submodule.
    return {
      /**
      * Initiates a checkIn operation on the file located at the supplied URL.
      * @function sputils.list.files.checkIn
      * @param {string} url - the URL of the file
      * @returns {Promise} the promise of fulfilling the operation
      * @example
      *
      * sputils.list.files.checkIn('/pages/default.aspx')
      *   .then(function () { console.log('page was checked in') });
      */
      checkIn: checkIn,
      /**
      * Initiates a checkOut operation on the file located at the supplied URL.
      * @function sputils.list.files.checkOut
      * @param {string} url - the URL of the file
      * @returns {Promise} the promise of fulfilling the operation
      * @example
      *
      * sputils.list.files.checkOut('/pages/default.aspx')
      *   .then(function () { console.log('page was checked out') });
      */
      checkOut: checkOut
    };
  })();

  /** @namespace */
  sputils.list = {
    getListByName: getListByName,
    postListByName: postListByName,
    getListItemById: getListItemById,
    files: files
  };
})();
;(function () {
  /**
  * Get the user name from the claims token string
  * @function sputils.conversion.getUserNameFromClaim
  * @param {string} claimsString - the claims string
  * @returns {string} username
  * @example
  * var claimsToken = 'i:0ǵ.t|ipdomain|jdoe';
  * var username = sputils.conversion.getUserNameFromClaim(claimsToken);
  * console.log(username); // => 'jdoe'
  **/
  var getUserNameFromClaim = function (claimsString) {
    var splitUserName = claimsString.split('|');
    return splitUserName[splitUserName.length - 1];
  };

  /** @namespace */
  sputils.conversion = {
    getUserNameFromClaim: getUserNameFromClaim
  };
})();
;(function () {
  var TermsTree = function (termSet) {
    this.termSet = termSet;

    this.getSortOrder = function () {
      return this.termSet.get_customSortOrder();
    };

    this.children = {};
  };

  // A data structure wrapping SP.Term objects
  // with convenience functions and a children object
  var Node = function (term) {
    this.term = term;

    this.getName = function () {
      return this.term.get_name();
    };

    this.getUrl = function () {
      return this.term.get_localCustomProperties()._Sys_Nav_SimpleLinkUrl;
    };

    this.getSortOrder = function () {
      return this.term.get_customSortOrder();
    };

    this.getIsRoot = function () {
      return this.term.get_isRoot();
    };

    this.getGuid = function () {
      return this.term.get_id();
    };

    this.getLocalCustomProperty = function (propertyName) {
      return this.term.get_localCustomProperties()[propertyName];
    };

    this.children = {};
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
  var withTaxonomy = function () {
    return sputils.helpers.withSharePointDependencies([{
      file: 'sp.taxonomy.js',
      namespace: 'SP.Taxonomy'
    }]);
  };

  var sortTerms = function (parent) {
    var sortOrder = parent.getSortOrder();
    function accordingToSortOrder(childA, childB) {
      var a = sortOrder.indexOf(childA.getGuid()),
          b = sortOrder.indexOf(childB.getGuid());

      // numerically, ascending
      return a - b;
      // numerically, descending
      // return b - a;
    }

    if (sortOrder) {
      // Sort order is a string of guids
      // separated by ":".
      sortOrder = sortOrder.split(':');

      // Replace children with an array sorted
      // according to the sortOrder.
      parent.children.sort(accordingToSortOrder);
    } else {
      // sortBy with no second parameter
      // sorts on identity (just compares the values)
      // lexicographically, i.e. "alphabetically".
      parent.children.sort();
    }
  };

  // Takes a tree and recursively
  // sorts all levels
  var sortTree = function (tree) {
    sortTerms(tree);

    if (tree.children) {
      fjs.each(sortTree, tree.children);
    }

    return tree;
  };

  /**
  * Returns a promise which resolves with
  * an object containing all the terms
  * corresponding to the given termset id.
  * @function sputils.termstore.getTerms
  * @param {string} id a termset guid
  * @returns {object}
  */
  var getTerms = function (id) {
    return new Promise(function (resolve, reject) {
      withTaxonomy().then(function () {
        var context = SP.ClientContext.get_current(),
            termStore = getDefaultTermStore(context),
            termSet = termStore.getTermSet(id),
            terms = termSet.getAllTerms();

        context.load(terms);
        context.load(termSet);
        context.executeQueryAsync(function () {
          // Add the termSet on the terms
          // object so we can access it later.
          terms._termSet = termSet;
          return resolve(terms);
        }, reject);
      });
    });
  };

  /**
  * Returns a promise which resolves
  * to an array. Each element
  * is a taxonomy term object.
  * @function sputils.termstore.getTermsList
  * @param {string} id a termset guid
  * @returns {array}
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
  * @returns {object}
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
    withTaxonomy: withTaxonomy
  };
})();
;(function () {
  var loginAsAnotherUser = function () {
    window.location.href = '/_layouts/closeconnection.aspx?loginasanotheruser=true';
  };

  /* EXAMPLE USE

  sputils.loginAsAnotherUser();

  */

  var logoutUser = function () {
    window.location.href = '/_layouts/closeconnection.aspx';
  };

  /* EXAMPLE USE

  sputils.logoutUser();

  */

  // Returns a promise with the current spuser object.
  var getCurrentUser = function () {
    return new Promise(function (resolve, reject) {
      var clientContext = new SP.ClientContext.get_current();
      var currentWeb = clientContext.get_web();
      var currentUser = web.get_currentUser();

      // Load currentUser to the context in order to retrieve the user data.
      clientContext.load(currentUser);

      // Execute the query. Takes two functions: success and failed that returns the SPUser object or an error message.
      clientContext.executeQueryAsync(function () {
        resolve(currentUser);
      }, function (sender, args) {
        reject(new Error(args.get_message()));
      });
    });
  };

  /* EXAMPLE USE

  sputils.getCurrentUser().then(function (data) {
    console.log(data);
  });

  */

  // Returns full url to profile page of current user
  var getCurrentUserPersonalSiteUrl = function (config) {
    var url =
      '/_api/SP.UserProfiles.PeopleManager/GetMyProperties?$select=UserUrl';
    return sputils.rest.get(url, config)
      .then(function (data) {
        return data.d.UserUrl;
      });
  };

  /* EXAMPLE USE

  sputils.userprofile.getCurrentUserPersonalSiteUrl()
    .then(function (data) { console.log(data) });

  */

  /** @namespace */
  sputils.user = {
    loginAsAnotherUser: loginAsAnotherUser,
    logoutUser: logoutUser,
    getCurrentUser: getCurrentUser,
    getCurrentUserPersonalSiteUrl: getCurrentUserPersonalSiteUrl
  };
})();
;(function () {
  /**
  * @private
  * @const search.POST_URL_PATH the sub-path used for POST requests */
  var POST_URL_PATH = '/_api/search/postquery';
  /**
  * @private
  * @const search.GET_URL_PATH the sub-path used for GET requests */
  var GET_URL_PATH = '/_api/search/query';

  /**
  * @private
  * @returns {object} __metadata for use in POST requests' bodies to search API */
  var __metadata = function () {
    return {
      __metadata: {
        type: 'Microsoft.Office.Server.Search.REST.SearchRequest'
      }
    };
  };

  /**
  * An example search configuration
  * @function sputils.search.searchCfgExample
  * @see {@link https://msdn.microsoft.com/en-us/library/office/jj163876.aspx}
  * @returns {object} a new object instance of a SearchConfigurationExample
  */
  var searchCfgExample = function () {
    return {
      // A string that contains the text for the search query.
      'Querytext': 'sharepoint',
      // A string that contains the text that replaces the query text, as part
      // of a query transform.
      'Querytemplate': '{searchterms} Author:johndoe',
      // A 'Boolean' value that specifies whether the result tables that are
      // returned for the result block are mixed with the result tables that
      // are  returned for the original query.
      // true to mix the ResultTables; otherwise, false. The default value
      // is true. Change this value only if you want to provide your own
      // interleaving implementation.
      'EnableInterleaving': 'True',
      // The result source ID to use for executing the search query.
      'SourceId': '8413cd39-2156-4e00-b54d-11efd9abdb89',
      // The ID of the ranking model to use for the query.
      'RankingModelId': 'CustomRankingModelID',
      // The first row that is included in the search results that are
      //  returned. You use this parameter when you want to implement
      // paging for search results.
      'StartRow': '10',
      // The maximum number of rows overall that are returned in the search
      //  results. Compared to RowsPerPage, RowLimit is the maximum number
      //  of rows returned overall.
      'RowLimit': '30',
      // The maximum number of rows to return per page. Compared to RowLimit,
      // RowsPerPage refers to the maximum number of rows to return per
      // page, and is used primarily when you want to implement paging for
      // search results.
      'RowsPerPage': '10',
      // The managed properties to return in the search results. To return
      // a managed property, set the property's retrievable flag to true
      //  in the search schema.
      'SelectProperties': {
        'results': [
          'Title',
          'Author'
        ]
      },
      // The locale ID (LCID) for the query.
      // https://msdn.microsoft.com/en-us/goglobal/bb964664.aspx
      'Culture': '1044',
      // The set of refinement filters used when issuing a refinement
      // query. For GET requests, the RefinementFilters parameter is
      // specified as an FQL filter. For POST requests, the RefinementFilters
      // parameter is specified as an array of FQL filters.
      'RefinementFilters': {
        'results': ['fileExtension:equals("docx")']
      },
      // The set of refiners to return in a search result.
      'Refiners': {
        'results': ['author,size']
      },
      // The additional query terms to append to the query.
      'HiddenConstraints': 'developer',
      // The list of properties by which the search results are ordered.
      'SortList': {
        'results': [
          {
            'Property': 'Created',
            'Direction': '0'
          },
          {
            'Property': 'FileExtension',
            'Direction': '1'
          }
        ]
      },
      // A Boolean value that specifies whether stemming is enabled.
      'EnableStemming': 'False',
      // A Boolean value that specifies whether duplicate items are removed
      // from the results.
      'TrimDuplicates': 'False',
      // The amount of time in milliseconds before the query request times
      // out. The default value is 30000.
      'Timeout': '60000',
      // A Boolean value that specifies whether the exact terms in the search
      // query are used to find matches, or if nicknames are used also.
      'EnableNicknames': 'True',
      'EnablePhonetic': 'True',
      'EnableFQL':'True',
      'BypassResultTypes': 'true',
      'ProcessBestBets': 'true',
      'ClientType':'custom',
      'PersonalizationData': '<GUID>',
      'ResultURL': 'http://server/site/resultspage.aspx',
      'QueryTag': 'tag1;tag2',
      'Properties': {
        'results': [
          {
            'Name': 'sampleBooleanProperty',
            'Value': {
              'BoolVal': 'True',
              // QueryPropertyValueType specifies the type for the property;
              // each type has a specific index value.
              // https://msdn.microsoft.com/en-us/library/office/microsoft.office.server.search.query.querypropertyvaluetype.aspx
              'QueryPropertyValueTypeIndex': 3
            }
          },
          {
            'Name': 'sampleIntProperty',
            'Value': {
              'IntVal': '1234',
              'QueryPropertyValueTypeIndex': 2
            }
          }
        ]
      },
      'EnableQueryRules': 'False' ,
      'ReorderingRules':  {
        'results': [
          {
            'MatchValue': '<someValue>',
            'Boost': '10',
            'MatchType': '0'
          }
        ]
      },
      'ProcessPersonalFavorites': 'false',
      'QueryTemplatePropertiesUrl': 'spfile://webroot/queryparametertemplate.xml',
      'HitHighlihtedMultivaluePropertyLimit': '2',
      'CollapseSpecification': 'Author:1 ContentType:2',
      'EnableSorting': 'false',
      'GenerateBlockRankLog': 'true',
      'UILanguage': '1044',
      'DesiredSnippetLength': '80',
      'MaxSnippetLength': '100' ,
      'Summarylength': '150'
    };
  };

  /**
  * Make a search request with a POST method. Useful if complex data needs
  * to be sent to the server.
  * <pre>
  * Use POST requests in the following scenarios:
  * - When you'll exceed the URL length restriction with a GET request.
  * - When you can't specify the query parameters in a simple URL.
  *   For example, if you have to pass parameter values that contain
  *   a complex type array, or comma-separated strings, you have more
  *   flexibility when constructing the POST request.
  * - When you use the ReorderingRules parameter because it is supported only with POST requests.
  * </pre>
  * @function sputils.search.postSearch
  * @param {object} cfg the search configuration.
  * @see sputils.search.searchCfgExample or SharePoint Search Query Tool
  * @param {string} [webUrl] the url of the web to use as the context.
  * @returns {Promise<object>} the search result
  * @example
  * sputils.search.postSearch({Querytext: 'ContentType:0x01*'})
  *   .then(function (result) { console.log(result) });
  */
  var postSearch = function (cfg, webUrl) {
    return sputils.rest.post(
      (webUrl || _spPageContextInfo.siteServerRelativeUrl) + POST_URL_PATH,
      fjs.assign(cfg, __metadata()));
  };

  /** @namespace */
  sputils.search = {
    searchCfgExample: searchCfgExample,
    postSearch: postSearch
  };
})();
;(function () {
  'use strict';

  /**
   * A getter for the array of strings that can be directly used with moment.tz
   * to add links for the names of the timezones that SharePoint has.
   * I.e. after registering the links with moment.tz, one would be able to send
   * the string representation that SharePoint has to identify a timezone
   * to moment.tz and expect it to work.
   * @function sputils.thirdParty.moment.tz.timezoneMap
   * @example
   * // add the links to moment.tz
   * moment.tz.link(sputils.thirdParty.moment.tz.links());
   * // get the timezone for the web
   * sputils.rest.get('_api/Web/RegionalSettings/TimeZone')
   *   .then(function (result) {
   *     var spTzName = result.d.Description; // unwrap
   *     var momentInstance = moment.tz(spTzName); // create the moment.tz instance
   *     var repr = momentInstance.format('LLLL z');
   *     console.log(repr);
   *   });
   */
  var momentTzLinks = function () {
    var mappings = [
      'Africa/Cairo|(GMT+02:00) Cairo',
      'Africa/Cairo|(UTC+02:00) Cairo',
      'Asia/Damascus|(GMT+02:00) Damascus',
      'Asia/Damascus|(UTC+02:00) Damascus',
      'Africa/Johannesburg|(GMT+02:00) Harare, Pretoria',
      'Africa/Johannesburg|(UTC+02:00) Harare, Pretoria',
      'Africa/Bangui|(GMT+01:00) West Central Africa',
      'Africa/Bangui|(UTC+01:00) West Central Africa',
      'Africa/Addis_Ababa|(GMT+03:00) Nairobi',
      'Africa/Addis_Ababa|(UTC+03:00) Nairobi',
      'Africa/Windhoek|(GMT+02:00) Windhoek', // I think that +2h is wrong but SP has this declaration https://msdn.microsoft.com/library/microsoft.sharepoint.spregionalsettings.timezones.aspx
      'Africa/Windhoek|(UTC+02:00) Windhoek',
      'Africa/Windhoek|(GMT+01:00) Windhoek',
      'Africa/Windhoek|(UTC+01:00) Windhoek',
      'America/Anchorage|(GMT-09:00) Alaska',
      'America/Anchorage|(UTC-09:00) Alaska',
      'America/Bogota|(GMT-05:00) Bogota, Lima, Quito, Rio Branco',
      'America/Bogota|(UTC-05:00) Bogota, Lima, Quito, Rio Branco',
      'America/Bogota|(GMT-05:00) Bogota, Lima, Quito',
      'America/Bogota|(UTC-05:00) Bogota, Lima, Quito',
      'America/Cayenne|(GMT-03:00) Buenos Aires, Georgetown',
      'America/Cayenne|(UTC-03:00) Buenos Aires, Georgetown',
      'America/Cayenne|(GMT-03:00) Cayenne, Fortaleza',
      'America/Cayenne|(UTC-03:00) Cayenne, Fortaleza',
      'America/Argentina/Buenos_Aires|(GMT-03:00) Buenos Aires',
      'America/Argentina/Buenos_Aires|(UTC-03:00) Buenos Aires',
      'America/Chicago|(GMT-06:00) Central Time (US and Canada)',
      'America/Chicago|(UTC-06:00) Central Time (US and Canada)',
      'America/Chihuahua|(GMT-07:00) Chihuahua, La Paz, Mazatlan',
      'America/Chihuahua|(UTC-07:00) Chihuahua, La Paz, Mazatlan',
      'America/Boise|(GMT-07:00) Mountain Time (US and Canada)',
      'America/Boise|(UTC-07:00) Mountain Time (US and Canada)',
      'America/Godthab|(GMT-03:00) Greenland',
      'America/Godthab|(UTC-03:00) Greenland',
      'America/Montevideo|(GMT-03:00) Montevideo',
      'America/Montevideo|(UTC-03:00) Montevideo',
      'America/Bahia|(GMT-03:00) Salvador',
      'America/Bahia|(UTC-03:00) Salvador',
      'Etc/GMT-2|(GMT-02:00) Coordinated Universal Time-02',
      'Etc/GMT-2|(UTC-02:00) Coordinated Universal Time-02',
      'America/Belize|(GMT-06:00) Central America',
      'America/Belize|(UTC-06:00) Central America',
      'America/Glace_Bay|(GMT-04:00) Atlantic Time (Canada)',
      'America/Glace_Bay|(UTC-04:00) Atlantic Time (Canada)',
      'America/Detroit|(GMT-05:00) Indiana (East)',
      'America/Detroit|(UTC-05:00) Indiana (East)',
      'America/La_Paz|(GMT-04:00) Caracas, La Paz',
      'America/La_Paz|(UTC-04:00) Caracas, La Paz',
      'America/La_Paz|(GMT-04:00) Georgetown, La Paz, Manaus, San Juan',
      'America/La_Paz|(UTC-04:00) Georgetown, La Paz, Manaus, San Juan',
      'America/Caracas|(GMT-04:30) Caracas',
      'America/Caracas|(UTC-04:30) Caracas',
      'America/Asuncion|(GMT-04:00) Asuncion',
      'America/Asuncion|(UTC-04:00) Asuncion',
      'America/Campo_Grande|(GMT-04:00) Cuiaba',
      'America/Campo_Grande|(UTC-04:00) Cuiaba',
      'America/Dawson|(GMT-08:00) Pacific Time (US and Canada)',
      'America/Dawson|(UTC-08:00) Pacific Time (US and Canada)',
      'America/Boa_Vista|(GMT-04:00) Manaus',
      'America/Boa_Vista|(UTC-04:00) Manaus',
      'America/Merida|(GMT-06:00) Guadalajara, Mexico City, Monterrey',
      'America/Merida|(UTC-06:00) Guadalajara, Mexico City, Monterrey',
      'America/Detroit|(GMT-05:00) Eastern Time (US and Canada)',
      'America/Detroit|(UTC-05:00) Eastern Time (US and Canada)',
      'America/Creston|(GMT-07:00) Arizona',
      'America/Creston|(UTC-07:00) Arizona',
      'America/Belize|(GMT-06:00) Saskatchewan',
      'America/Belize|(UTC-06:00) Saskatchewan',
      'America/Santa_Isabel|(GMT-08:00) Tijuana, Baja California',
      'America/Santa_Isabel|(UTC-08:00) Tijuana, Baja California',
      'America/Santa_Isabel|(GMT-08:00) Baja California',
      'America/Santa_Isabel|(UTC-08:00) Baja California',
      'America/Santiago|(GMT-04:00) Santiago',
      'America/Santiago|(UTC-04:00) Santiago',
      'America/Sao_Paulo|(GMT-03:00) Brasilia',
      'America/Sao_Paulo|(UTC-03:00) Brasilia',
      'America/St_Johns|(GMT-03:30) Newfoundland',
      'America/St_Johns|(UTC-03:30) Newfoundland',
      'Asia/Almaty|(GMT+06:00) Astana, Dhaka',
      'Asia/Almaty|(UTC+06:00) Astana, Dhaka',
      'Asia/Almaty|(GMT+06:00) Astana',
      'Asia/Almaty|(UTC+06:00) Astana',
      'Asia/Dacca|(GMT+06:00) Dhaka',
      'Asia/Dacca|(UTC+06:00) Dhaka',
      'Asia/Amman|(GMT+02:00) Amman',
      'Asia/Amman|(UTC+02:00) Amman',
      'Asia/Aden|(GMT+03:00) Baghdad',
      'Asia/Aden|(UTC+03:00) Baghdad',
      'Europe/Kaliningrad|(GMT+03:00) Kaliningrad, Minsk',
      'Europe/Kaliningrad|(UTC+03:00) Kaliningrad, Minsk',
      'Asia/Baku|(GMT+04:00) Baku',
      'Asia/Baku|(UTC+04:00) Baku',
      'Asia/Bangkok|(GMT+07:00) Bangkok, Hanoi, Jakarta',
      'Asia/Bangkok|(UTC+07:00) Bangkok, Hanoi, Jakarta',
      'Asia/Beirut|(GMT+02:00) Beirut',
      'Asia/Beirut|(UTC+02:00) Beirut',
      'Asia/Calcutta|(GMT+05:30) Sri Jayawardenepura',
      'Asia/Calcutta|(UTC+05:30) Sri Jayawardenepura',
      'Asia/Dubai|(GMT+04:00) Abu Dhabi, Muscat',
      'Asia/Dubai|(UTC+04:00) Abu Dhabi, Muscat',
      'Asia/Irkutsk|(GMT+08:00) Irkutsk, Ulaan Bataar',
      'Asia/Irkutsk|(UTC+08:00) Irkutsk, Ulaan Bataar',
      'Asia/Irkutsk|(GMT+09:00) Irkutsk',
      'Asia/Irkutsk|(UTC+09:00) Irkutsk',
      'Asia/Jerusalem|(GMT+02:00) Jerusalem',
      'Asia/Jerusalem|(UTC+02:00) Jerusalem',
      'Asia/Kabul|(GMT+04:30) Kabul',
      'Asia/Kabul|(UTC+04:30) Kabul',
      'Asia/Kathmandu|(GMT+05:45) Kathmandu',
      'Asia/Kathmandu|(UTC+05:45) Kathmandu',
      'Asia/Calcutta|(GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi',
      'Asia/Calcutta|(UTC+05:30) Chennai, Kolkata, Mumbai, New Delhi',
      'Asia/Krasnoyarsk|(GMT+07:00) Krasnoyarsk',
      'Asia/Krasnoyarsk|(UTC+07:00) Krasnoyarsk',
      'Asia/Krasnoyarsk|(GMT+08:00) Krasnoyarsk ',
      'Asia/Krasnoyarsk|(UTC+08:00) Krasnoyarsk ',
      'Asia/Magadan|(GMT+11:00) Magadan, Solomon Is., New Caledonia',
      'Asia/Magadan|(UTC+11:00) Magadan, Solomon Is., New Caledonia',
      'Asia/Magadan|(GMT+12:00) Magadan',
      'Asia/Magadan|(UTC+12:00) Magadan',
      'Asia/Kamchatka|(GMT+12:00) Petropavlovsk-Kamchatsky - Old',
      'Asia/Kamchatka|(UTC+12:00) Petropavlovsk-Kamchatsky - Old',
      'Pacific/Guadalcanal|(GMT+11:00) Solomon Is., New Caledonia',
      'Pacific/Guadalcanal|(UTC+11:00) Solomon Is., New Caledonia',
      'Asia/Almaty|(GMT+06:00) Almaty, Novosibirsk',
      'Asia/Almaty|(UTC+06:00) Almaty, Novosibirsk',
      'Asia/Novosibirsk|(GMT+07:00) Novosibirsk',
      'Asia/Novosibirsk|(UTC+07:00) Novosibirsk',
      'Asia/Rangoon|(GMT+06:30) Yangon (Rangoon)',
      'Asia/Rangoon|(UTC+06:30) Yangon (Rangoon)',
      'Asia/Aden|(GMT+03:00) Kuwait, Riyadh',
      'Asia/Aden|(UTC+03:00) Kuwait, Riyadh',
      'Asia/Pyongyang|(GMT+09:00) Seoul',
      'Asia/Pyongyang|(UTC+09:00) Seoul',
      'Asia/Chongqing|(GMT+08:00) Beijing, Chongqing, Hong Kong S.A.R., Urumqi',
      'Asia/Chongqing|(UTC+08:00) Beijing, Chongqing, Hong Kong S.A.R., Urumqi',
      'Asia/Chongqing|(GMT+08:00) Beijing, Chongqing, Hong Kong, Urumqi',
      'Asia/Chongqing|(UTC+08:00) Beijing, Chongqing, Hong Kong, Urumqi',
      'Asia/Singapore|(GMT+08:00) Kuala Lumpur, Singapore',
      'Asia/Singapore|(UTC+08:00) Kuala Lumpur, Singapore',
      'Asia/Chongqing|(GMT+08:00) Taipei',
      'Asia/Chongqing|(UTC+08:00) Taipei',
      'Asia/Ulaanbaatar|(GMT+08:00) Ulaanbaatar',
      'Asia/Ulaanbaatar|(UTC+08:00) Ulaanbaatar',
      'Asia/Samarkand|(GMT+05:00) Islamabad, Karachi, Tashkent',
      'Asia/Samarkand|(UTC+05:00) Islamabad, Karachi, Tashkent',
      'Asia/Karachi|(GMT+05:00) Islamabad, Karachi',
      'Asia/Karachi|(UTC+05:00) Islamabad, Karachi',
      'Asia/Samarkand|(GMT+05:00) Tashkent',
      'Asia/Samarkand|(UTC+05:00) Tashkent',
      'Asia/Tbilisi|(GMT+03:00) Tbilisi',
      'Asia/Tbilisi|(UTC+03:00) Tbilisi',
      'Asia/Tehran|(GMT+03:30) Tehran',
      'Asia/Tehran|(UTC+03:30) Tehran',
      'Asia/Tokyo|(GMT+09:00) Osaka, Sapporo, Tokyo',
      'Asia/Tokyo|(UTC+09:00) Osaka, Sapporo, Tokyo',
      'Asia/Vladivostok|(GMT+10:00) Vladivostok',
      'Asia/Vladivostok|(UTC+10:00) Vladivostok',
      'Asia/Vladivostok|(GMT+11:00) Vladivostok',
      'Asia/Vladivostok|(UTC+11:00) Vladivostok',
      'Asia/Yakutsk|(GMT+09:00) Yakutsk',
      'Asia/Yakutsk|(UTC+09:00) Yakutsk',
      'Asia/Yakutsk|(GMT+10:00) Yakutsk',
      'Asia/Yakutsk|(UTC+10:00) Yakutsk',
      'Asia/Yekaterinburg|(GMT+05:00) Ekaterinburg',
      'Asia/Yekaterinburg|(UTC+05:00) Ekaterinburg',
      'Asia/Yekaterinburg|GMT+06:00) Ekaterinburg',
      'Asia/Yekaterinburg|UTC+06:00) Ekaterinburg',
      'Asia/Yerevan|(GMT+04:00) Yerevan',
      'Asia/Yerevan|(UTC+04:00) Yerevan',
      'Atlantic/Azores|(GMT-01:00) Azores',
      'Atlantic/Azores|(UTC-01:00) Azores',
      'Atlantic/Cape_Verde|(GMT-01:00) Cape Verde Is.',
      'Atlantic/Cape_Verde|(UTC-01:00) Cape Verde Is.',
      'Africa/Abidjan|(GMT) Casablanca, Monrovia, Reykjavik',
      'Africa/Abidjan|(UTC) Casablanca, Monrovia, Reykjavik',
      'Africa/Abidjan|(GMT) Monrovia, Reykjavik',
      'Africa/Abidjan|(UTC) Monrovia, Reykjavik',
      'Africa/Abidjan|(GMT) Casablanca',
      'Africa/Abidjan|(UTC) Casablanca',
      'Etc/UTC|(GMT) Coordinated Universal Time',
      'Etc/UTC|(UTC) Coordinated Universal Time',
      'Australia/Adelaide|(GMT+09:30) Adelaide',
      'Australia/Adelaide|(UTC+09:30) Adelaide',
      'Australia/Brisbane|(GMT+10:00) Brisbane',
      'Australia/Brisbane|(UTC+10:00) Brisbane',
      'Australia/Darwin|(GMT+09:30) Darwin',
      'Australia/Darwin|(UTC+09:30) Darwin',
      'Australia/ACT|(GMT+10:00) Hobart',
      'Australia/ACT|(UTC+10:00) Hobart',
      'Australia/Perth|(GMT+08:00) Perth',
      'Australia/Perth|(UTC+08:00) Perth',
      'Australia/ACT|(GMT+10:00) Canberra, Melbourne, Sydney',
      'Australia/ACT|(UTC+10:00) Canberra, Melbourne, Sydney',
      'Etc/GMT+12|(GMT-12:00) International Date Line West',
      'Etc/GMT+12|(UTC-12:00) International Date Line West',
      'Etc/GMT+2|(GMT-02:00) Mid-Atlantic',
      'Etc/GMT+2|(UTC-02:00) Mid-Atlantic',
      'Africa/Ceuta|(GMT+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna',
      'Africa/Ceuta|(UTC+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna',
      'Asia/Nicosia|(GMT+02:00) Athens, Bucharest, Istanbul',
      'Asia/Nicosia|(UTC+02:00) Athens, Bucharest, Istanbul',
      'Africa/Ceuta|(GMT+01:00) Belgrade, Bratislava, Budapest, Ljubljana, Prague',
      'Africa/Ceuta|(UTC+01:00) Belgrade, Bratislava, Budapest, Ljubljana, Prague',
      'Asia/Nicosia|(GMT+02:00) Minsk',
      'Asia/Nicosia|(UTC+02:00) Minsk',
      'Asia/Nicosia|(GMT+02:00) Minsk (old)',
      'Asia/Nicosia|(UTC+02:00) Minsk (old)',
      'Asia/Nicosia|(GMT+02:00) E. Europe',
      'Asia/Nicosia|(UTC+02:00) E. Europe',
      'Asia/Nicosia|(GMT+02:00) Helsinki, Kyiv, Riga, Sofia, Tallinn, Vilnius',
      'Asia/Nicosia|(UTC+02:00) Helsinki, Kyiv, Riga, Sofia, Tallinn, Vilnius',
      'Asia/Istanbul|(GMT+02:00) Istanbul',
      'Asia/Istanbul|(UTC+02:00) Istanbul',
      'Europe/Belfast|(GMT) Greenwich Mean Time : Dublin, Edinburgh, Lisbon, London',
      'Europe/Belfast|(UTC) Greenwich Mean Time : Dublin, Edinburgh, Lisbon, London',
      'Europe/Belfast|(GMT) Dublin, Edinburgh, Lisbon, London',
      'Europe/Belfast|(UTC) Dublin, Edinburgh, Lisbon, London',
      'Europe/Moscow|(GMT+03:00) Moscow, St. Petersburg, Volgograd',
      'Europe/Moscow|(UTC+03:00) Moscow, St. Petersburg, Volgograd',
      'Europe/Moscow|(GMT+04:00) Moscow, St. Petersburg, Volgograd', // Is in reality +3h so that is how it will be mapped. +3h is new since Sept 2014 https://support.microsoft.com/en-us/kb/2998527
      'Europe/Moscow|(UTC+04:00) Moscow, St. Petersburg, Volgograd',
      'Indian/Mauritius|(GMT+04:00) Port Louis',
      'Indian/Mauritius|(UTC+04:00) Port Louis',
      'Asia/Tbilisi|(GMT+04:00) Tbilisi',
      'Asia/Tbilisi|(UTC+04:00) Tbilisi',
      'Africa/Ceuta|(GMT+01:00) Brussels, Copenhagen, Madrid, Paris',
      'Africa/Ceuta|(UTC+01:00) Brussels, Copenhagen, Madrid, Paris',
      'Africa/Ceuta|(GMT+01:00) Sarajevo, Skopje, Warsaw, Zagreb',
      'Africa/Ceuta|(UTC+01:00) Sarajevo, Skopje, Warsaw, Zagreb',
      'Pacific/Apia|(GMT-11:00) Midway Island, Samoa',
      'Pacific/Apia|(UTC-11:00) Midway Island, Samoa',
      'Pacific/Apia|(GMT+13:00) Samoa',
      'Pacific/Apia|(UTC+13:00) Samoa',
      'Etc/GMT-11|(GMT-11:00) Coordinated Universal Time-11',
      'Etc/GMT-11|(UTC-11:00) Coordinated Universal Time-11',
      'Etc/GMT+12|(UTC+12:00) Coordinated Universal Time+12',
      'Etc/GMT+12|(GMT+12:00) Coordinated Universal Time+12',
      'Antarctica/McMurdo|(GMT+12:00) Auckland, Wellington',
      'Antarctica/McMurdo|(UTC+12:00) Auckland, Wellington',
      'Pacific/Fiji|(GMT+12:00) Fiji Is., Kamchatka, Marshall Is.',
      'Pacific/Fiji|(UTC+12:00) Fiji Is., Kamchatka, Marshall Is.',
      'Pacific/Fiji|(GMT+12:00) Fiji',
      'Pacific/Fiji|(UTC+12:00) Fiji',
      'HST|(GMT-10:00) Hawaii',
      'HST|(UTC-10:00) Hawaii',
      'Pacific/Port_Moresby|(GMT+10:00) Guam, Port Moresby',
      'Pacific/Port_Moresby|(UTC+10:00) Guam, Port Moresby',
      'Pacific/Tongatapu|(GMT+13:00) Nuku\'alofa',
      'Pacific/Tongatapu|(UTC+13:00) Nuku\'alofa'
    ];
    return mappings;
  };

  /** @namespace */
  sputils.thirdParty = {
    /** @namespace */
    moment: {
      /** @namespace */
      tz: {
        links: momentTzLinks
      }
    }
  };
})();
;sputils.fjs = fjs;
})(window);
}
$_global_sputils();
