module.exports = Repository;

var Promise = require('es6-promise').Promise;
var Mapper  = require('./Mapper.js');

/**
 * A repository pattern that uses a series of sourced providers that attempt to
 * fire off methods. All access is delegated and by default isn't handled.
 * @constructor
 * @param {Function} T
 */
function Repository(T)
{
  var mapper = this._mapper = new Mapper(T);

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

var METHODS = ['get', 'getAll', 'query', 'add', 'remove', 'fetch', 'update'];

/**
 * Delegate custom transforms to the internal mapper
 * @param {function(input:object, output:object, instance:object): object} f
 * @return {Repository} this object
 */
Repository.prototype.use = function(f)
{
  this._mapper.use(f);
  return this;
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

  var mapper = this._mapper;
  return Promise.resolve(this._get(id))
    .then(function(x) { return mapper.toSingle(x); });
};

/**
 * Get all items.
 * @return {Promise} An array of objects
 */
Repository.prototype.getAll = function()
{
  if (!this._getAll)
    return Promise.reject('No source provider for this method');

  var mapper = this._mapper;
  return Promise.resolve(this._getAll())
    .then(function(x) { return mapper.toMany(x); });
};

/**
 * Query the underying provider for an array of items.
 * @return {Promise} An array of objects
 */
Repository.prototype.query = function()
{
  if (!this._query)
    return Promise.reject('No source provider for this method');
};

/**
 * @param {object} item
 * @return {Promise} A single object. Same identity as input
 */
Repository.prototype.add = function(item)
{
  if (!this._add)
    return Promise.reject('No source provider for this method');
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

