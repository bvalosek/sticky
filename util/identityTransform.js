module.exports = identityTranform;

/**
 * A stick tranform that keeps in internal hash of all returned objects to
 * ensure that identity is maintained. This is leaky as hell.
 * @param {function(item: any): string} idSelector
 */
function identityTranform(idSelector)
{
  idSelector = idSelector || function(x) { return x.id; };

  var identityMap = {};
  return function(input, output, instance) {
    var id;

    // Swap out the instance we are populating in the output transform chain if
    // we have a cached version of it, otherwise this will be the cached
    // instance.
    if (output) {
      id = idSelector(output);
      if (!id) return;

      if (identityMap[id]) {
        instance = identityMap[id];
        return instance;
      } else {
        identityMap[id] = instance;
      }

    // For input, first time we see a model, cache the instance if it has an
    // id. Also make sure that if our input instance has an id that its the
    // same identity as what we have cached.
    } else {
      id = idSelector(instance);
      if (!id) return;
      if (!identityMap[id])
        identityMap[id] = instance;
      else if (identityMap[id] !== instance)
        throw new Error('Incorrect identity for model id ' + id);
    }
  };
}

