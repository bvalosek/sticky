var test       = require('tape');
var ModelStore = require('../lib/ModelStore.js');

function User()
{
  this.id       = null;
  this.username = '';
  this.admin    = false;
}

test('Missing repo throws', function(t) {
  t.plan(7);
  var db = new ModelStore();
  t.throws(function() { db.get(User)(); });
  t.throws(function() { db.getAll(User)(); });
  t.throws(function() { db.query(User)(); });
  t.throws(function() { db.add(User)(); });
  t.throws(function() { db.remove(User)(); });
  t.throws(function() { db.update(User)(); });
  t.throws(function() { db.fetch(User)(); });
});

test('Missing provider fails promise', function(t) {
  t.plan(1);
  var db = new ModelStore();
  db.source(User, { });
  db.get(User)(3).catch(function() { t.pass('throw'); });
});

test('basic get', function(t) {
  t.plan(1);

  var db = new ModelStore();

  // Mock repo
  db.source(User, {
    get: function(id) {
      return { id: id, username: 'bob' };
    }
  });

  db.get(User)(3).then(function(user) {
    t.deepEqual(user, { admin: false, id: 3, username: 'bob' });
  });

});

test('Some transforms for output', function(t) {
  t.plan(1);

  var db = new ModelStore();
  db.source(User, {
    get: function(id) {
      return { id: id, u: 'bob', a: 'true' };
    },
  });

  db.use(User, function(input, output, instance) {
    if (output) {
      output.admin = output.a === 'true';
      delete output.a;
      output.username = output.u;
      delete output.u;
    } else {
      input.a = instance.admin ? 'true' : 'false';
      input.u = instance.username;
      input.id = instance.id;
    }
  });

  db.get(User)(3).then(function(user) {
    t.deepEqual(user, { id: 3, username: 'bob', admin: true });
  });

});
