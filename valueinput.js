/**
 * valueinput.js - widget for technical javascript value input
 *
 * @author Alexandre Bintz
 * jan. 2015
 */

/* current DOM tree :
 *
 *   Collapsed :
 *
 *   span.valueinput.collapsed
 *     span.innerwrapper
 *       button.collapsebtn
 *       span
 *
 *   Not Collapsed :
 *
 *   span.valueinput
 *     span.innerwrapper
 *       button
 *       select
 *       span.valuewrapper
 *
 *   Value wrapper for type array :
 *
 *   span.valuewrapper
 *     ul
 *       li
 *         button
 *         span.inputvalue
 *     button
 */

"use strict";

/**
 * ValueInput
 *
 * constructor
 *
 * @param {any} pValue - initial value of the input
 */
function ValueInput(pValue) {

  this.initDOM();

  this.value     = undefined;
  this.valueText = undefined;
  this.previousValueType = null;
  this.collapsed         = false;

  this.setValue(pValue);
  this.setCollapsed(true);
}

/**
 * ValueInput - prepare DOM tree
 */
ValueInput.prototype.initDOM = function() {

  this.wrapper = document.createElement('span');
  this.wrapper.classList.add('valueinput');

  this.innerWrapper = document.createElement('span');
  this.innerWrapper.classList.add('innerwrapper');

  this.collapseBtn = document.createElement('button');
  this.collapseBtn.textContent = '';
  this.collapseBtn.classList.add('collapsebtn');

  this.valueWrapper = document.createElement('span');
  this.valueWrapper.classList.add('valuewrapper');

  this.valueLabel = document.createElement('span');

  this.initValueTypeSelect();
  this.initValueInputs();

  this.initEvents();
  this.buildDOMTree();
}

/**
 * ValueInput - create SELECT element for value type selection
 */
ValueInput.prototype.initValueTypeSelect = function() {

  this.valueTypeSelect = document.createElement('select');

  var types = ['string', 'number', 'boolean', 'array', 'object', 'null', 'undefined'];
  for(var i in types) {

    var optElement = document.createElement('option');
    optElement.value = types[i];
    optElement.label = types[i];
    this.valueTypeSelect.add(optElement);
  }
}

/**
 * ValueInput - create elements related to data input
 */
ValueInput.prototype.initValueInputs = function() {

  this.stringInput = document.createElement('input');
  this.stringInput.type = 'text';

  this.numberInput = document.createElement('input');
  this.numberInput.type = 'number';

  this.booleanInput = document.createElement('input');
  this.booleanInput.type = 'checkbox';

  this.arrayListElement = document.createElement('ul');
  this.objectListElement = document.createElement('ul');

  this.arrayAddBtn = document.createElement('button');
  this.arrayAddBtn.textContent = '+';
  this.arrayAddBtn.classList.add('addbtn');

  this.objectAddBtn = document.createElement('button');
  this.objectAddBtn.textContent = '+';
  this.objectAddBtn.classList.add('addbtn');

  this.arrayValueInputs = [];

  this.objectLabelInputs = [];
  this.objectValueInputs = [];
}

/**
 * ValueInput - connect events to handlers
 */
ValueInput.prototype.initEvents = function() {

  this.collapseBtn.addEventListener('click', this.toggleCollapsed.bind(this));
  // this.wrapper.addEventListener('mouseover', this.setCollapsed.bind(this, false));
  // this.wrapper.addEventListener('mouseout', this.setCollapsed.bind(this, true));
  // this.valueLabel.addEventListener('click', this.setCollapsed.bind(this, false));
  // this.wrapper.addEventListener('click', this.setCollapsed.bind(this, true));

  this.valueTypeSelect.addEventListener('change', this.onValueTypeSelectChange.bind(this));

  this.stringInput.addEventListener('input', this.updateValue.bind(this));
  this.numberInput.addEventListener('input', this.updateValue.bind(this));
  this.booleanInput.addEventListener('change', this.updateValue.bind(this));

  this.arrayAddBtn.addEventListener('click', this.addArrayValue.bind(this, null));
  this.objectAddBtn.addEventListener('click', this.addObjectValue.bind(this, null, null));

  this.changeEvent = new Event('change'); // this event is sent to inform listeners that the value has changed
}

/**
 * ValueInput - assembles main DOM elements
 */
ValueInput.prototype.buildDOMTree = function() {

  this.wrapper.appendChild(this.innerWrapper);
  this.innerWrapper.appendChild(this.collapseBtn);
  this.innerWrapper.appendChild(this.valueTypeSelect);
  this.innerWrapper.appendChild(this.valueWrapper);
}

/**
 * ValueInput - new data type has been selected
 */
ValueInput.prototype.onValueTypeSelectChange = function(pEvent) {

  var newValueType = this.valueTypeSelect.value;

  this.unsetValueInput(this.previousValueType);
  this.setupValueInput(newValueType);

  this.updateValue();

  this.previousValueType = newValueType;
}

/**
 * ValueInput - remove inputs related to given data type from DOM tree
 */
ValueInput.prototype.unsetValueInput = function(pValueType) {

  if(pValueType == 'string') {

    this.valueWrapper.removeChild(this.stringInput);
    this.wrapper.classList.remove('datatype-string');

  } else if(pValueType == 'number') {

    this.valueWrapper.removeChild(this.numberInput);
    this.wrapper.classList.remove('datatype-number');

  } else if(pValueType == 'boolean') {

    this.valueWrapper.removeChild(this.booleanInput);
    this.wrapper.classList.remove('datatype-boolean');

  } else if(pValueType == 'array') {

    this.valueWrapper.removeChild(this.arrayListElement);
    this.valueWrapper.removeChild(this.arrayAddBtn);
    this.wrapper.classList.remove('datatype-array');

  } else if(pValueType == 'object') {

    this.valueWrapper.removeChild(this.objectListElement);
    this.valueWrapper.removeChild(this.objectAddBtn);
    this.wrapper.classList.remove('datatype-object');

  } else if(pValueType == 'null') {

    this.wrapper.classList.remove('datatype-null');

  } else if(pValueType == 'undefined') {

    this.wrapper.classList.remove('datatype-undefined');
  }
}

/**
 * ValueInput - insert inputs related to given data type into DOM tree
 */
ValueInput.prototype.setupValueInput = function(pValueType) {

  if(pValueType == 'string') {

    this.valueWrapper.appendChild(this.stringInput);
    this.wrapper.classList.add('datatype-string');

  } else if(pValueType == 'number') {

    this.valueWrapper.appendChild(this.numberInput);
    this.wrapper.classList.add('datatype-number');

  } else if(pValueType == 'boolean') {

    this.valueWrapper.appendChild(this.booleanInput);
    this.wrapper.classList.add('datatype-boolean');

  } else if(pValueType == 'array') {

    this.valueWrapper.appendChild(this.arrayListElement);
    this.valueWrapper.appendChild(this.arrayAddBtn);
    this.wrapper.classList.add('datatype-array');

  } else if(pValueType == 'object') {

    this.valueWrapper.appendChild(this.objectListElement);
    this.valueWrapper.appendChild(this.objectAddBtn);
    this.wrapper.classList.add('datatype-object');

  } else if(pValueType == 'null') {

    this.wrapper.classList.add('datatype-null');

  } else if(pValueType == 'undefined') {

    this.wrapper.classList.add('datatype-undefined');
  }
}

/**
 * ValueInput - add a value for the array data type
 *              creates, configure and add DOM elements
 *
 * @param {any} pValue - value to add
 */
ValueInput.prototype.addArrayValue = function(pValue) {

  var listItem = document.createElement('li');

  var arrayValueInput = new ValueInput(pValue);
  arrayValueInput.wrapper.addEventListener('change', this.updateValue.bind(this));

  var arrayRemoveBtn = document.createElement('button');
  arrayRemoveBtn.textContent = '-';
  arrayRemoveBtn.classList.add('removebtn');
  arrayRemoveBtn.addEventListener('click', this.removeArrayValue.bind(this, arrayValueInput, listItem));

  listItem.appendChild(arrayRemoveBtn);
  listItem.appendChild(arrayValueInput.wrapper);
  this.arrayListElement.appendChild(listItem);

  this.arrayValueInputs.push(arrayValueInput);

  this.updateValue();
}

/**
 * ValueInput - add a value for the object data type
 *              creates, configure and add DOM elements
 *
 * @param {any} pValue - value to add
 */
ValueInput.prototype.addObjectValue = function(pLabel, pValue) {

  var listItem = document.createElement('li');

  var objectLabelInput = document.createElement('input');
  objectLabelInput.type = 'text';
  objectLabelInput.value = pLabel;
  objectLabelInput.addEventListener('input', this.updateValue.bind(this));

  var objectValueInput = new ValueInput(pValue);
  objectValueInput.wrapper.addEventListener('change', this.updateValue.bind(this));

  var objectRemoveBtn = document.createElement('button');
  objectRemoveBtn.textContent = '-';
  objectRemoveBtn.classList.add('removebtn');
  objectRemoveBtn.addEventListener('click', this.removeObjectValue.bind(this, objectLabelInput, objectValueInput, listItem));

  listItem.appendChild(objectRemoveBtn);
  listItem.appendChild(objectLabelInput);
  listItem.appendChild(document.createTextNode(':'));
  listItem.appendChild(objectValueInput.wrapper);
  this.objectListElement.appendChild(listItem);

  this.objectLabelInputs.push(objectLabelInput);
  this.objectValueInputs.push(objectValueInput);

  this.updateValue();
}

/**
 * ValueInput - set values for array data type
 *
 * @param {array} pValues - values to set
 */
ValueInput.prototype.setArrayValues = function(pValues) {

  this.clearArrayValues();

  for(var i in pValues) {
    this.addArrayValue(pValues[i]);
  }
}

/**
 * ValueInput - set values for object data type
 *
 * @param {object} pValues - values to set with correspondings labels
 */
ValueInput.prototype.setObjectValues = function(pValues) {

  this.clearObjectValues();

  for(var i in pValues) {
    this.addObjectValue(i, pValues[i]);
  }
}

/**
 * ValueInput - remove elements related to a value for the array data type
 *
 * @param {any} pInput    - corresponding element for value input
 * @param {any} pListItem - corresponding top level wrapper element
 */
ValueInput.prototype.removeArrayValue = function(pInput, pListItem) {

  this.arrayListElement.removeChild(pListItem);

  var i = this.arrayValueInputs.indexOf(pInput);
  if(i != -1) this.arrayValueInputs.splice(i, 1);

  this.updateValue();
}

/**
 * ValueInput - remove elements related to a value for the object data type
 *
 * @param {any} pLabelInput - corresponding element for label input
 * @param {any} pValueInput - corresponding element for value input
 * @param {any} pListItem   - corresponding top level wrapper element
 */
ValueInput.prototype.removeObjectValue = function(pLabelInput, pValueInput, pListItem) {

  this.objectListElement.removeChild(pListItem);

  var i = this.objectLabelInputs.indexOf(pLabelInput);
  if(i != -1) this.objectLabelInputs.splice(i, 1);

  var i = this.objectValueInputs.indexOf(pValueInput);
  if(i != -1) this.objectValueInputs.splice(i, 1);

  this.updateValue();
}

/**
 * ValueInput - remove all elements related to all values for the array data type
 */
ValueInput.prototype.clearArrayValues = function() {

  while(this.arrayListElement.hasChildNodes()) {
    this.arrayListElement.removeChild(this.arrayListElement.lastChild);
  }
  this.arrayValueInputs = [];
}

/**
 * ValueInput - remove all elements related to all values for the object data type
 */
ValueInput.prototype.clearObjectValues = function() {

  while(this.objectListElement.hasChildNodes()) {
    this.objectListElement.removeChild(this.objectListElement.lastChild);
  }
  this.objectLabelInputs = [];
  this.objectValueInputs = [];
}

/**
 * ValueInput - set the value data type
 *
 * @param {string} pValueType - new value data type
 */
ValueInput.prototype.setValueType = function(pValueType) {

  this.valueTypeSelect.value = pValueType;
  this.onValueTypeSelectChange();
}

/**
 * ValueInput - set the value
 *
 * @param {string} pValue - new value data type
 */
ValueInput.prototype.setValue = function(pValue) {

  var valueType = null;

  if(pValue === null) {

    valueType = 'null';

  } else if(pValue === undefined) {

    valueType = 'undefined';

  } else if(typeof pValue == 'string') {

    valueType = 'string';
    this.stringInput.value = pValue;

  } else if(typeof pValue == 'number') {

    valueType = 'number';
    this.numberInput.value = pValue;

  } else if(typeof pValue == 'boolean') {

    valueType = 'boolean';
    this.booleanInput.checked = pValue;

  } else if(Array.isArray(pValue)) {

    valueType = 'array';
    this.setArrayValues(pValue);

  } else if(typeof pValue == 'object') {

    valueType = 'object';
    this.setObjectValues(pValue);
  }

  this.setValueType(valueType);
}

/**
 * ValueInput - update inner state to reflect new data value
 */
ValueInput.prototype.updateValue = function() {

  var valueType = this.valueTypeSelect.value
  var value     = undefined;

  if(valueType == 'string') {

    value = String(this.stringInput.value);

  } else if(valueType == 'number') {

    value = Number(this.numberInput.value);

  } else if(valueType == 'boolean') {

    value = Boolean(this.booleanInput.checked);

  } else if(valueType == 'array') {

    value = [];

    for(var i in this.arrayValueInputs) {
      value.push(this.arrayValueInputs[i].value);
    }

  } else if(valueType == 'object') {

    value = {};

    for(var i in this.objectValueInputs) {
      value[this.objectLabelInputs[i].value] = this.objectValueInputs[i].value;
    }

  } else if(valueType == 'null') {

    value = null;

  } else if(valueType == 'undefined') {

    value = undefined;
  }

  if(value !== this.value) {

    this.value = value;

    this.updateValueText();
    this.wrapper.dispatchEvent(this.changeEvent);
  }
}

/**
 * ValueInput - update value text label
 */
ValueInput.prototype.updateValueText = function() {

  var valueType = this.valueTypeSelect.value;
  var valueText = undefined;

  if(valueType == 'string') {

    valueText = '"' + this.stringInput.value + '"';

  } else if(valueType == 'number') {

    valueText = this.numberInput.value;

  } else if(valueType == 'boolean') {

    valueText = this.booleanInput.checked ? 'true' : 'false';

  } else if(valueType == 'array') {

    valueText = '[';

    for(var i in this.arrayValueInputs) {

      if(i != 0) {
        valueText += ', ';
      }
      valueText += this.arrayValueInputs[i].valueText;
    }

    valueText += ']';

  } else if(valueType == 'object') {

    valueText = '{';

    for(var i in this.objectValueInputs) {

      if(i != 0) {
        valueText += ', ';
      }
      valueText += '"' + this.objectLabelInputs[i].value + '": ' + this.objectValueInputs[i].valueText;
    }

    valueText += '}';

  } else if(valueType == 'null') {

    valueText = 'null';

  } else if(valueType == 'undefined') {

    valueText = 'undefined';
  }

  this.valueText = valueText;
  this.valueLabel.textContent = this.valueText;
}

/**
 * ValueInput - set Collapsed state
 *
 * @param {boolean} bCollapsed - callapsed state
 */
ValueInput.prototype.setCollapsed = function(bCollapsed) {

  if(bCollapsed == this.collapsed) {
    return;
  }

  if(bCollapsed) {

    this.innerWrapper.removeChild(this.valueTypeSelect);
    this.innerWrapper.replaceChild(this.valueLabel, this.valueWrapper);

  } else {

    this.innerWrapper.replaceChild(this.valueWrapper, this.valueLabel);
    this.innerWrapper.insertBefore(this.valueTypeSelect, this.valueWrapper);
  }

  if(bCollapsed) {
    this.wrapper.classList.add('collapsed');
  } else {
    this.wrapper.classList.remove('collapsed');
  }

  this.collapsed = bCollapsed;
}

/**
 * ValueInput - toggle Collapsed state
 */
ValueInput.prototype.toggleCollapsed = function() {

  this.setCollapsed(!this.collapsed);
}
