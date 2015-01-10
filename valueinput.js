/**
 * valueinput.js - widget for technical javascript value input
 *
 * @author Alexandre Bintz
 * jan. 2015
 */

"use strict";

/**
 * ValueInput
 *
 * constructor
 */
function ValueInput(e) {

  this.input = e;

  this.wrapper = document.createElement('span');

  this.select = document.createElement('select');
  var optElement = document.createElement('option');
  optElement.value = 'string';
  optElement.label = 'string';
  this.select.add(optElement);
  var optElement = document.createElement('option');
  optElement.value = 'number';
  optElement.label = 'number';
  this.select.add(optElement);
  var optElement = document.createElement('option');
  optElement.value = 'boolean';
  optElement.label = 'boolean';
  this.select.add(optElement);
  var optElement = document.createElement('option');
  optElement.value = 'array';
  optElement.label = 'array';
  this.select.add(optElement);
  var optElement = document.createElement('option');
  optElement.value = 'object';
  optElement.label = 'object';
  this.select.add(optElement);
  var optElement = document.createElement('option');
  optElement.value = 'null';
  optElement.label = 'null';
  this.select.add(optElement);
  var optElement = document.createElement('option');
  optElement.value = 'undefined';
  optElement.label = 'undefined';
  this.select.add(optElement);

  this.stringInput = document.createElement('input');
  this.stringInput.type = 'text';

  this.numberInput = document.createElement('input');
  this.numberInput.type = 'number';

  this.arrayInputs = [];

  this.objectLabelInputs = [];
  this.objectValueInputs = [];

  this.value = null;
  this.previousSelectChoice = null;

  this.input.parentElement.replaceChild(this.wrapper, this.input);
  this.wrapper.appendChild(this.select);

  this.select.addEventListener('change', this.onSelectChange.bind(this));

  this.stringInput.addEventListener('input', this.updateValue.bind(this));
  this.numberInput.addEventListener('input', this.updateValue.bind(this));

  this.onSelectChange();
  this.updateValue();
}

ValueInput.prototype.onSelectChange = function(pEvent) {

  this.unsetInput(this.previousSelectChoice);

  var newSelectChoice = this.select.value;

  this.setupInput(newSelectChoice);

  this.previousSelectChoice = newSelectChoice;
}

ValueInput.prototype.unsetInput = function(pChoice) {

  if(pChoice == 'string') {

    this.wrapper.removeChild(this.stringInput);

  } else if(pChoice == 'number') {

    this.wrapper.removeChild(this.numberInput);

  } else if(pChoice == 'boolean') {

  } else if(pChoice == 'array') {

  } else if(pChoice == 'object') {

  } else if(pChoice == 'null') {

  } else if(pChoice == 'undefined') {

  }
}

ValueInput.prototype.setupInput = function(pChoice) {

  if(pChoice == 'string') {

    this.wrapper.appendChild(this.stringInput);

  } else if(pChoice == 'number') {

    this.wrapper.appendChild(this.numberInput);

  } else if(pChoice == 'boolean') {

  } else if(pChoice == 'array') {

  } else if(pChoice == 'object') {

  } else if(pChoice == 'null') {

  } else if(pChoice == 'undefined') {

  }
}

ValueInput.prototype.updateValue = function() {

  var value = null;

  if(this.select.value == 'string') {

    value = String(this.stringInput.value);

  } else if(this.select.value == 'number') {

    value = Number(this.numberInput.value);

  } else if(this.select.value == 'boolean') {

  } else if(this.select.value == 'array') {

  } else if(this.select.value == 'object') {

  } else if(this.select.value == 'null') {

  } else if(this.select.value == 'undefined') {

  }

  this.value = value;
}
