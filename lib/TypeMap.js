module.exports = TypeMap;

var _ = require('underscore');

/**
 * Slow but simple way of creating a map where the key is an object. Works in
 * O(n) time util real maps appear in es6.
 * @constructor
 */
function TypeMap()
{
  this._entries = [];
}

/**
 * @constructor
 */
function Entry(T, thing)
{
  this.T     = T;
  this.thing = thing;
}

/**
 * @param {Function} T
 * @param {any} d Default value.
 */
TypeMap.prototype.get = function(T, d)
{
  var entry = _(this._entries).find(function(x) { return x.T === T; });

  if (!entry && d !== undefined) {
    this.set(T, d);
    return d;
  }

  return entry ? entry.thing : null;
};

/**
 * @param {Function} T
 * @param {any} thing
 */
TypeMap.prototype.set = function(T, thing)
{
  var entry = _(this._entries).find(function(x) { return x.T === T; });
  if (entry) {
    entry.thing = thing;
  } else {
    this._entries.push(new Entry(T, thing));
  }
};

