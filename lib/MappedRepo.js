module.exports = MappedRepo;

var Promise = require('es6-promise').Promise;

/**
 * A repository pattern that uses a series of sourced providers that attempt to
 * fire off methods.
 * @constructor
 * @param {Function} T
 */
function MappedRepo(T)
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
}

/**
 * Ensure we have a promise for a single thing
 * @return {Promise}
 */
function toSingle(thing)
{
  return Promise.resolve(thing)
    .then(function(x) {
      if (x && x.length) return x[0];
      return x;
    });
}

/**
 * Ensure we have a promise for an array of things
 * @return {Promise}
 */
function toMany(things)
{
  return Promise.resolve(things)
    .then(function(x) {
      if (x && x.length) return x;
      return [x];
    });
}

/**
 * Find an item based on its id.
 * @param {string} id
 * @return {Promise} A single object.
 */
MappedRepo.prototype.get = function(id)
{
  if (!this._get)
    return Promise.reject('No source provider for this method');

  return toSingle(this._get(id));
};

/**
 * Get all items.
 * @return {Promise} An array of objects
 */
MappedRepo.prototype.getAll = function()
{
  if (!this._getAll)
    return Promise.reject('No source provider for this method');

  return toMany(this._getAll());
};

/**
 * Query the underying provider for an array of items.
 * @return {Promise} An array of objects
 */
MappedRepo.prototype.query = function()
{
  if (!this._query)
    return Promise.reject('No source provider for this method');

  return toMany(this._query.apply(this._query, arguments));
};

/**
 * @param {object} item
 * @return {Promise} A single object. Same identity as input
 */
MappedRepo.prototype.add = function(item)
{
  if (!this._add)
    return Promise.reject('No source provider for this method');

  return toSingle(this._add(item));
};

/**
 * Persist an item's state to the underyling provider.
 * @param {object} item
 * @return {Promise} A single object. Same identity as input
 */
MappedRepo.prototype.update = function(item)
{
  if (!this._update)
    return Promise.reject('No source provider for this method');
};

/**
 * Find and populate an item basic on its identity
 * @param {object} item
 * @return {Promise} A single object. Same identity as input
 */
MappedRepo.prototype.fetch = function(item)
{
  if (!this._fetch)
    return Promise.reject('No source provider for this method');
};

/**
 * Remove a particular item.
 * @param {object} item
 * @return {Promise} void
 */
MappedRepo.prototype.remove = function(item)
{
  if (!this._remove)
    return Promise.reject('No source provider for this method');
};

