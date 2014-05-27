# sticky

[![Build Status](https://travis-ci.org/bvalosek/sticky.png?branch=master)](https://travis-ci.org/bvalosek/sticky)
[![NPM version](https://badge.fury.io/js/sticky.png)](http://badge.fury.io/js/sticky)

Map model objects across different domains.

> This library is pre-1.0 and should not be considered stable.

> All methods/classes under `util/` are going to be split out into their own
> modules.

[![browser support](https://ci.testling.com/bvalosek/sticky.png)](https://ci.testling.com/bvalosek/sticky)

## Installation

```
$ npm install sticky
```

## Usage

```javascript
var ModelStore = require('sticky').ModelStore;

var db = new ModelStore();
```

Source our store by specifying a model type and a repository or provider (see
*Provider Interface*)

```
// sticky-postgres-repo
db.source(User, new PostgresRepo('app_users'));

// sticky-object-repo
db.source(User, new ObjectRepo());

// sticky-ajax-rest
db.source(User, new RestfulRepo('api/user'));
```

Provide any input/output transforms as needed (see *Transforms*)

```javascript
// sticky-camelize
db.use(User, camelize());

// sticky-momentize
db.use(User, momentize(['dateCreated', 'dateModified']);

// custom transform
db.use(User, function(input, output) {
  ...
});
```

Fire off methods, regardless of the backing provider

```javascript
db.get(User)(userId).then( ... );

db.remove(User)(currentUser).then( ... );

db.getAll(User)().then( ... );
```

The query method on the store will forward all arguments to the underlying
provider. This means that more than likely, there will be somewhat of a leaky
abstraction, depending on how you sourced the store.

```javascript
// e.g., sticky-postgres-repo
db.query(User)('select * from #table where email = @email', user)

// e.g., sticky-object-repo
db.query(User)(function(x) { return x.email === user.email; })

// e.g., sticky-ajax-rest
db.query(User)({ email: user.email })
```

## Provider Interface

Any time a `Repository` is sourced with a provider, it looks for the following
methods to use during CRUD operations. While the `Repository` API will ensure
that all methods return a `Promise`, the providers themselves don't necessarily
have to.

Providers simply have to return an anonymous object representation of the
model, let the mapper handle getting into actual typed-objects. This allows the
provider to be a very thin layer on top of your existing persistence layer.

A provider will implement some or all of the following methods:

* `get(id): object` Return a single model by its id.
* `getAll(): [object]` Return all models as an array.
* `query(q1, q2, ..): [object]` Return the results of a query in an array of
  models. Variable arity.
* `add(object): object` Add a model to the provider and return an updated representation.
* `remove(object): object` Remove a model from the provider.
* `fetch(object): object` Populate a model with all data from the provider (read from provider).
* `update(object): object` Persist an existing model back to the provider (write to provider).

See `sticky-object-repo` as a reference implementation that uses an in-memory
object to store models.

## Transforms

In addition to a source Provider, a repository can consist of a stack of
transforms that all output from the provider passes through. Data is passed
through the same stack of transforms, in reverse, when sending data to a repo.

* Data coming from the provider is **output**, and is altered via calling all
  transform functions in order.
* Data going to the provider is **input**, and is altered via calling all
  transform functions in reverse order.

```javascript
db.use(User, function(input, output) {
  if (output) {

    // if called with an output object, we're processing the output
    output.date = moment(output.date);

  } else {

    // otherwise, we're processing input
    input.date = input.date.format();
  }
});
```

## Tern Support

The source files are all decorated with [JSDoc3](http://usejsdoc.org/)-style
annotations that work great with the [Tern](http://ternjs.net/) code inference
system. Combined with the Node plugin (see this project's `.tern-project`
file), you can have intelligent autocomplete for methods in this library.

## Testing

Testing is done with [Tape](http://github.com/substack/tape) and can be run
with the command `npm test`.

Automated CI cross-browser testing is provided by
[Testling](http://ci.testling.com/bvalosek/sticky), and server-side testing
is done with [Travis CI](https://travis-ci.org/bvalosek/sticky).

## License
Copyright 2014 Brandon Valosek

**sticky** is released under the MIT license.

