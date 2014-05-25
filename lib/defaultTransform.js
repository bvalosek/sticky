module.exports = defaultTransform;

/**
 * By default, simply copy all of the keys from the output to the instance, or
 * from the instance to the output.
 * @param {object} input
 * @param {object} output
 * @param {object} instance
 * @return {object} instance
 */
function defaultTransform(input, output, instance)
{
  var k;
  if (output) {
    for (k in output) {
      instance[k] = output[k];
    }
  } else {
    for (k in instance) {
      input[k] = instance[k];
    }
  }
  return instance;
}
