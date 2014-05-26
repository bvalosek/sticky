module.exports = fieldPicker;

/**
 * Map fields from a provider
 */
function fieldPicker(fields)
{
  var map = {};

  if (fields instanceof Array) {
    fields.forEach(function(f) { map[f] = f; });
  } else if (typeof fields === 'object') {
    for (var key in fields) {
      console.log('mapping', key, 'to', fields[key]);
      map[key] = fields[key];
    }
  }

  return function(input, output, instance) {
    for (var key in map) {
      var value = map[key];
      if (output) {
        instance[key] = output[value];
      } else {
        input[value] = instance[key];
      }
    }
  };
}


