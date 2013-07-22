var Level = require('level')
  , SubLevel = require('level-sublevel')
  , db = SubLevel(Level('./db-ptolemy'))
  , util = require('util')
  , events = require('events')
;

var guid = function() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
  });
};

var createInstance = function createInstance(options) {
  options = options || {};
  var instance = Object.create(this);
  instance._id = options._id || guid();
  Object.keys(options).forEach(function(key) {
    if (instance.schema.hasOwnProperty(key))
      instance[key] = options[key]
  });
  var errors = validate(instance);
  if (errors) throw new Error(errors.join('; '));
  return instance;
};

var validate = function validate(model) {
  var errors = [];
  Object.keys(model.schema).forEach(function(key){
    if (model[key] !== undefined && typeof model[key] !== model.schema[key])
      errors.push('Expecting type ' + model.schema[key] + ' but got type ' + typeof key);
  });
  return (errors.length > 0) ? errors : undefined;
};

var save = function save(cb) {
  var self = this;
  var errors = validate(self);
  if (errors) cb(errors.join('; '));
  self.preHooks.forEach(function(fn){
    fn.call(self);
  });
  self._db.put(self._id, JSON.stringify(self), function(err) {
    if (cb) return cb(err);
    else if (err) emit('error', err);
  });
  self.postHooks.forEach(function(fn){
    fn.call(self);
  });
};

var find = function find(query, cb) {
  var self = this;
  self._db.get(query, function(err, data) {
    if (err) return cb(err);
    try {
      var options = JSON.parse(data);
      var instance = self.createInstance(options);
      cb(null, instance);
    } catch(e) { cb(e); };
  });
};

var addPreHook = function addPreHook(fn) {
  var self = this;
  self.preHooks.push(fn);
};

var addPostHook = function addPreHook(fn) {
  var self = this;
  self.postHooks.push(fn);
};

var create = function create(name) {
  
  if (Ptolemy.dbs[name] !== undefined)
    throw new Error('DB already exists!');
  
  Ptolemy.dbs[name] = name;

  return {
      _db: db.sublevel(name)
    , schema: {}
    , createInstance: createInstance
    , save: save
    , find: find
    , preHooks: []
    , addPreHook: addPreHook
    , postHooks: []
    , addPostHook addPostHook
  }
}

var schema = function schema(attrs) {
  attrs = attrs || {};
  var result = {};
  Object.keys(attrs).forEach(function(key){
    var type = new attrs[key]().constructor.name;
    result[key] = type.toLowerCase();
  });
  return result;
}

var Ptolemy = Object.create({ create: create
                            , schema: schema
                            , dbs: {} 
                            });

util.inherits(Ptolemy, events.EventEmitter)

var ptolemy = module.exports = exports = Object.create(Ptolemy);