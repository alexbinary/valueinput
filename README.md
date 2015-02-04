
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
// use the .value property to get the current value :
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
var vi = new ValueInput({value: 42});

// use setValue to set the value after creation :
vi.setValue('toto');

// use setDataType to set the widget on a specific data type :
vi.setDataType('boolean');

// use the 'datatypes' option in the initialization dictionary to restrict
// possible data types (by default, all data types are allowed) :
var vi = new ValueInput({datatypes:{
  'string' : true,  // allowed
  'boolean': false  // not allowed
                    // types that are not specified are not allowed
}});

// use setDataTypes to restrict possible data types after creation :
vi.setDataTypes({
  'string' : true,
  'boolean': true
});

// pass empty dictionary to allow all data types :
vi.setDataTypes({});

// you can restrict possible data types for the values of arrays and objects :
vi.setDataTypes({
  'array'  : {
    'number': true,
    'string': true
  },
  'object'  : {
    'number': true,
    'string': true
  },
  // it is possible to nest restrictions indefinitely :
  'array'  : {
    'number': true,
    'object' : {
      'strings': true,
      'array'  : {
        'boolean': true,
        'array'  : true // use `true` to allow all data types
      }
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
var vi = new ValueInput({collapsed: false});

// call setCollapsed or toggleCollapsed to collapse or expand widget after creation :
vi.setCollapsed(true);
vi.toggleCollapsed();
```

## Styling

The widget itself does not contain any CSS.

The DOM elements are equipped with classes to help apply style.
The DOM tree looks like the following :

```
Collapsed :

  span.valueinput.collapsed.datatype-*
    span.innerwrapper
      button.collapsebtn
      span.valuelabel

Expanded :

  span.valueinput.datatype-*
    span.innerwrapper
      button.collapsebtn
      select.datatypeselector
      span.valuewrapper

Value wrapper for type array :

  span.valuewrapper
    ul.valuelist
      li.valuelistitem.datatype-*
        span.valueinput
    button.addbtn

Value wrapper for type object :

  span.valuewrapper
    ul.valuelist
      li.valuelistitem.datatype-*
        span.labelwrapper
          button.removebtn
          input
          text ":"
        span.valueinput
    button.addbtn
```

Class `datatype-*` can be :
- `datatype-string`
- `datatype-number`
- `datatype-boolean`
- `datatype-array`
- `datatype-object`
- `datatype-null`
- `datatype-undefined`


# Documentation


## Structure

Widget is composed of two main parts : the data type selector and the value input elements.
Data type selector is a `<select>` tag.
Input elements are enclosed in a `<span>` with class `.valuewrapper`.
Each data type has specific input elements :
- string   : `<input>` tag of type `text`
- number   : `<input>` tag of type `number`
- boolean  : `<input>` tag of type `checkbox`
- array    : multiple ValueInput widgets (see DOM structure)
- object   : multiple pair of `<input>` tag of type `text` for the labels and ValueInput widgets for the values (see DOM structure)
- null     : no input
- undefined: no input

Types array an object form a recursive structure where ValueInput widgets can be nested indefinitely.

Data type can be selected programmatically via the `setDataType` method.

### Collapsed and expanded

Widget has two mode : collapsed and expanded.

Users can only input value when widget is expanded.
When collapsed, the datatype selector is removed and the input element are replaced
by a label that displays a textual representation of the current value.

A button allows users to expand or collapse the widget.
Collapse state can also be set programmatically via the `setCollapsed` or `toggleCollapsed` functions.


## Data persistance

The value for each data type is retained when switching to another data type.
Switching back to a data type reapplies the previous value for that data type, if any.


## Events

### valuechange

This event is fired after the widget's value changes.

Event object contains the following properties :
- `oldValue` : value before change
- `newValue` : value after change

The event may be fired when the value has not actually changed,
i.e. `oldValue` and `newValue` can be equal.

The event is dispatched on the widget's toplevel DOM element,
which can be accessed via the `.wrapper` property.


## Properties

The following properties should be considered read-only.
Setting one of them will result in undefined behavior.

### collapsed

Contains the widget's current collapse state :
- `true` : widget is collapsed
- `false`: widget is expanded

Use this property only to read the current state.
Use `setCollapsed` or `toggleCollapsed` to set the collapse state.

### value

Contains the widget's current value.

Use that property only to read the current value.
To set the value use the `setValue` function.

### wrapper

Contains the widget's toplevel DOM element.

Use this property to grab the widget to insert it in the DOM tree.


## Methods

### replaceElement(element)

Replace the given DOM element `element` by the widget.
Widget takes classes and id of replaced element.

`element` must have a parent.

### setCollapsed(collapse)

Set the widget's collapse state :
- `collapse` = `true` : widget is collapsed
- `collapse` = `false`: widget is expanded

### setDataType(type)

Set the widget's current data type to `type`.
`type` can be:
- `string`
- `number`
- `boolean`
- `array`
- `object`
- `null`
- `undefined`

This has the same effect than the user selecting the data type.

### setDataTypes(types)

Set the allowed data types.

`types` is a dictionary.
Keys are data type identifier (`string`, `number`, `boolean`, `array`, `object`, `null`, `undefined`).
A truthy value means the corresponding data type is allowed.
A falsy value means the corresponding data type is not allowed.

For types `array` and `object`, a truthy value means all data types are allowed
for the values of the array or object.

Value for the types `array` and `object` can be a dictionary that specifies which data type are allowed.
This dictionary has the same structure as the main dictionary.
Dictionaries can be nested indefinitely.

If dictionary contains keys that are not valid type identifiers they are ignored.
If dictionary does not contain any valid type identifier, then all data types are allowed.
If dictionary contains some valid type identifiers, then types that are not in the dictionary are not allowed.

### setValue(value)

Set the widget's current value to `value`.
Widget automatically changes to the appropriate data type.

### toggleCollapsed()

Toggle the collapse state.
If widget is collapsed then it becomes expanded.
If widget is expanded then it becomes collapsed.


# Infos

Javascript data types and data structures on MDN : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Primitive_values


# Contact

Alexandre Bintz <alexandre.bintz@gmail.com>  
Comments and suggestions are welcome.
