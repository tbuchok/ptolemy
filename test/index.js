var test = require('tap').test
  , Ptolemy = require('..')
;

test('basic Ptolemy operations', function(t) {
  var Explorer = Ptolemy.create('Explorer');
  Explorer.schema = Ptolemy.schema({ name: String, voyages: Number });
  var explorer = Explorer.createInstance({ name: 'Christopher Columbus', voyages: 4 });
  t.ok(explorer, 'It creates instances');
  t.ok(explorer.save, 'It has a save method');
  explorer.save(function(err) {
    if (err) throw new Error(err);
    t.notOk(err, 'It does not find an error on save');
    Explorer.find(explorer._id, function(err, result) {
      t.equal(explorer._id, result._id, 'It finds the correct explorer!');
      t.end();
    });
  });
});

test('psuedo-sync saving', function(t) {
  var P = Ptolemy.create('P');
  P.schema = Ptolemy.schema({});
  var p = P.createInstance({});
  t.ok(p.save() === undefined, 'It saved without a callback!');
  t.end();
});

test('attribute validation', function(t) {
  var Astronaut = Ptolemy.create('Astronaut');
  Astronaut.schema = Ptolemy.schema({ name: String, missions: Number });
  try {
    var astronaut = Astronaut.createInstance({ name: 'Neil Armstrong', missions: 'two' });
  } catch(e) {
    t.ok(e, 'Cannot set the wrong type of schema value');
    t.end();
  }
});

test('attribute names', function(t) {
  var Model = Ptolemy.create('Model');
  var schema = {
      'string': String
    , 'number': Number
    , 'date': Date
    , 'object': Object
    , 'function': Function
    , 'array': Array
  }
  Model.schema = Ptolemy.schema(schema);
  t.equals(Model.schema['string'], 'string', 'Strings works');
  t.equals(Model.schema['number'], 'number', 'Number works');
  t.equals(Model.schema['date'], 'date', 'Dates works');
  t.equals(Model.schema['object'], 'object', 'Objects works');
  t.equals(Model.schema['function'], 'function', 'Functions works');
  t.equals(Model.schema['array'], 'array', 'Array works');
  t.end();
});

test('attribute type validation', function(t) {
  var Validator = Ptolemy.create('Validator');
  Validator.schema = Ptolemy.schema({ foo: String, bar: Number });
  var v = Validator.createInstance();
  v.foo = 'i am a string';
  v.bar = 'oh no! i should be a number!';
  v.save(function(err) {
    t.ok(err, 'There was an error saving.');
    t.end();
  });
});

test('hooks', function(t) {
  var Hook = Ptolemy.create('Hook');
  var hook = Hook.createInstance();
  Hook.addPreHook(function(){
    t.ok(true, 'The pre hook was set');
  });
  Hook.addPreHook(function() {
    t.equals(this, hook, 'Context is correct.');
  });
  Hook.addPostHook(function() {
    t.ok(true, 'The post hook was set');
    t.end();
  });
  hook.save();
});

