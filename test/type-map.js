var test    = require('tape');
var TypeMap = require('../lib/TypeMap.js');

test('basic get set', function(t) {
  t.plan(5);

  function A() { }
  function B() { }

  var m = new TypeMap();
  m.set(A, 1);
  t.strictEqual(m.get(A), 1);
  m.set(B, 2);
  t.strictEqual(m.get(A), 1);
  t.strictEqual(m.get(B), 2);
  m.set(A, 3);
  t.strictEqual(m.get(A), 3);
  t.strictEqual(m.get(B), 2);

});
