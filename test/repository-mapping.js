var test       = require('tape');
var Repository = require('../lib/Repository.js');

test('multi mapping output', function(t) {
  t.plan(2);

  function T()
  {
    this.name = '';
    this.age  = null;
  }

  var repo = new Repository(T);
  repo.source({ getAll: function() {
    return [
      { n: 'Bob', a: 24 }
    ];
  }});

  repo.use(function(input, output, instance) {
    if (output) {
      instance.name = output.n;
      instance.age = output.a;
    }
  });

  repo.getAll().then(function(items) {
    t.deepEqual(items, [ { name: 'Bob', age: 24 } ], 'translated');
    t.strictEqual(items[0].constructor, T, 'proper instance');
  });


});
