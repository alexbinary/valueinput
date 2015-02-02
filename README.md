
# ValueInput

A widget to allow input of technical javascript values : strings, numbers, booleans, arrays, objects, `null` and `undefined`.

This is mostly useful for development and testing.


# Overview

The ValueInput widget presents a user interface that allows user to input a value.
User first selects data type then input the value using an appropriate interface.


## Create and insert widget

```javascript
// create widget
var vi = new ValueInput();

// use the replace function to replace an existing element by the widget
// widget takes existing classes and id of replaced element
vi.replace(document.getElementById('target'));

// alternatively, you can grab the widget's toplevel element via the .wrapper property
document.getElementById('parent').appendChild(vi.wrapper);
```

## Get input value

```javascript
// use the 'value' property to get the current value :
console.log(vi.value);

// subscribe to the 'valuechange' event to detect when current value changes :
vi.wrapper.addEventListener('valuechange', function(event) {

  // event contains old and new values :
  console.log(event.oldValue);
  console.log(event.newValue);
});
```

## Configure value and datatypes

```javascript
// initial value can be set via the 'value' option in the initialization
// dictionary (default is undefined) :
var vi = new ValueInput({value: 42}); // initial value is 42, type: number

// use setValue to set the value after creation :
vi.setValue('toto');  // value is now "toto", type: string

// use setDataType to set the widget on a specific data type :
vi.setDataType('boolean');  // widget is now in boolean input mode

// use the 'datatypes' option in the initialization dictionary to restrict
// possible data types (by default, all data types are allowed) :
var vi = new ValueInput({datatypes:{
  'string' : true, // type string is allowed
  'boolean': true  // type boolean is allowed
}});               // other types are not allowed

// use setDataTypes to restrict possible data types after creation :
vi.setDataTypes({
  'string' : true,
  'boolean': true
});

// you can restrict possible data types for the values of arrays and objects :
vi.setDataTypes({
  // using `true` means array can contain all datatypes :
  'array' : true
  // use a dictionary to restrict data types :
  'array'  : {
    'number': true, // array can contain numbers
    'string': true, // array con contain strings
    'array' : true  // array can contain other arrays
  },
  // you can nest restrictions indefinitely :
  'array'  : {            // top level array can contain numbers and other arrays
    'number': true,
    'array' : {           // depth 1 arrays can contain strings and other arrays
      'strings': true,
      'array'  : {        // depth 2 arrays can contain booleans and other arrays
        'boolean': true,
        'array'  : true   // depth 3 arrays can contain any kind of value
                          // (including other arrays)
      }
    }
  },
  // same thing applies to objects :
  'object'  : {
    'number': true
    'object': {
      'strings': true,
      'objects': true,
      'array'  : true
    }
  }
});
```

## Collapse and expand widget

Users can only input value when widget is expanded.
When widget is collapsed it just displays its current value.

```javascript
// the 'collapse' option can be passed in the initialization
// dictionary (default is true) :
var vi = new ValueInput({collapsed: false});  // widget is initially expanded

// after creation call setCollapsed or toggleCollapsed to collapse or expand widget :
vi.setCollapsed(true);  // widget is collapsed
vi.setCollapsed(false); // widget is expanded
vi.toggleCollapsed();   // widget is collapsed
vi.toggleCollapsed();   // widget is expanded
```


# Infos

Javascript data types and data structures on MDN : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Primitive_values


# Contact

Alexandre Bintz <alexandre.bintz@gmail.com>  
Comments and suggestions are welcome.
