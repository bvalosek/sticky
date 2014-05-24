module.exports = Repository;

var Promise = require('es6-promise').Promise;

/**
 * A repository pattern that uses a series of sourced providers that attempt to
 * fire off methods. All access is delegated and by default isn't handled.
 * @constructor
 * @param {Function} T
 */
function Repository(T)
{
  this.T = T;

  // Implementation pointers
  this._get    = null;
  this._getAll = null;
  this._query  = null;
  this._add    = null;
  this._remove = null;
  this._fetch  = null;
  this._update = null;

  this._transforms = [];
}

/**
 * By default, simply copy the keys from the output to the instance, or from
 * the instance to the output.
 */
function defaultTransform (input, output, instance)
{
  var k;
  // Coming from the repo
  if (output) {
    for (k in output) {
      instance[k] = output[k];
    }

  // Going to the repo
  } else {
    for (k in instance) {
      input[k] = instance[k];
    }
  }
}

var METHODS = ['get', 'getAll', 'query', 'add', 'remove', 'fetch', 'update'];

/**
 * Ensure we have a promise for a single thing
 * @return {Promise}
 */
Repository.prototype._toSingle = function(thing, instance)
{
  var _this = this;
  return Promise.resolve(thing)
    .then(function(x) {
      if (x && x.length) x = x[0];
      _this._transformOutput(x, instance);
      return instance;
    });
};

/**
 * Ensure we have a promise for an array of things
 * @return {Promise}
 */
Repository.prototype._toMany = function(things)
{
  var _this = this;
  var T = this.T;
  return Promise.resolve(things)
    .then(function(x) {
      if (!x || !x.length) x = [x];
      return x.map(function(u) { return _this._transformOutput(u, new T()); });
    });
};

Repository.prototype.use = function(f)
{
  this._transforms.push(f);
};

/**
 * Given some output from a provider, lets shape the instance based on the
 * output we've got
 * @param {object} raw
 * @param {object} instance
 */
Repository.prototype._transformOutput = function(raw, instance)
{
  if (!this._transforms.length) {
    defaultTransform(null, raw, instance);
    return instance;
  }

  for (var n = 0; n < this._transforms.length; n++) {
    var f = this._transforms[n];
    f(null, raw, instance);
  }

  return instance;
};

/**
 * Provide this repo with a backing source for one or more methods.
 * @param {object} source
 */
Repository.prototype.source = function(source)
{
  for (var n = 0; n < METHODS.length; n++) {
    var key = METHODS[n];
    var _key = '_' + key;
    if (typeof source[key] !== 'function') continue;
    if (this[_key])
      throw new Error('Attempted to source duplicate method');
    this[_key] = source[key].bind(source);
  }
};

/**
 * Find an item based on its id.
 * @param {string} id
 * @return {Promise} A single object.
 */
Repository.prototype.get = function(id)
{
  if (!this._get)
    return Promise.reject('No source provider for this method');

  var _this = this;
  var T = this.T;
  return this._toSingle(this._get(id), new this.T());
};

/**
 * Get all items.
 * @return {Promise} An array of objects
 */
Repository.prototype.getAll = function()
{
  if (!this._getAll)
    return Promise.reject('No source provider for this method');

  var _this = this;
  var T = this.T;
  return this._toMany(this._getAll());
};

/**
 * Query the underying provider for an array of items.
 * @return {Promise} An array of objects
 */
Repository.prototype.query = function()
{
  if (!this._query)
    return Promise.reject('No source provider for this method');

  return this._toMany(this._query.apply(this._query, arguments));
};

/**
 * @param {object} item
 * @return {Promise} A single object. Same identity as input
 */
Repository.prototype.add = function(item)
{
  if (!this._add)
    return Promise.reject('No source provider for this method');

  return this._toSingle(this._add(item));
};

/**
 * Persist an item's state to the underyling provider.
 * @param {object} item
 * @return {Promise} A single object. Same identity as input
 */
Repository.prototype.update = function(item)
{
  if (!this._update)
    return Promise.reject('No source provider for this method');
};

/**
 * Find and populate an item basic on its identity
 * @param {object} item
 * @return {Promise} A single object. Same identity as input
 */
Repository.prototype.fetch = function(item)
{
  if (!this._fetch)
    return Promise.reject('No source provider for this method');
};

/**
 * Remove a particular item.
 * @param {object} item
 * @return {Promise} void
 */
Repository.prototype.remove = function(item)
{
  if (!this._remove)
    return Promise.reject('No source provider for this method');
};

