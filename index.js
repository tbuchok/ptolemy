var Level = require('level')
  , SubLevel = require('level-sublevel')
  , db = SubLevel(Level('./db-ptolemy'))
  , util = require('util')
  , events = require('events')
;

var Ptolemy = {
  dbs : {}
};

var guid = function() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
  });
};

var create = function create(name) {
  
  if (Ptolemy.dbs[name] !== undefined)
    throw new Error('DB already exists!');
  
  Ptolemy.dbs[name] = name;

  var _db = db.sublevel(name);

  return {
      _db: _db
    , schema: {}
    , create: function(options) {
      options = options || {};
      var instance = Object.create(this);
      instance._id = options._id || guid();
      Object.keys(options).forEach(function(key) {
        if (instance.schema.hasOwnProperty(key)) {
          if (typeof options[key] === instance.schema[key])
            instance[key] = options[key]
          else
            throw new Error('Expecting type ' + instance.schema[key] + ' but got type ' + typeof key);
        }
      });
      return instance;
    }
    , save: function(cb) {
      _db.put(this._id, JSON.stringify(this), function(err) {
        if (cb) return cb(err);
        else if (err) emit('error', err);
      });
    }
    , find: function(query, cb) {
      var self = this;
      _db.get(query, function(err, data) {
        if (err) return cb(err);
        try {
          var options = JSON.parse(data);
          var instance = self.create(options);
          cb(null, instance);
        } catch(e) { cb(e); };
      });
    }
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

Ptolemy.create = create;
Ptolemy.schema = schema;

util.inherits(Ptolemy, events.EventEmitter)

var ptolemy = module.exports = exports = Object.create(Ptolemy);