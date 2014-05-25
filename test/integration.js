var test = require('tape');

var ModelStore = require('../lib/ModelStore.js');

function User()
{
  this.id   = null;
  this.name = '';
  this.age  = null;
}

test('keep identity transform', function(t) {
  t.plan(3);

  var db = new ModelStore();

  // Mock a naive repo that uses hash as backing store and fakes a terse server
  // response format
  var nextId = 1;
  var repo = {};
  db.source(User, {
    get: function(id) {
      console.log('get');
      var m = repo[id];
      if (!m) throw 'Could not find model';
      return m;
    },
    add: function(item) {
      console.log('add');
      item.id = item.id || nextId++;
      if (repo[item.id]) throw 'Duplicate model id: ' + item.id;
      repo[item.id] = item;
      return item;
    }
  });

  // Transform that maintains identity -- separate from actual repo since its
  // doing a user-space transform
  var identityMap = {};
  db.use(User, function(input, output, instance) {
    var id;
    if (output) {
      id = output.id;
      if (!id) return;

      if (identityMap[id]) {
        instance = identityMap[id];
        return instance;
      } else {
        identityMap[id] = instance;
      }
    } else {
      // On first input, populate the identity and ensure we aren't mixing up
      // the identities of things from the client side
      id = instance.id;
      if (!id) return;
      if (!identityMap[id]) {
        identityMap[id] = instance;
      }
      else if (identityMap[id] !== instance)
        throw 'Incorrect identity for model id ' + id;
    }
  });

  // Transform to setup field names -- unaware of identity stuff
  db.use(User, function(input, output, instance) {
    if (output) {
      instance.id   = ''+output.id;
      instance.name = output.n;
      instance.age  = 0|output.a;
    } else {
      input.n = ''+instance.name;
      input.a = ''+instance.age;
      input.id = ''+instance.id;
    }
  });

  // ------------ THE GOOD STUFF ------------------

  var me = new User();
  me.name = 'Brandon';
  me.age  = 27;

  var ret;
  db.add(User)(me).then(function(me) {
    ret = me;
    return db.get(User)(me.id);
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


});
