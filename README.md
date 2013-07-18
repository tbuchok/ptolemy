Ptolemy
===

An ORM.

Ptolemy also devised and provided instructions on how to create maps both of the whole inhabited world and of the Roman provinces.

## Usage

Ptolemy, while awesome, is pretty strange word. Extending the generic ORM with a more specific model might be more helpful.

Perhaps in a separate module, let's call it `./module.js`:

```javascript
var Ptolemy = require('ptolemy')
;

function Model() {
  Ptolemy.call(this);
  this.createAttr('foo', String);
  this.createAttr('bar', Number);
}
util.inherits(Model, Ptolemy);
module.exports = Model
```

Include `Model`s in the application:

```javascript
var Model = require('./model')
  , adapter = require('adapter') // Pending documentation 
;
Model.adapter(adapter)
var model = new Model()
model.foo = 'hi!';
model.bar = 1;
model.save(function(err){
  if (err) // Handle the error!
});
```

_More to come._