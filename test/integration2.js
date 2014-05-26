var test = require('tape');

var ModelStore = require('../lib/ModelStore.js');
var fields     = require('../util/fieldPicker.js');
var identity   = require('../util/identityTransform.js');
var ObjectRepo = require('../util/ObjectRepo.js');

function User()
{
  this.id    = null;
  this.email = null;
  this.name  = '';
}

test('yah', function(t) {
  t.plan(2);

  var db = new ModelStore();
  var repo = new ObjectRepo();
  db.source(User, repo);
  db.use(User, identity());
  db.use(User, fields({
    id: 'id',
    email: 'e',
    name: 'n'
  }));

  var u = new User();
  u.name = 'Brandon';
  u.email = 'bvalosek@gmail.com';
  db.add(User)(u)
    .then(function() {
      return db.get(User)(1);
    })
    .then(function(u_) {
      t.strictEqual(u_, u);
      console.log(repo._repo);
      return db.getAll(User)();
    })
    .then(function(users) {
      t.strictEqual(users[0], u);
    });


});


