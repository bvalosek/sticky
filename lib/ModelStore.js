module.exports = ModelStore;

var TypeMap    = require('typemap');
var Repository = require('./Repository.js');

/**
 * Single store that allows a mapping from a model type to an underlying object
 * repository.
 * @constructor
 */
function ModelStore()
{
  this.repos = new TypeMap();
}

/**
 * Provide a backing store for a type
 * @param {Function} T type constructor
 * @param {object} source Backing store instance
 * @return {ModelStore} this object
 */
ModelStore.prototype.source = function(T, source)
{
  var repo = this.repos.get(T);
  if (!repo) {
    repo = new Repository(T);
    this.repos.set(T, repo);
  }

  repo.source(source);
  return this;
};

/**
 * Delegate custom transforms to the internal mapper
 * @param {function(input:object, output:object, instance:object): object} f
 * @param {Function} T type
 * @return {Repository} this object
 */
ModelStore.prototype.use = function(T, f)
{
  var repo = this.repos.get(T);
  if (!repo)
    throw new Error('No backing repo found for type');
  repo.use(f);
};

/**
 * Get a model by its id.
 * @param {Function} T
 * @return {function(id:string): Promise}
 */
ModelStore.prototype.get = function(T)
{
  var repo = this.repos.get(T);
  if (!repo)
    throw new Error('No backing repo found for type');

  return function(id) { return repo.get(id); };
};

/**
 * Get all models.
 * @param {Functon} T
 * @return {function(): Promise}
 */
ModelStore.prototype.getAll = function(T)
{
  var repo = this.repos.get(T);
  if (!repo)
    throw new Error('No backing repo found for type');

  return function() { return repo.getAll(); };
};

/**
 * Pass query arguments to the underlying repo.
 * @param {Function} T
 * @return {function(item: any): Promise}
 */
ModelStore.prototype.query = function(T)
{
  var repo = this.repos.get(T);
  if (!repo)
    throw new Error('No backing repo found for type');

  return function() { return repo.query.apply(repo, arguments); };
};

/**
 * Add an item to the store.
 * @param {Function} T
 * @return {function(item: any): Promise}
 */
ModelStore.prototype.add = function(T)
{
  var repo = this.repos.get(T);
  if (!repo)
    throw new Error('No backing repo found for type');

  return function(item) { return repo.add(item); };
};

/**
 * Remove an item from the store
 * @param {Function} T
 * @return {function(item: any): Promise}
 */
ModelStore.prototype.remove = function(T)
{
  var repo = this.repos.get(T);
  if (!repo)
    throw new Error('No backing repo found for type');

  return function(item) { return repo.remove(item); };
};

/**
 * Fetch an existing item from the store (update locally)
 * @param {Function} T
 * @return {function(item: any): Promise}
 */
ModelStore.prototype.fetch = function(T)
{
  var repo = this.repos.get(T);
  if (!repo)
    throw new Error('No backing repo found for type');

  return function(item) { return repo.fetch(item); };
};

/**
 * Update the persisted copy of the model (update in the store)
 * @param {Function} T
 * @return {function(item: any): Promise}
 */
ModelStore.prototype.update = function(T)
{
  var repo = this.repos.get(T);
  if (!repo)
    throw new Error('No backing repo found for type');

  return function(item) { return repo.update(item); };
};


