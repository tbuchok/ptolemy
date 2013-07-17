var store = {};

function Adapter() {}

Adapter.prototype.save = function(key, value, cb) {
  try {
    store[key] = value;
    cb(null);
  } catch(err) {
    cb(err);
  }
};

Adapter.prototype.all = function(key, cb) {
  try {
    var results = [];
    for (var key in store)
      results.push({ key: key, value: store[key] });
    cb(null, results);
  } catch(err) { cb(err) }
};

Adapter.prototype.find = function(key, cb) {
  if (store[key] === undefined) cb('record not found');
  else cb(null, store[key]);
};  

module.exports = Adapter;