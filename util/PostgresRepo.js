module.exports = PostgresRepo;

var Promise  = require('es6-promise').Promise;
var Client   = require('pg').Client;

/**
 * Repository with an underlying postgresql store.
 * @param {Client} client A connected postgres client instance
 * @param {string} table Table name
 * @constructor
 */
function PostgresRepo(client, table)
{
  this.client     = client;
  this.table      = table;
  this.primaryKey = 'id';
}

/**
 * Run a SQL query and return an array of objects (or an array of arrays of
 * objects in the case of a multi-table join query).
 * @param {string} sql
 * @param {array.<any>} params
 * @return {Promise}
 */
PostgresRepo.prototype.query = function(sql, params)
{
  var _this = this;
  return new Promise(function(resolve, reject) {
    var opts = {
      text: sql,
      values: params || [],
      rowMode: 'array'
    };

    var q = _this.client.query(opts);

    q.on('error', function(err) { return reject(err); });

    q.on('end', function(result) { resolve(result.rows); });

    q.on('row', function(row, acc) {
      acc.addRow(_this._processRow(row, acc.fields));
    });

  });
};

/**
 * Get a model from the store.
 * @param {string} id
 * @return {Promise}
 */
PostgresRepo.prototype.get = function(id)
{
  var sql = 'SELECT * FROM ' + this.table + ' WHERE ' +
    this.primaryKey + ' = $1';

  return this.query(sql, [id]).then(firstOrNull);
};

/**
 * @param {number} skip
 * @param {number} take
 * @return {Promise}
 */
PostgresRepo.prototype.getAll = function()
{
  return this.query('SELECT * FROM ' + this.table);
};

/**
 * Remove am model from the store.
 * @param {object} obj Model
 * @return {Promise}
 */
PostgresRepo.prototype.remove = function(obj)
{
  var id = obj[this.primaryKey];

  var sql = 'DELETE FROM ' + this.table + ' WHERE ' +
    this.primaryKey + ' = $1';

  return this.query(sql, [id]);
};

/**
 * @param {object} obj
 * @return {Promise}
 */
PostgresRepo.prototype.add = function(obj)
{
  var sql     = 'INSERT INTO ' + this.table + '(';
  var sValues = '';
  var values  = [];

  var n = 0;
  for (var key in obj) {
    if (key === this.primaryKey) continue;
    if (n++) sql += ', ';
    sql += key;
    values.push(obj[key]);

    if (n > 1) sValues += ', ';
    sValues += '$' + n;
  }

  sql += ') VALUES (' + sValues + ') RETURNING *';

  return this.query(sql, values).then(firstOrNull);
};

/**
 * Populate an existing model with data from the store.
 * @return {Promise}
 */
PostgresRepo.prototype.fetch = function()
{
  throw new Error('Not implemented');
};

/**
 * @return {Promise}
 */
PostgresRepo.prototype.update = function(item)
{
  var sql    = 'UPDATE ' + this.table + ' SET ';
  var values = [];

  var n = 0;
  for (var key in item) {
    if (key === this.primaryKey) continue;
    if (n++) sql += ', ';
    values.push(item[key]);
    sql += key + ' = $' + n;
  }

  sql += ' WHERE ' + this.primaryKey + ' = $' + (++n);
  values.push(item[this.primaryKey]);
  sql += ' RETURNING *';
  return this.query(sql, values).then(firstOrNull);
};

/**
 * Handle a raw row we get from the DB
 */
PostgresRepo.prototype._processRow = function(row, fields)
{
  var objs = [];

  // Iterate over all of the returned columns and split them out across the
  // table boundries into seperate anonymous objects
  var obj       = {};
  var empty     = true;
  var lastTable = null;
  for (var n = 0; n < row.length; n++) {
    var value = row[n];
    var field = fields[n];
    var table = field.tableID;

    obj[field.name] = value;
    lastTable = table;
  }

  objs.push(obj);

  // If we have a multi-object / join query, each row should be an array
  if (objs.length > 1)
    return objs;
  else
    return objs[0];
};

function firstOrNull(result)
{
  if (result && result.length)
    return result[0];
  else
    return null;
}

