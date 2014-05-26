var test      = require('tape');
var transform = require('../util/identityTransform.js');

test('output', function(t) {
  t.plan(3);
  var f = transform();

  var x = {};
  f(null, { id: 1 }, x);
  var x_ = f(null, { id: 1 }, x);
  t.strictEqual(x, x_, 'instance identity preserved on output transform');

  var y = {};
  f(null, { id: 2 }, y);
  var y_ = f(null, { id: 2 }, y);
  t.strictEqual(y, y_, 'instance identity preserved on output transform');

  var x__ = f(null, { id: 1 }, {});
  t.strictEqual(x, x__, 'instance identity preserved on output transform');
});

test('output with missing id', function(t) {
  t.plan(1);
  var f = transform();

  f(null, { id: null }, {});
  f(null, { id: null }, {});
  f(null, { id: null }, {});
  f(null, { id: null }, {});
  // no throw
  t.pass('no throw');
});

test('output with missing id', function(t) {
  t.plan(1);
  var f = transform();

  f({}, null, { id: null });
  f({}, null, { id: null });
  f({}, null, { id: null });
  t.pass('no throw');
});

test('bad input identity', function(t) {
  t.plan(1);
  var f = transform();

  f({}, null, {id: 1});

  t.throws(function() {
    f({}, null, {id: 1});
  });
});

test('input check', function(t) {
  t.plan(1);
  var f = transform();

  var m = { id: 1 };

  // Transform input of model
  f({}, null, m);

  // tranform output of store
  var m_ = f(null, { id: 1, name: 'yah' }, m);

  t.deepEqual(m, m_);

});

test('id selector', function(t) {
  t.plan(2);

  var f = transform(function(x) { return x._id; });

  var x = {};
  f(null, { _id: 1 }, x);
  var x_ = f(null, { _id: 1 }, x);
  t.strictEqual(x, x_, 'instance identity preserved on output transform');

  // Transform input of model
  var m = { _id: 2 };
  f({}, null, m);

  // tranform output of store
  var m_ = f(null, { _id: 2, name: 'yah' }, m);

  t.deepEqual(m, m_);

});
