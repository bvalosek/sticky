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
 * Ensure we have a promise for a single input
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
 * @return {Promise} An array of objects
 */
MappedRepo.prototype.getAll = function()
{
  if (!this._getAll)
    return Promise.reject('No source provider for this method');
};

/**
 * Pass all arguments to the underlying query provider
 * @return {Promise} An array of objects
 */
MappedRepo.prototype.query = function()
{
  if (!this._query)
    return Promise.reject('No source provider for this method');
};

/**
 * @return {Promise} A single object. Same identity as input
 */
MappedRepo.prototype.add = function()
{
  if (!this._add)
    return Promise.reject('No source provider for this method');
};

/**
 * @return {Promise} A single object. Same identity as input
 */
MappedRepo.prototype.update = function()
{
  if (!this._update)
    return Promise.reject('No source provider for this method');
};

/**
 * @return {Promise} A single object. Same identity as input
 */
MappedRepo.prototype.fetch = function()
{
  if (!this._fetch)
    return Promise.reject('No source provider for this method');
};

/**
 * @return {Promise} void
 */
MappedRepo.prototype.remove = function()
{
  if (!this._remove)
    return Promise.reject('No source provider for this method');
};

