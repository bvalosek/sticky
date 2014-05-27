module.exports = momentize;

var moment = require('moment');

function momentize(fields, outputFormat)
{
  if (!(fields instanceof Array))
    fields = [fields];

  outputFormat = outputFormat || 'YYYY-MM-DD HH:mm:ss';

  return function(input, output)
  {
    if (output) {
      fields.forEach(function(f) { output[f] = moment(output[f]); });
    } else {
      fields.forEach(function(f) { input[f] = input[f].format(outputFormat); });
    }
  };
}
