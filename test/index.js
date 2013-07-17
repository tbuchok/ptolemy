var test = require('tap').test
  , Ptolemy = require('..')
  , Adapter = require('../Adapter')
;

test('basic Ptolemy operations', function(t) {
  var adapter = new Adapter();
  Ptolemy.adapter(adapter);
  var p = new Ptolemy();
  t.ok(p, 'Creates Ptolemy instances');
  t.ok(p.save,'Has a #save method');
  t.ok(/^\xFFPtolemy\x00/.test(p._key), 'It creates a unique key');
  p.save(function(err) {
    t.ok(err === null, 'It successfully saves');
    Ptolemy.find(p._id, function(err, model) {
      t.ok(err === null, 'It successfully finds');
      t.equals(p._id, model._id, 'It finds the correct record');
      t.end();
    });
  });
});
