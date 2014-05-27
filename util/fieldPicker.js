module.exports = fieldPicker;

/**
 * Map fields from a provider exclusively
 */
function fieldPicker(fields)
{
  var map = {};

  if (fields instanceof Array) {
    fields.forEach(function(f) { map[f] = f; });
  } else if (typeof fields === 'object') {
    for (var key in fields) {
      map[key] = fields[key];
    }
  }

  return function(input, output) {
    var target = output || input;
    for (var key in target) {
      if (map[key] === undefined)
      delete target[key];
    }
  };
}


