var test      = require('tape');
var transform = require('../util/camelize.js');


test('output', function(t) {
  t.plan(2);
  var f = transform();
  var o;

  o = { a_b_c: 1 };
  f(null, o);
  t.deepEqual(o, { aBC: 1 });

  o = { some_thing_nice: 1 };
  f(null, o);
  t.deepEqual(o, { someThingNice: 1 });

});

test('input', function(t) {
  t.plan(2);
  var f = transform();
  var o;

  o = { aBC: 1 };
  f(o, null);
  t.deepEqual(o, {a_b_c: 1});

  o = { someThingNice: 1 };
  f(o, null);
  t.deepEqual(o, {some_thing_nice: 1});
});
