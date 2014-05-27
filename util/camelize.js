module.exports = camelize;

/**
 * A sticky transform that will change vars_like_this into varsLikeThis.
 */
function camelize()
{
  return function(input, output)
  {
    var target = output || input;
    var f = output ? remove : add;

    for (var key in target) {
      var value = target[key];
      var key_ = f(key);
      if (key_ === key) continue;
      delete target[key];
      target[key_] = value;
    }

  };
}

function remove(s)
{
  return s.replace(/_([a-z])/g, function(m, w) {
    return w.toUpperCase();
  });
}

function add(s)
{
  return s.replace(/([a-z]*)([A-Z])/g, function(m, a, b) {
    return a + '_' + b.toLowerCase();
  });
}


