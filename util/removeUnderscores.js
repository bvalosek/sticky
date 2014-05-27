module.exports = removeUnderscores;

function unfuck(s)
{
  return s.replace(/_([a-z])/g, function(m, w) {
    return w.toUpperCase();
  });
}

function fuck(s)
{
  return s.replace(/([a-z])([A-Z])/g, function(m, a, b) {
    return a + '_' + b;
  });
}


function removeUnderscores()
{
  return function(input, output, instance)
  {
    var key, key_, value;

    // Change output to be non camelized
    if (output) {
      for (key in output) {
        value = output[key];
        key_ = unfuck(key);
        if (key_ === key) continue;
        delete output[key];
        output[key_] = value;
      }
    } else {
      for (key in input) {
        value = input[key];
        key_ = fuck(key);
        if (key_ === key) continue;
        delete input[key];
        input[key_] = value;
      }
    }
  };
}
