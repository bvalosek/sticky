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
  var methods = ['get', 'add', 'update', 'fetch'];
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

test('Map output to an array', function(t) {
  var methods = ['query', 'getAll'];
  t.plan(4);

  function T() { }
  var m = new MappedRepo(T);
  var RET;
  m._getAll = function() { return RET; };

  // plain value
  RET = 123;
  m.getAll()
    .then(function(x) { t.deepEqual(x, [123]); })

    // array-ed value
    .then(function() { RET = [123]; })
    .then(function() { return m.getAll(); })
    .then(function(x) { t.deepEqual(x, [123]); })

    // Promise for a val
    .then(function() { RET = Promise.resolve(123); })
    .then(function() { return m.getAll(); })
    .then(function(x) { t.deepEqual(x, [123]); })

    // Promise for an array-ed val
    .then(function() { RET = Promise.resolve([123]); })
    .then(function() { return m.getAll(); })
    .then(function(x) { t.deepEqual(x, [123]); });
});

test('Basic sourcing', function(t) {
  t.plan(2);

  var m = new MappedRepo();
  m.source({ get: function() { return 123; }});
  m.get().then(function(x) { t.strictEqual(x, 123); });
  m.source({ getAll: function() { return [123]; }});
  m.getAll().then(function(x) { t.deepEqual(x, [123]); });

});
