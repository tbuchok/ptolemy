var test = require('tap').test
  , Ptolemy = require('..')
;

test('basic Ptolemy operations', function(t) {
  var Explorer = Ptolemy.create('Explorer');
  Explorer.schema = Ptolemy.schema({ name: String, voyages: Number });
  var explorer = Explorer.create({ name: 'Christopher Columbus', voyages: 4 });
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
  var p = P.create({});
  t.end();
});

test('attribute validation', function(t) {
  var Astronaut = Ptolemy.create('Astronaut');
  Astronaut.schema = Ptolemy.schema({ name: String, missions: Number });
  try {
    var astronaut = Astronaut.create({ name: 'Neil Armstrong', missions: 'two' });
  } catch(e) {
    t.ok(e, 'Cannot set the wrong type of schema value');
    t.end();
  }
});

// test('attribute names', function(t) {
//   function Model() {
//     Ptolemy.call(this);
//     this.createAttr('string', String);
//     this.createAttr('number', Number);
//     this.createAttr('date', Date);
//     this.createAttr('object', Object);
//     this.createAttr('function', Function);
//     this.createAttr('ptolemy', Ptolemy);
//     this.createAttr('array', Array);
//   }
//   util.inherits(Model, Ptolemy);
//   var m = new Model();
//   t.equals(m._attrs['string'], 'String', 'Strings works');
//   t.equals(m._attrs['number'], 'Number', 'Number works');
//   t.equals(m._attrs['date'], 'Date', 'Dates works');
//   t.equals(m._attrs['object'], 'Object', 'Objects works');
//   t.equals(m._attrs['function'], 'Function', 'Functions works');
//   t.equals(m._attrs['ptolemy'], 'Ptolemy', 'Ptolemy (a.k.a custom constructors) works');
//   t.equals(m._attrs['array'], 'Array', 'Array works');
//   t.end();
// });

// test('attribute type validation', function(t) {
//   function Model() {
//     Ptolemy.call(this);
//     this.createAttr('foo', String);
//     this.createAttr('bar', Number);
//   }
//   util.inherits(Model, Ptolemy);
//   var m = new Model();
//   m.foo = 'works';
//   m.bar = 'oh no! should be a number!';
//   m.save(function(err) {
//     t.equals(err.length, 1, 'There is one error because `foo:String` works, but `bar:String` does not.');
//     t.end();
//   });
// });

// test('hooks', function(t) {
//   var p = new Ptolemy();
//   Ptolemy.beforeSave(function(){});
//   Ptolemy.afterSave(function(){
//     t.ok(true, 'Reaches the after save callback');
//   });
//   t.equals(1, Ptolemy._hooks['beforeSave'].length, 'It registers one before save hooks');
//   t.equals(1, Ptolemy._hooks['afterSave'].length, 'It registers one after save hooks');
//   Ptolemy.beforeSave(function() {
//     t.equals(this.id, p.id, 'It properly stores the context');
//     t.end();
//   });
//   p.save();
// });

