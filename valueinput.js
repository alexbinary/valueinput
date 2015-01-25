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
 *   span.valueinput.collapsed.datatype-*
 *     span.innerwrapper
 *       button.collapsebtn
 *       span
 *
 *   Not Collapsed :
 *
 *   span.valueinput.datatype-*
 *     span.innerwrapper
 *       button.collapsebtn
 *       select
 *       span.valuewrapper
 *
 *   Value wrapper for type object :
 *
 *   span.valuewrapper
 *     ul
 *       li.datatype-*
 *         span.labelwrapper
 *            button.removebtn
 *            input
 *            text ":"
 *         span.valueinput
 *     button.addbtn
 */

"use strict";

/**
 * ValueInput
 *
 * constructor
 *
 * @param {dictionary} pParams - parameters, see below
 *
 * pParams: value    : {any}        - initial value of the input, defaults to `undefined`
 *          collapsed: {boolean}    - initial collapsed state,    defaults to `true`
 *          datatypes: {dictionary} - allowed datatypes, see below
 *
 * datatypes: keys must be 'string', 'number', 'boolean', 'array', 'object', 'null', or 'undefined'
 *            values will be evaluated as boolean, truthy value means datatype is allowed
 *            values for keys 'array' and 'object' can be a dictionary with this same structure (recursive definition)
 *            value `true` for keys 'array' and 'object' means all datatypes are accepted
 *            if none of the possible keys are present, all are allowed
 */
function ValueInput(pParams) {

  var initialValue    = undefined;
  var initialCollapse =      true;
  var dataTypes       =        {};

  if(typeof pParams == 'object') {
    if('value' in pParams) {
      initialValue = pParams['value'];
    }
    if('collapsed' in pParams) {
      initialCollapse = pParams['collapsed'];
    }
    if('datatypes' in pParams) {
      dataTypes = pParams['datatypes'];
    }
  }

  this.dataTypes         = undefined;
  this.arrayDataTypes    = undefined;
  this.objectDataTypes   = undefined;
  this.value             = undefined;
  this.valueText         = undefined;
  this.collapsed         = undefined;
  this.previousValueType = undefined;
  this.valueInitialized  = false;

  this.prepareDataTypes(dataTypes);
  this.initDOM();

  this.setValue(initialValue);
  this.setCollapsed(initialCollapse);
}

/**
 * ValueInput - prepare data types definition object
 */
ValueInput.prototype.prepareDataTypes = function(pDataTypes) {

  var dataTypes       = [];
  var arrayDataTypes  = {};
  var objectDataTypes = {};

  var types = ['string', 'number', 'boolean', 'array', 'object', 'null', 'undefined'];

  var allmissing = true;
  for(var i in types) {
    if(types[i] in pDataTypes) {
      allmissing = false;
      break;
    }
  }
  for(var i in types) {
    if((types[i] in pDataTypes && pDataTypes[types[i]]) || allmissing) {
      dataTypes.push(types[i]);
    }
  }

  if('array' in pDataTypes) {
    if(typeof pDataTypes['array'] == 'object' && pDataTypes['array']) {
      arrayDataTypes = pDataTypes['array'];
    }
  }
  if('object' in pDataTypes) {
    if(typeof pDataTypes['object'] == 'object' && pDataTypes['object']) {
      arrayDataTypes = pDataTypes['object'];
    }
  }

  this.dataTypes       = dataTypes;
  this.arrayDataTypes  = arrayDataTypes;
  this.objectDataTypes = objectDataTypes;
}

/**
 * ValueInput - init DOM elements
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

  var types = this.dataTypes;
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

  this.valueTypeSelect.addEventListener('change', this.onValueTypeSelectChange.bind(this));

  this.stringInput.addEventListener('input', this.updateValue.bind(this));
  this.numberInput.addEventListener('input', this.updateValue.bind(this));
  this.booleanInput.addEventListener('change', this.updateValue.bind(this));

  this.arrayAddBtn.addEventListener('click', this.addArrayValue.bind(this, null));
  this.objectAddBtn.addEventListener('click', this.addObjectValue.bind(this, null, null));

  this.changeEvent = new Event('valuechange'); // this event is sent to inform listeners that the value has changed
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
 * ValueInput - remove input elements related to given data type from DOM tree
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
 * ValueInput - insert input elements related to given data type into DOM tree
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
 *              create, configure and add DOM elements
 *
 * @param {any} pValue - value to add
 */
ValueInput.prototype.addArrayValue = function(pValue) {

  var listItem = document.createElement('li');

  var labelWrapper = document.createElement('span');
  labelWrapper.classList.add('labelwrapper');

  var arrayValueInput = new ValueInput({value: pValue, collapsed: false, datatypes:this.arrayDataTypes});
  arrayValueInput.wrapper.addEventListener('valuechange', this.onArrayValueChanged.bind(this, listItem));
  arrayValueInput.wrapper.addEventListener('valuechange', this.updateValue.bind(this));

  var arrayRemoveBtn = document.createElement('button');
  arrayRemoveBtn.textContent = '-';
  arrayRemoveBtn.classList.add('removebtn');
  arrayRemoveBtn.addEventListener('click', this.removeArrayValue.bind(this, arrayValueInput, listItem));

  labelWrapper.appendChild(arrayRemoveBtn);
  listItem.appendChild(labelWrapper);
  listItem.appendChild(arrayValueInput.wrapper);
  this.arrayListElement.appendChild(listItem);

  this.arrayValueInputs.push(arrayValueInput);

  arrayValueInput.forceUpdate();
}

/**
 * ValueInput - add a value for the object data type
 *              create, configure and add DOM elements
 *
 * @param {any} pValue - value to add
 */
ValueInput.prototype.addObjectValue = function(pLabel, pValue) {

  var listItem = document.createElement('li');

  var labelWrapper = document.createElement('span');
  labelWrapper.classList.add('labelwrapper');

  var objectLabelInput = document.createElement('input');
  objectLabelInput.type = 'text';
  objectLabelInput.value = pLabel;
  objectLabelInput.addEventListener('input', this.updateValue.bind(this));

  var objectValueInput = new ValueInput({value: pValue, collapsed: false, datatypes:this.objectDataTypes});
  objectValueInput.wrapper.addEventListener('valuechange', this.onObjectValueChanged.bind(this, listItem));
  objectValueInput.wrapper.addEventListener('valuechange', this.updateValue.bind(this));

  var objectRemoveBtn = document.createElement('button');
  objectRemoveBtn.textContent = '-';
  objectRemoveBtn.classList.add('removebtn');
  objectRemoveBtn.addEventListener('click', this.removeObjectValue.bind(this, objectLabelInput, objectValueInput, listItem));

  labelWrapper.appendChild(objectRemoveBtn);
  labelWrapper.appendChild(objectLabelInput);
  labelWrapper.appendChild(document.createTextNode(':'));
  listItem.appendChild(labelWrapper);
  listItem.appendChild(objectValueInput.wrapper);
  this.objectListElement.appendChild(listItem);

  this.objectLabelInputs.push(objectLabelInput);
  this.objectValueInputs.push(objectValueInput);

  objectValueInput.forceUpdate();
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
 * ValueInput - process the change of an array value
 *
 * @param {any}   pListItem - top level wrapper element associated with the changed value
 * @param {Event} pEvent    - 'valuechange' event
 */
ValueInput.prototype.onArrayValueChanged = function(pListItem, pEvent) {

  var oldValueType = this.getValueType(pEvent.oldValue);
  var newValueType = this.getValueType(pEvent.newValue);

  pListItem.classList.remove('datatype-' + oldValueType);
  pListItem.classList.add('datatype-' + newValueType);
}

/**
 * ValueInput - process the change of an object value
 *
 * @param {any}   pListItem - top level wrapper element associated with the changed value
 * @param {Event} pEvent    - 'valuechange' event
 */
ValueInput.prototype.onObjectValueChanged = function(pListItem, pEvent) {

  var oldValueType = this.getValueType(pEvent.oldValue);
  var newValueType = this.getValueType(pEvent.newValue);

  pListItem.classList.remove('datatype-' + oldValueType);
  pListItem.classList.add('datatype-' + newValueType);
}

/**
 * ValueInput - set allowed data types
 *
 * @param {string} pDataTypes - allowed datatypes (same value as in constructor)
 */
ValueInput.prototype.setDataTypes = function(pDataTypes) {

  this.prepareDataTypes(pDataTypes);

  var valueTypeSelect = this.valueTypeSelect;
  var dataType        = this.valueTypeSelect.value;

  this.initValueTypeSelect();

  if(valueTypeSelect.parentNode) {
    this.innerWrapper.replaceChild(this.valueTypeSelect, valueTypeSelect);
  }

  this.setValueType(this.dataTypes.indexOf(dataType) != -1 ? dataType : this.dataTypes[0]);

  for(var i in this.arrayValueInputs) {
    this.arrayValueInputs[i].setDataTypes(this.arrayDataTypes);
  }
  for(var i in this.objectValueInputs) {
    this.objectValueInputs[i].setDataTypes(this.objectDataTypes);
  }
}

/**
 * ValueInput - set the value data type
 *
 * @param {string} pValueType - new value data type
 */
ValueInput.prototype.setValueType = function(pValueType) {

  if(this.dataTypes.indexOf(pValueType) != -1) {

    this.valueTypeSelect.value = pValueType;
    this.onValueTypeSelectChange();
  }
}

/**
 * ValueInput - set the value
 *
 * @param {string} pValue - new value data type
 */
ValueInput.prototype.setValue = function(pValue) {

  var valueType = this.getValueType(pValue);

  if(valueType == 'string') {

    this.stringInput.value = pValue;

  } else if(valueType == 'number') {

    this.numberInput.value = pValue;

  } else if(valueType == 'boolean') {

    this.booleanInput.checked = pValue;

  } else if(valueType == 'array') {

    this.setArrayValues(pValue);

  } else if(valueType == 'object') {

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

  if(value !== this.value || !this.valueInitialized) {

    var previousValue = this.value;
    this.value = value;
    this.updateValueText();

    this.valueInitialized = true;

    this.changeEvent.oldValue = previousValue;
    this.changeEvent.newValue = this.value;
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
 * ValueInput - force value update
 *              send `valuechange` event even if not needed
 */
ValueInput.prototype.forceUpdate = function() {

  this.changeEvent.oldValue = this.value;
  this.changeEvent.newValue = this.value;
  this.wrapper.dispatchEvent(this.changeEvent);
}

/**
 * ValueInput - set Collapsed state
 *
 * @param {boolean} bCollapsed - callapsed state
 */
ValueInput.prototype.setCollapsed = function(bCollapsed) {

  bCollapsed = Boolean(bCollapsed);

  if(bCollapsed == this.collapsed) {
    return;
  }

  if(bCollapsed) {

    this.innerWrapper.removeChild(this.valueTypeSelect);

    if(this.valueWrapper.parentNode) {
      this.innerWrapper.replaceChild(this.valueLabel, this.valueWrapper);
    } else {
      this.innerWrapper.appendChild(this.valueLabel);
    }

  } else {

    if(this.valueLabel.parentNode) {
      this.innerWrapper.replaceChild(this.valueWrapper, this.valueLabel);
    } else {
      this.innerWrapper.appendChild(this.valueWrapper);
    }
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

/**
 * ValueInput - return value type identifier for given value
 *
 * @param {any} pValue - value to get the value type of
 */
ValueInput.prototype.getValueType = function(pValue) {

  var valueType = undefined;

  if(pValue === null) {

    valueType = 'null';

  } else if(pValue === undefined) {

    valueType = 'undefined';

  } else if(typeof pValue == 'string') {

    valueType = 'string';

  } else if(typeof pValue == 'number') {

    valueType = 'number';

  } else if(typeof pValue == 'boolean') {

    valueType = 'boolean';

  } else if(Array.isArray(pValue)) {

    valueType = 'array';

  } else if(typeof pValue == 'object') {

    valueType = 'object';
  }

  return valueType;
}

/**
 * ValueInput - replace given element by current value input
 *              keep element's classes and id
 *
 * @param {DOMElement} pElement - element to replace
 */
ValueInput.prototype.replace = function(pElement) {

  if(pElement) {
    pElement.parentNode.replaceChild(this.wrapper, pElement);

    for(var i=0 ; i<pElement.classList.length ; i++) {
      this.wrapper.classList.add(pElement.classList.item(i));
    }

    if(pElement.id) {
      this.wrapper.id = pElement.id;
    }
  }
}
