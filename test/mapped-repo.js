var test = require('tape');

var MappedRepo = require('../lib/MappedRepo.js');
var Promise    = require('es6-promise').Promise;

test('Missing implementations', function(t) {
  t.plan(7);

  function T() { }
  var m = new MappedRepo(T);

  m.get().catch(function() { t.pass(); });
  m.getAll().catch(function() { t.pass(); });
  m.add().catch(function() { t.pass(); });
  m.remove().catch(function() { t.pass(); });
  m.update().catch(function() { t.pass(); });
  m.fetch().catch(function() { t.pass(); });
  m.query().catch(function() { t.pass(); });

});

test('Map output to single', function(t) {
  t.plan(4);

  function T() { }
  var m = new MappedRepo(T);
  var RET;
  m._get = function() { return RET; };

  // plain value
  RET = 123;
  m.get()
    .then(function(x) { t.strictEqual(x, 123); })

    // array-ed value
    .then(function() { RET = [123]; })
    .then(function() { return m.get(); })
    .then(function(x) { t.strictEqual(x, 123); })

    // Promise for a val
    .then(function() { RET = Promise.resolve(123); })
    .then(function() { return m.get(); })
    .then(function(x) { t.strictEqual(x, 123); })

    // Promise for an array-ed val
    .then(function() { RET = Promise.resolve([123]); })
    .then(function() { return m.get(); })
    .then(function(x) { t.strictEqual(x, 123); });

});
