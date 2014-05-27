module.exports = Mapper;

/**
 * Transform objects based on a stack of transform functions that are resolved
 * based on input or output from a source.
 * @param {Function} T constructor for the mapped type
 * @constructor
 */
function Mapper(T)
{
  this.T = T;
  this._transforms = [];
}

/**
 * Add a transform to the stack that handles both input and output
 * transformation.
 * @param {function(input:object, output:object, instance:object): object} f
 */
Mapper.prototype.use = function(f)
{
  this._transforms.push(f);
};

/**
 * Given some raw output, manipulate the instance into what we want it to be.
 * @param {object} raw
 * @return {object} instance Suggested instance container
 */
Mapper.prototype.transformOutput = function(raw, instance)
{
  // If we have a "suggested" instance object to use, ensure its the right type
  if (!instance || instance.constructor !== this.T)
    instance = new this.T();

  // Apply all transforms in order
  for (var n = 0; n < this._transforms.length; n++) {
    var f = this._transforms[n];
    var inst = f(null, raw, instance);

    // If a tranform function returns a value, start using that instead of the
    // instance we created. This allows for transform functions to override the
    // default instance its handed when doing output transform
    if (inst !== undefined)
      instance = inst;
  }

  // For any non-undefined fields in the instance, dump the output into them.
  for (var key in raw) {
    instance[key] = raw[key];
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

  // Straight dumpn
  for (var key in instance) {
    if (~['toJSON', 'toString'].indexOf(key)) continue;
    slug[key] = instance[key];
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
