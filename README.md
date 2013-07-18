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

## Validations

_Needs some love._

Models can validate the types of data sent, and verify existence, etc. Models are also able to handle pre/post callbacks.

```javascript
var Model = require('./model')
  , adapter = require('adapter') // Pending documentation
;
Model.adapter(adapter);

var model = new Model();
model.foo = 'hi!';
model.bar = '1'; 
model.save(function(err) {
  console.log(err); // `bar` should be a Number!
});
// Assuming we'll always get Strings for our Numbers
// let's clean it up!
Model.beforeSave(function(){
  this.bar = parseInt(this.bar);
});
mode.save(function(err){
  console.log(err === null); // No errors!
});

```