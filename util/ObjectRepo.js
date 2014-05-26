module.exports = ObjectRepo;

/**
 * @constructor
 */
function ObjectRepo()
{
  this._repo = {};
  this._nextId = 1;
}

ObjectRepo.prototype.get = function(id)
{
  var m = this._repo[id];
  if (!m)
    throw new Error('Could not find model id: ' + id);
  return m;
};

ObjectRepo.prototype.getAll = function()
{
  var repo = this._repo;
  return Object.keys(repo).map(function(k) {
    return repo[k];
  });
};

ObjectRepo.prototype.query = function(f)
{
  var ret = [];
  var repo = this._repo;
  Object.keys(repo).map(function(k) {
    var item = repo[k];
    if (f(item))
      ret.push(item);
  });
  return ret;
};

ObjectRepo.prototype.add = function(item)
{
  var id = item.id = item.id || this._nextId++;
  var repo = this._repo;
  if (repo[id])
    throw new Error('Duplicate model id: ' + id);
  repo[item.id] = item;
  return item;
};

ObjectRepo.prototype.remove = function(item)
{
  var id = item.id;
  var repo = this._repo;
  if (!repo[id])
    throw new Error('Model id not found: ' + id);

  delete repo[item.id];
};

ObjectRepo.prototype.fetch = function(item)
{
  throw new Error('Not implemented');
};

ObjectRepo.prototype.update = function(item)
{
  throw new Error('Not implemented');
};


