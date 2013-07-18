var test = require('tap').test
  , Ptolemy = require('..')
  , Adapter = require('../Adapter')
  , util = require('util')
;

test('basic Ptolemy operations', function(t) {
  var adapter = new Adapter();
  Ptolemy.adapter(adapter);
  var p = new Ptolemy();
  t.ok(p, 'Creates Ptolemy instances');
  t.ok(p.save,'Has a #save method');
  t.ok(/^\xFFPtolemy\x00/.test(p._key), 'It creates a key based on the constructor');
  p.save(function(err) {
    t.ok(err === null, 'It successfully saves');
    Ptolemy.find(p._id, function(err, model) {
      t.ok(err === null, 'It successfully finds');
      t.equals(p._id, model._id, 'It finds the correct record');
      t.end();
    });
  });
});

test('psuedo-async saving', function(t) {
  var p = new Ptolemy();
  p.save();
  t.end();
});

test('inheritance', function(t) {
  function Foo(){
    Ptolemy.call(this);
  }
  util.inherits(Foo, Ptolemy);
  var foo = new Foo();
  t.ok(/^\xFFFoo\x00/.test(foo._key), 'It creates a key based on the constructor');
  t.end();
});

test('attribute names', function(t) {
  function Model() {
    Ptolemy.call(this);
    this.createAttr('string', String);
    this.createAttr('number', Number);
    this.createAttr('date', Date);
    this.createAttr('object', Object);
    this.createAttr('function', Function);
    this.createAttr('ptolemy', Ptolemy);
    this.createAttr('array', Array);
  }
  util.inherits(Model, Ptolemy);
  var m = new Model();
  t.equals(m._attrs['string'], 'String', 'Strings works');
  t.equals(m._attrs['number'], 'Number', 'Number works');
  t.equals(m._attrs['date'], 'Date', 'Dates works');
  t.equals(m._attrs['object'], 'Object', 'Objects works');
  t.equals(m._attrs['function'], 'Function', 'Functions works');
  t.equals(m._attrs['ptolemy'], 'Ptolemy', 'Ptolemy (a.k.a custom constructors) works');
  t.equals(m._attrs['array'], 'Array', 'Array works');
  t.end();
});

test('attribute type validation', function(t) {
  function Model() {
    Ptolemy.call(this);
    this.createAttr('foo', String);
    this.createAttr('bar', Number);
  }
  util.inherits(Model, Ptolemy);
  var m = new Model();
  m.foo = 'works';
  m.bar = 'oh no! should be a number!';
  m.save(function(err) {
    t.equals(err.length, 1, 'There is one error because `foo:String` works, but `bar:String` does not.');
    t.end();
  });
});

test('hooks', function(t) {
  var p = new Ptolemy();
  Ptolemy.beforeSave(function(){});
  Ptolemy.afterSave(function(){
    t.ok(true, 'Reaches the after save callback');
  });
  t.equals(1, Ptolemy._hooks['beforeSave'].length, 'It registers one before save hooks');
  t.equals(1, Ptolemy._hooks['afterSave'].length, 'It registers one after save hooks');
  Ptolemy.beforeSave(function() {
    t.equals(this.id, p.id, 'It properly stores the context');
    t.end();
  });
  p.save();
});

