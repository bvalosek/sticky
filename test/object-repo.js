var test       = require('tape');
var ObjectRepo = require('../util/ObjectRepo.js');

test('basics', function(t) {
  t.plan(4);

  var repo = new ObjectRepo();

  repo.add({ id: 1 });
  t.deepEqual(repo.get(1), { id: 1 });
  t.deepEqual(repo.getAll(), [ { id: 1 } ] );
  repo.add({ id: 2 });
  t.deepEqual(repo.query(function(x) { return x.id > 1; }), [ { id: 2 } ]);
  repo.remove({ id : 1 });
  t.throws(function() { repo.get(1); });

});
