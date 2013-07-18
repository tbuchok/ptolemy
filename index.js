var util = require('util')
  , events = require('events')
;

var _adapter = {
    all : function(cb) { cb('#all not implemented') }
  , find : function(k, cb) { cb('#find not implemented') }
  , save : function(k, v, cb) { cb('#save not implemented') }
};

function Ptolemy(data) {
  data = data || {};

  this._id = data._id || Date.now();
  this._key = this.key();
  this._attrs = {};
  this._types = {
      'string'  : String
    , 'num'     : Number
    , 'array'   : Array
    , 'object'  : Object
    , 'date'    : Date
  };

  // Model-specific properties.
}
util.inherits(Ptolemy, events.EventEmitter);

Ptolemy.adapter = function(adapter) {
  _adapter = adapter;
};

Ptolemy.all = function(cb) {
  _adapter.all(cb);
};

Ptolemy.prototype.key = function() {
  var result = '\xFF' + this.constructor.name + '\x00';
  return result;
};

Ptolemy.prototype.createAttr = function(attr, Type) {
  this._attrs[attr] = new Type().constructor.name;
};

Ptolemy.find = function(id, cb) {
  var key = Ptolemy.prototype.key() + id;
  _adapter.find(key, function(err, data) {
    if (err) return cb(err);
    cb(null, new Ptolemy(data));
  });
};

Ptolemy.prototype.toObject = function() {
  var object = {};
  var errors = [];
  var looper = function(value) {
    if (this._attrs[value] === this[value].constructor.name)
      object[value] = this[value]
    else
      errors.push(value + ' type incorrect: expected' + this._attrs[value] + ' received ' + this[value].constructor.name);
  };
  Object.keys(this._attrs).forEach(looper.bind(this));
  object['_id'] = this._id;
  object['_key'] = this._key;
  return (errors.length) ? errors : object;
}

Ptolemy.prototype.save = function(cb) {
  var key = this.key(this.id)
    , value = this.toObject()
  ;

  if (Array.isArray(value)) // Errors occured!
    return (cb) ? cb(value) : this.emit('error', value);

  var handleSave = function(err) {
    if (err) (cb) ? cb(err) : this.emit('error', err);
    else 
      if (cb) cb(err);
  };
  var key = this._key + this._id
  _adapter.save(key, value, handleSave.bind(this));
};

Ptolemy.prototype.error = function(err) {
  this.emit('error', err);
};
 
// must be able to have pre/post validation functions
// must be able to run queries
// must be able to have relationships
// must be able to run batch jobs
// must be able to stream out data

module.exports = Ptolemy;