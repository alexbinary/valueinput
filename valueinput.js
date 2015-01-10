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

  this.addBtn = document.createElement('button');
  this.addBtn.textContent = '+';

  this.value = null;
  this.previousSelectChoice = null;

  this.wrapper.appendChild(this.select);

  this.select.addEventListener('change', this.onSelectChange.bind(this));

  this.stringInput.addEventListener('input', this.updateValue.bind(this));
  this.numberInput.addEventListener('input', this.updateValue.bind(this));
  this.booleanInput.addEventListener('change', this.updateValue.bind(this));

  this.addBtn.addEventListener('click', this.addArrayValue.bind(this));

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
    this.wrapper.removeChild(this.addBtn);

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

    this.wrapper.appendChild(this.booleanInput);

  } else if(pChoice == 'array') {

    for(var i in this.arrayValueInputs) {

      this.insertArrayValueInput(this.arrayValueInputs[i], this.arrayRemoveBtns[i]);
    }
    this.wrapper.appendChild(this.addBtn);

  } else if(pChoice == 'object') {

  } else if(pChoice == 'null') {

  } else if(pChoice == 'undefined') {

  }
}

ValueInput.prototype.addArrayValue = function() {

  if(this.select.value == 'array') {

    var arrayValueInput = new ValueInput();
    arrayValueInput.wrapper.addEventListener('change', this.updateValue.bind(this));
    this.arrayValueInputs.push(arrayValueInput);

    var arrayRemoveBtn = document.createElement('button');
    arrayRemoveBtn.textContent = '-';
    arrayRemoveBtn.addEventListener('click', this.removeArrayValue.bind(this, arrayValueInput, arrayRemoveBtn));
    this.arrayRemoveBtns.push(arrayRemoveBtn);

    this.insertArrayValueInput(arrayValueInput, arrayRemoveBtn);

    this.updateValue();

  } else if(this.select.value == 'object') {

  }
}

ValueInput.prototype.removeArrayValue = function(pInput, pButton) {

  var i = this.arrayValueInputs.indexOf(pInput);
  if(i != -1) this.arrayValueInputs.splice(i, 1);

  var i = this.arrayRemoveBtns.indexOf(pButton);
  if(i != -1) this.arrayRemoveBtns.splice(i, 1);

  this.removeArrayValueInput(pInput, pButton);

  this.updateValue();
}

ValueInput.prototype.insertArrayValueInput = function(pInput, pButton) {

  if(this.addBtn.parentNode) {
    this.wrapper.insertBefore(pInput.wrapper, this.addBtn);
    this.wrapper.insertBefore(pButton, this.addBtn);
  } else {
    this.wrapper.appendChild(pInput.wrapper);
    this.wrapper.appendChild(pButton);
  }
}

ValueInput.prototype.removeArrayValueInput = function(pInput, pButton) {

  this.wrapper.removeChild(pInput.wrapper);
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
