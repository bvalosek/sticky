module.exports = Mapper;

/**
 * Tranform and object from/for an input output source and ensure the desired
 * parity of the results.
 * @param {Function} T constructor for the mapped type
 * @constructor
 */
function Mapper(T)
{
  this.T = T;
  this._transforms = [];
}

/**
 * By default, simply copy the keys from the output to the instance, or from
 * the instance to the output.
 * @param {object} input
 * @param {object} output
 * @param {object} instance
 * @return {object} instance
 */
Mapper.defaultTransform = function(input, output, instance)
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

  return instance;
};

/**
 * @param {function(input:object, output:object, instance:object): object} f
 */
Mapper.prototype.use = function(f)
{
  this._transforms.push(f);
};

/**
 * Given some raw output, setup instance with the methods we need.
 * @param {object} raw
 * @return {object} instance
 */
Mapper.prototype.transformOutput = function(raw, instance)
{
  instance = instance || new this.T();

  if (!this._transforms.length) {
    return Mapper.defaultTransform(null, raw, instance);
  }

  // Apply all transforms in order
  for (var n = 0; n < this._transforms.length; n++) {
    var f = this._transforms[n];
    f(null, raw, instance);
  }

  return instance;
};

/**
 * Prepare any input to get passed back the source
 * @param {object} instance Typed object input object
 * @param {object} slug prepared output object
 */
Mapper.prototype.transformInput = function(instance, slug)
{
  slug = slug || {};

  if (!this._transforms.length) {
    Mapper.defaultTransform(slug, null, instance);
    return slug;
  }

  for (var n = this._transforms.length - 1; n >= 0; n--) {
    var f = this._transforms[n];
    f(slug, null, instance);
  }

  return slug;
};

/**
 * Take the output from something and ensure its a single, transformed value.
 * @param {object} thing
 * @param {object=} instance
 * @return {object}
 */
Mapper.prototype.toSingle = function(thing, instance)
{
  if (thing && thing.length)
    thing = thing[0];

  return this.transformOutput(thing, instance);
};

/**
 * Take the output of something and ensure its an array of transformed values.
 * @param {array.<object>} things
 * @return {array.<object>}
 */
Mapper.prototype.toMany = function(things)
{
  if (!things || things.length === undefined)
    things = [things];

  var _this = this;
  return things.map(function(thing) {
    return _this.transformOutput(thing);
  });
};
