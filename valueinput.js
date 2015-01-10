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

  this.booleanInput = document.createElement('input');
  this.booleanInput.type = 'checkbox';

  this.arrayValueInputs = [];
  this.arrayRemoveBtns = [];

  this.objectLabelInputs = [];
  this.objectValueInputs = [];
  this.objectRemoveBtns = [];

  this.arrayAddBtn = document.createElement('button');
  this.arrayAddBtn.textContent = '+';

  this.objectAddBtn = document.createElement('button');
  this.objectAddBtn.textContent = '+';

  this.value = null;
  this.previousSelectChoice = null;

  this.wrapper.appendChild(this.select);

  this.select.addEventListener('change', this.onSelectChange.bind(this));

  this.stringInput.addEventListener('input', this.updateValue.bind(this));
  this.numberInput.addEventListener('input', this.updateValue.bind(this));
  this.booleanInput.addEventListener('change', this.updateValue.bind(this));

  this.arrayAddBtn.addEventListener('click', this.addArrayValue.bind(this));
  this.objectAddBtn.addEventListener('click', this.addObjectValue.bind(this));

  this.changeEvent = new Event('change');

  this.onSelectChange();
  this.updateValue();
}

ValueInput.prototype.onSelectChange = function(pEvent) {

  var newSelectChoice = this.select.value;

  this.unsetInput(this.previousSelectChoice);
  this.setupInput(newSelectChoice);

  this.updateValue();

  this.previousSelectChoice = newSelectChoice;
}

ValueInput.prototype.unsetInput = function(pChoice) {

  if(pChoice == 'string') {

    this.wrapper.removeChild(this.stringInput);

  } else if(pChoice == 'number') {

    this.wrapper.removeChild(this.numberInput);

  } else if(pChoice == 'boolean') {

    this.wrapper.removeChild(this.booleanInput);

  } else if(pChoice == 'array') {

    for(var i in this.arrayValueInputs) {
      this.removeArrayValueInput(this.arrayValueInputs[i], this.arrayRemoveBtns[i]);
    }
    this.wrapper.removeChild(this.arrayAddBtn);

  } else if(pChoice == 'object') {

    for(var i in this.objectValueInputs) {
      this.removeObjectValueInput(this.objectLabelInputs[i], this.objectValueInputs[i], this.objectRemoveBtns[i]);
    }
    this.wrapper.removeChild(this.objectAddBtn);

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

    this.wrapper.appendChild(this.booleanInput);

  } else if(pChoice == 'array') {

    for(var i in this.arrayValueInputs) {
      this.insertArrayValueInput(this.arrayValueInputs[i], this.arrayRemoveBtns[i]);
    }
    this.wrapper.appendChild(this.arrayAddBtn);

  } else if(pChoice == 'object') {

    for(var i in this.objectValueInputs) {
      this.insertObjectValueInput(this.objectLabelInputs[i], this.objectValueInputs[i], this.objectRemoveBtns[i]);
    }
    this.wrapper.appendChild(this.objectAddBtn);

  } else if(pChoice == 'null') {

  } else if(pChoice == 'undefined') {

  }
}

ValueInput.prototype.addArrayValue = function() {

  var arrayValueInput = new ValueInput();
  arrayValueInput.wrapper.addEventListener('change', this.updateValue.bind(this));
  this.arrayValueInputs.push(arrayValueInput);

  var arrayRemoveBtn = document.createElement('button');
  arrayRemoveBtn.textContent = '-';
  arrayRemoveBtn.addEventListener('click', this.removeArrayValue.bind(this, arrayValueInput, arrayRemoveBtn));
  this.arrayRemoveBtns.push(arrayRemoveBtn);

  this.insertArrayValueInput(arrayValueInput, arrayRemoveBtn);

  this.updateValue();
}

ValueInput.prototype.addObjectValue = function() {

  var objectLabelInput = document.createElement('input');
  objectLabelInput.type = 'text';
  objectLabelInput.addEventListener('input', this.updateValue.bind(this));
  this.objectLabelInputs.push(objectLabelInput);

  var objectValueInput = new ValueInput();
  objectValueInput.wrapper.addEventListener('change', this.updateValue.bind(this));
  this.objectValueInputs.push(objectValueInput);

  var objectRemoveBtn = document.createElement('button');
  objectRemoveBtn.textContent = '-';
  objectRemoveBtn.addEventListener('click', this.removeObjectValue.bind(this, objectLabelInput, objectValueInput, objectRemoveBtn));
  this.objectRemoveBtns.push(objectRemoveBtn);

  this.insertObjectValueInput(objectLabelInput, objectValueInput, objectRemoveBtn);

  this.updateValue();
}

ValueInput.prototype.removeArrayValue = function(pInput, pButton) {

  var i = this.arrayValueInputs.indexOf(pInput);
  if(i != -1) this.arrayValueInputs.splice(i, 1);

  var i = this.arrayRemoveBtns.indexOf(pButton);
  if(i != -1) this.arrayRemoveBtns.splice(i, 1);

  this.removeArrayValueInput(pInput, pButton);

  this.updateValue();
}

ValueInput.prototype.removeObjectValue = function(pLabelInput, pValueInput, pButton) {

  var i = this.objectLabelInputs.indexOf(pLabelInput);
  if(i != -1) this.objectLabelInputs.splice(i, 1);

  var i = this.objectValueInputs.indexOf(pValueInput);
  if(i != -1) this.objectValueInputs.splice(i, 1);

  var i = this.objectRemoveBtns.indexOf(pButton);
  if(i != -1) this.objectRemoveBtns.splice(i, 1);

  this.removeObjectValueInput(pLabelInput, pValueInput, pButton);

  this.updateValue();
}

ValueInput.prototype.insertArrayValueInput = function(pInput, pButton) {

  if(this.arrayAddBtn.parentNode) {
    this.wrapper.insertBefore(pInput.wrapper, this.arrayAddBtn);
    this.wrapper.insertBefore(pButton, this.arrayAddBtn);
  } else {
    this.wrapper.appendChild(pInput.wrapper);
    this.wrapper.appendChild(pButton);
  }
}

ValueInput.prototype.insertObjectValueInput = function(pLabelInput, pValueInput, pButton) {

  if(this.objectAddBtn.parentNode) {
    this.wrapper.insertBefore(pLabelInput, this.objectAddBtn);
    this.wrapper.insertBefore(pValueInput.wrapper, this.objectAddBtn);
    this.wrapper.insertBefore(pButton, this.objectAddBtn);
  } else {
    this.wrapper.appendChild(pLabelInput);
    this.wrapper.appendChild(pValueInput.wrapper);
    this.wrapper.appendChild(pButton);
  }
}

ValueInput.prototype.removeArrayValueInput = function(pInput, pButton) {

  this.wrapper.removeChild(pInput.wrapper);
  this.wrapper.removeChild(pButton);
}

ValueInput.prototype.removeObjectValueInput = function(pLabelInput, pValueInput, pButton) {

  this.wrapper.removeChild(pLabelInput);
  this.wrapper.removeChild(pValueInput.wrapper);
  this.wrapper.removeChild(pButton);
}

ValueInput.prototype.updateValue = function() {

  var newValue = null;

  if(this.select.value == 'string') {

    newValue = String(this.stringInput.value);

  } else if(this.select.value == 'number') {

    newValue = Number(this.numberInput.value);

  } else if(this.select.value == 'boolean') {

    newValue = Boolean(this.booleanInput.checked);

  } else if(this.select.value == 'array') {

    newValue = new Array();

    for(var i in this.arrayValueInputs) {
      newValue.push(this.arrayValueInputs[i].value);
    }

  } else if(this.select.value == 'object') {

    newValue = new Object();

    for(var i in this.objectValueInputs) {
      newValue[this.objectLabelInputs[i].value] = this.objectValueInputs[i].value;
    }

  } else if(this.select.value == 'null') {

    newValue = null;

  } else if(this.select.value == 'undefined') {

    newValue = undefined;
  }

  var previousValue = this.value;
  this.value = newValue;

  if(newValue !== previousValue) {
    this.wrapper.dispatchEvent(this.changeEvent);
  }
}
