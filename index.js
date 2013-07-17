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
}

Ptolemy.find = function(id, cb) {
  var key = Ptolemy.prototype.key() + id;
  _adapter.find(key, function(err, data) {
    if (err) return cb(err);
    cb(null, new Ptolemy(data));
  });
};

Ptolemy.prototype.save = function(cb) {
  var key = this.key(this.id)
    , value = 'b'; //this.toJSON()

  var handleSave = function(err) {
    if (err) return cb(err);
    cb(err);
  };
  var key = this._key + this._id
  _adapter.save(key, { '_id': this._id }, handleSave.bind(this));
};

Ptolemy.prototype.error = function(err) {
  this.emit('error', err);
};
 
// must be able to have validations
// must be able to run queries
// must be able to have relationships
// must be able to run batch jobs
// must be able to stream out data

module.exports = Ptolemy;