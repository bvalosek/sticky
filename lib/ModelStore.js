module.exports = ModelStore;

var TypeMap    = require('./TypeMap.js');
var Repository = require('./Repository.js');

/**
 * Single store that allows a mapping from constructor to underlying repo
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

ModelStore.prototype.get = function(T)
{
  var repo = this.repos.get(T);
  if (!repo)
    throw new Error('No backing repo found for type');

  return function(id) { return repo.get(id); };
};

ModelStore.prototype.getAll = function()
{

};

ModelStore.prototype.query = function()
{

};

ModelStore.prototype.add = function()
{

};

ModelStore.prototype.remove = function()
{

};

ModelStore.prototype.fetch = function()
{

};

ModelStore.prototype.update = function()
{

};


