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
  this.wrapper.classList.add('valueinput');

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

  this.valueWrapper = document.createElement('span');
  this.valueWrapper.classList.add('valuewrapper');

  this.label = document.createElement('span');
  this.valueLabel = document.createElement('span');

  this.stringInput = document.createElement('input');
  this.stringInput.type = 'text';

  this.numberInput = document.createElement('input');
  this.numberInput.type = 'number';

  this.booleanInput = document.createElement('input');
  this.booleanInput.type = 'checkbox';

  this.arrayListElement = document.createElement('ul');

  this.arrayValueInputs = [];

  this.objectListElement = document.createElement('ul');

  this.objectLabelInputs = [];
  this.objectValueInputs = [];

  this.arrayAddBtn = document.createElement('button');
  this.arrayAddBtn.textContent = '+';

  this.objectAddBtn = document.createElement('button');
  this.objectAddBtn.textContent = '+';

  this.value = null;
  this.collapsed = false;
  this.previousSelectChoice = null;

  this.wrapper.appendChild(this.select);
  this.wrapper.appendChild(this.valueWrapper);

  // this.wrapper.addEventListener('mouseover', this.setCollapsed.bind(this, false));
  // this.wrapper.addEventListener('mouseout', this.setCollapsed.bind(this, true));
  // this.valueLabel.addEventListener('click', this.setCollapsed.bind(this, false));
  // this.wrapper.addEventListener('click', this.setCollapsed.bind(this, true));

  this.select.addEventListener('change', this.onSelectChange.bind(this));

  this.stringInput.addEventListener('input', this.updateValue.bind(this));
  this.numberInput.addEventListener('input', this.updateValue.bind(this));
  this.booleanInput.addEventListener('change', this.updateValue.bind(this));

  this.arrayAddBtn.addEventListener('click', this.addArrayValue.bind(this));
  this.objectAddBtn.addEventListener('click', this.addObjectValue.bind(this));

  this.changeEvent = new Event('change');

  this.onSelectChange();
  this.updateValue();
  this.setCollapsed(true);
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

    this.valueWrapper.removeChild(this.stringInput);

  } else if(pChoice == 'number') {

    this.valueWrapper.removeChild(this.numberInput);

  } else if(pChoice == 'boolean') {

    this.valueWrapper.removeChild(this.booleanInput);

  } else if(pChoice == 'array') {

    this.valueWrapper.removeChild(this.arrayListElement);
    this.valueWrapper.removeChild(this.arrayAddBtn);

  } else if(pChoice == 'object') {

    this.valueWrapper.removeChild(this.objectListElement);
    this.valueWrapper.removeChild(this.objectAddBtn);

  } else if(pChoice == 'null') {

  } else if(pChoice == 'undefined') {

  }
}

ValueInput.prototype.setupInput = function(pChoice) {

  if(pChoice == 'string') {

    this.valueWrapper.appendChild(this.stringInput);

  } else if(pChoice == 'number') {

    this.valueWrapper.appendChild(this.numberInput);

  } else if(pChoice == 'boolean') {

    this.valueWrapper.appendChild(this.booleanInput);

  } else if(pChoice == 'array') {

    this.valueWrapper.appendChild(this.arrayListElement);
    this.valueWrapper.appendChild(this.arrayAddBtn);

  } else if(pChoice == 'object') {

    this.valueWrapper.appendChild(this.objectListElement);
    this.valueWrapper.appendChild(this.objectAddBtn);

  } else if(pChoice == 'null') {

  } else if(pChoice == 'undefined') {

  }
}

ValueInput.prototype.addArrayValue = function() {

  var listItem = document.createElement('li');

  var arrayValueInput = new ValueInput();
  arrayValueInput.wrapper.addEventListener('change', this.updateValue.bind(this));

  var arrayRemoveBtn = document.createElement('button');
  arrayRemoveBtn.textContent = '-';
  arrayRemoveBtn.addEventListener('click', this.removeArrayValue.bind(this, arrayValueInput, listItem));

  this.arrayValueInputs.push(arrayValueInput);

  listItem.appendChild(arrayValueInput.wrapper);
  listItem.appendChild(arrayRemoveBtn);
  this.arrayListElement.appendChild(listItem);

  this.updateValue();
}

ValueInput.prototype.addObjectValue = function() {

  var listItem = document.createElement('li');

  var objectLabelInput = document.createElement('input');
  objectLabelInput.type = 'text';
  objectLabelInput.addEventListener('input', this.updateValue.bind(this));

  var objectValueInput = new ValueInput();
  objectValueInput.wrapper.addEventListener('change', this.updateValue.bind(this));

  var objectRemoveBtn = document.createElement('button');
  objectRemoveBtn.textContent = '-';
  objectRemoveBtn.addEventListener('click', this.removeObjectValue.bind(this, objectLabelInput, objectValueInput, listItem));

  this.objectLabelInputs.push(objectLabelInput);
  this.objectValueInputs.push(objectValueInput);

  listItem.appendChild(objectLabelInput);
  listItem.appendChild(objectValueInput.wrapper);
  listItem.appendChild(objectRemoveBtn);
  this.objectListElement.appendChild(listItem);

  this.updateValue();
}

ValueInput.prototype.removeArrayValue = function(pInput, pListItem) {

  var i = this.arrayValueInputs.indexOf(pInput);
  if(i != -1) this.arrayValueInputs.splice(i, 1);

  this.valueWrapper.removeChild(pListItem);

  this.updateValue();
}

ValueInput.prototype.removeObjectValue = function(pLabelInput, pValueInput, pListItem) {

  var i = this.objectLabelInputs.indexOf(pLabelInput);
  if(i != -1) this.objectLabelInputs.splice(i, 1);

  var i = this.objectValueInputs.indexOf(pValueInput);
  if(i != -1) this.objectValueInputs.splice(i, 1);

  this.valueWrapper.removeChild(pListItem);

  this.updateValue();
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

ValueInput.prototype.setCollapsed = function(bCollapsed) {

  if(bCollapsed == this.collapsed) {
    return;
  }

  if(bCollapsed) {

    var labelText = '';
    var valueText = '';

    if(this.select.value == 'string') {

      labelText = '';
      valueText = '"' + this.stringInput.value + '"';

    } else if(this.select.value == 'number') {

      labelText = 'number: ';
      valueText = this.numberInput.value;

    } else if(this.select.value == 'boolean') {

      labelText = 'boolean: ';
      valueText = this.booleanInput.checked ? 'true' : 'false';

    } else if(this.select.value == 'array') {

      labelText = '';
      valueText = '[...]';

    } else if(this.select.value == 'object') {

      labelText = '';
      valueText = '{...}';

    } else if(this.select.value == 'null') {

      labelText = 'null';
      valueText = '';

    } else if(this.select.value == 'undefined') {

      labelText = 'undefined';
      valueText = '';
    }

    this.label.textContent = labelText;
    this.valueLabel.textContent = valueText;

    this.wrapper.replaceChild(this.label, this.select);
    this.wrapper.replaceChild(this.valueLabel, this.valueWrapper);

  } else {

    this.wrapper.replaceChild(this.select, this.label);
    this.wrapper.replaceChild(this.valueWrapper, this.valueLabel);
  }

  if(bCollapsed) {
    this.wrapper.classList.add('collapsed');
  } else {
    this.wrapper.classList.remove('collapsed');
  }

  this.collapsed = bCollapsed;
}

ValueInput.prototype.toggleCollapsed = function() {

  this.setCollapsed(!this.collapsed);
}
