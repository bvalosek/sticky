var test = require('tape');

var MappedRepo = require('../lib/MappedRepo.js');

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
