
# ValueInput

A widget to allow input of technical javascript values : strings, numbers, booleans, arrays, objects, `null` and `undefined`.

This is mostly useful for development and testing.


# Overview

The ValueInput widget presents a user interface that allows user to input a value.
User first selects data type then input the value using an appropriate interface.


## Create and insert widget

```javascript
var vi = new ValueInput();

// replace existing element
vi.replace(document.getElementById('target'));  // takes classes and id of replaced element

// or do whatever you want with vi.wrapper
document.getElementById('parent').appendChild(vi.wrapper);
```

## Get input value

```javascript

// direct access
var widgetValue = vi.value;

// DOM event
vi.wrapper.addEventListener('valuechange', function(event) {

  var valueBeforeChange = event.oldValue;
  var valueAfterChange = event.newValue;
});
```

## Configure value and datatypes

```javascript
// set initial value at creation or later
var vi = new ValueInput({value: 42});
vi.setValue(43);

// set the widget on a specific data type
vi.setDataType('boolean');

// set allowed datatypes at creation or later
var vi = new ValueInput({datatypes:{
  'string' : true,  // allowed
  'boolean': false  // not allowed
                    // types not specified are not allowed
}});
vi.setDataTypes({
  'string' : true,
  'boolean': true,
  'array'  : {
    'number': true,
    'object' : {
      'strings': true,
      'array'  : ... // go as deep as you want
    }
  }
});
```

## Collapse and expand widget

Users can only input value when widget is expanded.
When widget is collapsed it just displays its current value.

```javascript
// set collapsed state at creation or later
var vi = new ValueInput({collapsed: false});
vi.setCollapsed(true);
vi.toggleCollapsed();
```

## Styling

The widget itself does not contain any CSS
but the DOM tree is full of classes that help apply style.
See the complete DOM structure in the documentation below.


# Documentation


## DOM Structure

Widget is composed of two main parts : the data type selector and the value input elements.
Data type selector is a `<select>` tag.
Input elements are enclosed in a `<span>` with class `.valuewrapper`.
Each data type has specific input elements :
- string   : `<input>` tag of type `text`
- number   : `<input>` tag of type `number`
- boolean  : `<input>` tag of type `checkbox`
- array    : multiple ValueInput widgets (see DOM structure below)
- object   : multiple pair of `<input>` tag of type `text` for the labels and ValueInput widgets for the values (see DOM structure below)
- null     : no input
- undefined: no input

Types array an object form a recursive structure where ValueInput widgets can be nested indefinitely.

Because input element are inserted and removed from the tree when data type changes,
switching back to a previously visited data type reapplies the value that was set for that data type, if any.

Data type can be selected programmatically via the `setDataType` method.

### Collapsed and expanded

Widget has two mode : collapsed and expanded.

Users can only input value when widget is expanded.
When collapsed, the datatype selector is removed and the input element are replaced
by a label that displays a textual representation of the current value.

A button allows users to expand or collapse the widget.
Collapse state can also be set programmatically via the `setCollapsed` or `toggleCollapsed` functions.

### Complete DOM tree

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


## Events

### valuechange

This event is fired after the widget's value changes.

Event object contains the following properties :
- `oldValue` : value before change
- `newValue` : value after change

The event is dispatched on the widget's toplevel DOM element,
which can be accessed via the `.wrapper` property.

The event may be fired when the value has not actually changed,
i.e. `oldValue` and `newValue` can be equal.


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
