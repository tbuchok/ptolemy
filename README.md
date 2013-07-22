Ptolemy
===

An ORM.

Ptolemy also devised and provided instructions on how to create maps both of the whole inhabited world and of the Roman provinces.

## Usage

Ptolemy, while awesome, is pretty strange word. Extending the generic ORM with a more specific model might be more helpful.

Perhaps in a separate module, let's call it `./explorer.js`:

```javascript
var Ptolemy = require('Ptolemy')
  , Explorer = Ptolemy.create('Explorer')
;

Explorer.schema = Ptolemy.schema({ name: String, voyages: 4 });

module.exports = Explorer;
```

Include `Model`s in the application:

```javascript
var Explorer = require('./explorer');

var explorer = Explorer.createInstance();
explorer.name = 'Christopher Columbus';
explorer.voyages = 4;
explorer.save(function(err) {
  if (err) // Handle `err` :(
  // It works!
});
});
```

## Validations

_Needs some love._

Models can validate the types of data sent, and verify existence, etc. Models are also able to handle pre/post callbacks.

```javascript
var Explorer = require('./explorer');

var explorer = new Explorer();
explorer.name = 'Ferdinand Magellan';
explorer.voyages = '2';
explorer.save(function(err) {
  console.log(err); // `voyages` should be a Number!
});
// Assuming we'll always get Strings for our Numbers
// let's clean it up!
Explorer.addPreHook(function(){
  this.voyages = parseInt(this.voyages);
});
explorer.save(function(err){
  if (err) // Handle `err` :(
  // It works!
});

```