var test = require('tape');

var ModelStore       = require('../lib/ModelStore.js');
var identityTranform = require('../util/identityTransform.js');
var ObjectRepo       = require('../util/ObjectRepo.js');

function User()
{
  this.id   = null;
  this.name = '';
  this.age  = null;
}

test('keep identity transform', function(t) {
  t.plan(6);

  var db = new ModelStore();

  // use a fake store
  db.source(User, new ObjectRepo());

  // Transform that maintains identity -- separate from actual repo since its
  // doing a user-space transform
  db.use(User, identityTranform());

  // Transform to setup field names -- unaware of identity stuff
  db.use(User, function(input, output, instance) {
    if (output) {
      instance.id   = ''+output.id;
      instance.name = output.n;
      instance.age  = 0|output.a;
    } else {
      input.n = ''+instance.name;
      input.a = ''+instance.age;
      input.id = instance.id ? ''+instance.id : null;
    }
  });

  // ------------ THE GOOD STUFF ------------------

  var me = new User();
  me.name = 'Brandon';
  me.age  = 27;

  var ret;
  db.add(User)(me).then(function(me_) {
    ret = me_;
    t.strictEqual(me_, me);
    return db.get(User)(me_.id);
  }).then(function(x) {
    t.strictEqual(x, ret);
  });

  var user1 = new User();
  user1.name = 'user1';
  user1.age = 27;
  user1.id = '123';
  db.add(User)(user1).then(function(out) {
    t.strictEqual(user1, out);
  });

  var baduser = new User();
  baduser.name = 'bad user';
  baduser.age = 30;
  baduser.id = '123';
  t.throws(function() { db.add(User)(baduser); });

  db.getAll(User)().then(function(users) {
    t.strictEqual(users[0], me);
    t.strictEqual(users[1], user1);
  });

});
