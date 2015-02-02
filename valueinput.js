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
 *       span.valuelabel
 *
 *   Not Collapsed :
 *
 *   span.valueinput.datatype-*
 *     span.innerwrapper
 *       button.collapsebtn
 *       select.datatypeselector
 *       span.valuewrapper
 *
 *   Value wrapper for type object :
 *
 *   span.valuewrapper
 *     ul.valuelist
 *       li.valuelistitem.datatype-*
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
  this.previousDataType  = undefined;
  this.valueInitialized  = false;
  this.collapsed         = true;

  this.initDOM();

  this.setDataTypes(dataTypes);
  this.setValue(initialValue);
  this.setCollapsed(initialCollapse);
}

/**
 * ValueInput - init DOM elements
 */
ValueInput.prototype.initDOM = function() {

  this.wrapper = document.createElement('span');
  this.setDefaultClass();

  this.innerWrapper = document.createElement('span');
  this.innerWrapper.classList.add('innerwrapper');

  this.collapseBtn = document.createElement('button');
  this.collapseBtn.textContent = '';
  this.collapseBtn.classList.add('collapsebtn');

  this.dataTypeSelectElement = document.createElement('select');
  this.dataTypeSelectElement.classList.add('datatypeselector');

  this.valueWrapper = document.createElement('span');
  this.valueWrapper.classList.add('valuewrapper');

  this.valueLabel = document.createElement('span');
  this.valueLabel.classList.add('valuelabel');

  this.initValueInputs();

  this.initEvents();

  this.buildDOMTree();
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
  this.arrayListElement.classList.add('valuelist');
  this.objectListElement = document.createElement('ul');
  this.objectListElement.classList.add('valuelist');

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

  this.dataTypeSelectElement.addEventListener('change', this.onDataTypeSelectElementChange.bind(this));

  this.stringInput.addEventListener('input', this.updateValue.bind(this));
  this.numberInput.addEventListener('input', this.updateValue.bind(this));
  this.booleanInput.addEventListener('change', this.updateValue.bind(this));

  this.arrayAddBtn.addEventListener('click', this.addArrayValue.bind(this, null));
  this.objectAddBtn.addEventListener('click', this.addObjectValue.bind(this, null, null));

  this.changeEvent = new Event('valuechange'); // this event is sent to inform listeners that the value has changed
}

/**
 * ValueInput - assembles main DOM elements
 *              in collapsed mode
 */
ValueInput.prototype.buildDOMTree = function() {

  this.wrapper.appendChild(this.innerWrapper);
  this.innerWrapper.appendChild(this.collapseBtn);
  this.innerWrapper.appendChild(this.valueLabel);
}

/**
 * ValueInput - set class on top level element
 */
ValueInput.prototype.setDefaultClass = function() {

  this.wrapper.classList.add('valueinput');
}

/**
 * ValueInput - set datatype class on top level element
 *
 * @param {Element} pElement  - DOM element to apply class to - defaults to top level element
 * @param {string}  pDataType - data type identifier          - defaults to current data type
 */
ValueInput.prototype.setDataTypeClass = function(pElement, pDataType) {

  pElement  = pElement  || this.wrapper;
  pDataType = pDataType || this.dataTypeSelectElement.value;

  for(var i=0 ; i<pElement.classList.length ; ) {

    if(pElement.classList.item(i).match(/^datatype\-(string|number|boolean|array|object|null|undefined)$/)) {
      pElement.classList.remove(pElement.classList.item(i));
    } else {
      i++;
    }
  }
  pElement.classList.add('datatype-' + pDataType);
}

/**
 * ValueInput - prepare data types definition objects
 */
ValueInput.prototype.prepareDataTypes = function(pDataTypes) {

  var dataTypes       = [];
  var arrayDataTypes  = {};
  var objectDataTypes = {};

  var types = ['string', 'number', 'boolean', 'array', 'object', 'null', 'undefined'];

  var allmissing = true;
  for(var i=0, l=types.length ; i<l ; i++) {
    if(types[i] in pDataTypes) {
      allmissing = false;
      break;
    }
  }
  for(var i=0, l=types.length ; i<l ; i++) {
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
 * ValueInput - return data type identifier for given value
 *
 * @param {any} pValue - value to get the data type of
 */
ValueInput.prototype.getDataType = function(pValue) {

  var dataType = undefined;

  if(pValue === null) {

    dataType = 'null';

  } else if(pValue === undefined) {

    dataType = 'undefined';

  } else if(typeof pValue == 'string') {

    dataType = 'string';

  } else if(typeof pValue == 'number') {

    dataType = 'number';

  } else if(typeof pValue == 'boolean') {

    dataType = 'boolean';

  } else if(Array.isArray(pValue)) {

    dataType = 'array';

  } else if(typeof pValue == 'object') {

    dataType = 'object';
  }

  return dataType;
}

/**
 * ValueInput - remove input elements related to given data type from DOM tree
 */
ValueInput.prototype.unsetValueInput = function(pDataType) {

  if(pDataType == 'string') {

    this.valueWrapper.removeChild(this.stringInput);

  } else if(pDataType == 'number') {

    this.valueWrapper.removeChild(this.numberInput);

  } else if(pDataType == 'boolean') {

    this.valueWrapper.removeChild(this.booleanInput);

  } else if(pDataType == 'array') {

    this.valueWrapper.removeChild(this.arrayListElement);
    this.valueWrapper.removeChild(this.arrayAddBtn);

  } else if(pDataType == 'object') {

    this.valueWrapper.removeChild(this.objectListElement);
    this.valueWrapper.removeChild(this.objectAddBtn);

  } else if(pDataType == 'null') {

  } else if(pDataType == 'undefined') {
  }
}

/**
 * ValueInput - insert input elements related to given data type into DOM tree
 */
ValueInput.prototype.setupValueInput = function(pDataType) {

  if(pDataType == 'string') {

    this.valueWrapper.appendChild(this.stringInput);

  } else if(pDataType == 'number') {

    this.valueWrapper.appendChild(this.numberInput);

  } else if(pDataType == 'boolean') {

    this.valueWrapper.appendChild(this.booleanInput);

  } else if(pDataType == 'array') {

    this.valueWrapper.appendChild(this.arrayListElement);
    this.valueWrapper.appendChild(this.arrayAddBtn);

  } else if(pDataType == 'object') {

    this.valueWrapper.appendChild(this.objectListElement);
    this.valueWrapper.appendChild(this.objectAddBtn);

  } else if(pDataType == 'null') {

  } else if(pDataType == 'undefined') {
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
  listItem.classList.add('valuelistitem');

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
  listItem.classList.add('valuelistitem');

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

  for(var i=0, l=pValues.length ; i<l ; i++) {
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
 * ValueInput - remove all elements related to all sub-values for the array data type
 */
ValueInput.prototype.clearArrayValues = function() {

  while(this.arrayListElement.hasChildNodes()) {
    this.arrayListElement.removeChild(this.arrayListElement.firstChild);
  }
  this.arrayValueInputs = [];
}

/**
 * ValueInput - remove all elements related to all sub-values for the object data type
 */
ValueInput.prototype.clearObjectValues = function() {

  while(this.objectListElement.hasChildNodes()) {
    this.objectListElement.removeChild(this.objectListElement.firstChild);
  }
  this.objectLabelInputs = [];
  this.objectValueInputs = [];
}

/**
 * ValueInput - update `value` property
 */
ValueInput.prototype.updateValue = function() {

  var dataType = this.dataTypeSelectElement.value;
  var value    = undefined;

  if(dataType == 'string') {

    value = String(this.stringInput.value);

  } else if(dataType == 'number') {

    value = Number(this.numberInput.value);

  } else if(dataType == 'boolean') {

    value = Boolean(this.booleanInput.checked);

  } else if(dataType == 'array') {

    value = [];

    for(var i=0, l=this.arrayValueInputs.length ; i<l ; i++) {
      value.push(this.arrayValueInputs[i].value);
    }

  } else if(dataType == 'object') {

    value = {};

    for(var i=0, l=this.objectValueInputs.length ; i<l ; i++) {
      value[this.objectLabelInputs[i].value] = this.objectValueInputs[i].value;
    }

  } else if(dataType == 'null') {

    value = null;

  } else if(dataType == 'undefined') {

    value = undefined;
  }

  if(value !== this.value || !this.valueInitialized) {

    var previousValue = this.value;
    this.value = value;
    this.updateValueText();

    this.valueInitialized = true;

    this.dispatchChangeEvent(previousValue, this.value);
  }
}

/**
 * ValueInput - update value text label
 */
ValueInput.prototype.updateValueText = function() {

  var dataType  = this.dataTypeSelectElement.value;
  var valueText = undefined;

  if(dataType == 'string') {

    valueText = '"' + this.stringInput.value + '"';

  } else if(dataType == 'number') {

    valueText = this.numberInput.value;

  } else if(dataType == 'boolean') {

    valueText = this.booleanInput.checked ? 'true' : 'false';

  } else if(dataType == 'array') {

    valueText = '[';

    for(var i=0, l=this.arrayValueInputs.length ; i<l ; i++) {

      if(i != 0) {
        valueText += ', ';
      }
      valueText += this.arrayValueInputs[i].valueText;
    }

    valueText += ']';

  } else if(dataType == 'object') {

    valueText = '{';

    for(var i=0, l=this.objectValueInputs.length ; i<l ; i++) {

      if(i != 0) {
        valueText += ', ';
      }
      valueText += '"' + this.objectLabelInputs[i].value + '": ' + this.objectValueInputs[i].valueText;
    }

    valueText += '}';

  } else if(dataType == 'null') {

    valueText = 'null';

  } else if(dataType == 'undefined') {

    valueText = 'undefined';
  }

  this.valueText = valueText;
  this.valueLabel.textContent = this.valueText;
}

/**
 * ValueInput - force value update
 *              dispatch event indicating that the input's value has changed
 */
ValueInput.prototype.forceUpdate = function() {

  this.dispatchChangeEvent(this.value, this.value);
}

/**
 * ValueInput - dispatch event indicating that the input's value has changed
 *
 * @param {any} pOldValue - old input's value
 * @param {any} pNewValue - new input's value
 */
ValueInput.prototype.dispatchChangeEvent = function(pOldValue, pNewValue) {

  this.changeEvent.oldValue = pOldValue;
  this.changeEvent.newValue = pNewValue;
  this.wrapper.dispatchEvent(this.changeEvent);
}

/**
 * ValueInput - process the change of the selected data type
 *
 * @param {Event} pEvent - SELECT element's `change` event
 */
ValueInput.prototype.onDataTypeSelectElementChange = function(pEvent) {

  var newDataType = this.dataTypeSelectElement.value;

  this.unsetValueInput(this.previousDataType);
  this.setupValueInput(newDataType);

  this.setDataTypeClass();
  this.updateValue();

  this.previousDataType = newDataType;
}

/**
 * ValueInput - process the change of a sub-value for the array data type
 *
 * @param {any}   pListItem - top level wrapper element associated with the changed value
 * @param {Event} pEvent    - 'valuechange' event
 */
ValueInput.prototype.onArrayValueChanged = function(pListItem, pEvent) {

  var oldValueType = this.getDataType(pEvent.oldValue);
  var newDataType = this.getDataType(pEvent.newValue);

  this.setDataTypeClass(pListItem, newDataType);
}

/**
 * ValueInput - process the change of a sub-value for the object data type
 *
 * @param {any}   pListItem - top level wrapper element associated with the changed value
 * @param {Event} pEvent    - 'valuechange' event
 */
ValueInput.prototype.onObjectValueChanged = function(pListItem, pEvent) {

  var oldValueType = this.getDataType(pEvent.oldValue);
  var newDataType = this.getDataType(pEvent.newValue);

  this.setDataTypeClass(pListItem, newDataType);
}

/**
 * ValueInput - replace given element by current value input
 *              keep element's classes and id
 *
 * @param {DOMElement} pElement - element to replace
 */
ValueInput.prototype.replaceElement = function(pElement) {

  if(pElement) {
    pElement.parentNode.replaceChild(this.wrapper, pElement);

    while(this.wrapper.classList.length) {
      this.wrapper.classList.remove(this.wrapper.classList.item(0));
    }
    for(var i=0 ; i<pElement.classList.length ; i++) {
      this.wrapper.classList.add(pElement.classList.item(i));
    }
    this.setDefaultClass();
    this.setDataTypeClass();

    this.wrapper.id = null;
    if(pElement.id) {
      this.wrapper.id = pElement.id;
    }
  }
}

/**
 * ValueInput - set collapsed state
 *
 * @param {boolean} bCollapsed - callapsed state
 */
ValueInput.prototype.setCollapsed = function(bCollapsed) {

  bCollapsed = Boolean(bCollapsed);

  if(bCollapsed == this.collapsed) {
    return;
  }

  if(bCollapsed) {

    this.innerWrapper.removeChild(this.dataTypeSelectElement);
    this.innerWrapper.removeChild(this.valueWrapper);

    this.innerWrapper.appendChild(this.valueLabel);

  } else {

    this.innerWrapper.removeChild(this.valueLabel);

    this.innerWrapper.appendChild(this.dataTypeSelectElement);
    this.innerWrapper.appendChild(this.valueWrapper);
  }

  this.wrapper.classList.toggle('collapsed', bCollapsed);

  this.collapsed = bCollapsed;
}

/**
 * ValueInput - toggle collapsed state
 */
ValueInput.prototype.toggleCollapsed = function() {

  this.setCollapsed(!this.collapsed);
}

/**
 * ValueInput - set allowed data types
 *
 * @param {string} pDataTypes - allowed datatypes (same value as in constructor)
 */
ValueInput.prototype.setDataTypes = function(pDataTypes) {

  this.prepareDataTypes(pDataTypes);

  var dataType = this.dataTypeSelectElement.value;

  while(this.dataTypeSelectElement.hasChildNodes()) {
    this.dataTypeSelectElement.removeChild(this.dataTypeSelectElement.firstChild);
  }

  var types = this.dataTypes;
  for(var i=0, l=types.length ; i<l ; i++) {

    var optElement = document.createElement('option');
    optElement.value = types[i];
    optElement.label = types[i];
    this.dataTypeSelectElement.add(optElement);
  }

  this.setDataType(this.dataTypes.indexOf(dataType) != -1 ? dataType : this.dataTypes[0]);

  for(var i=0, l=this.arrayValueInputs.length ; i<l ; i++) {
    this.arrayValueInputs[i].setDataTypes(this.arrayDataTypes);
  }
  for(var i=0, l=this.objectValueInputs.length ; i<l ; i++) {
    this.objectValueInputs[i].setDataTypes(this.objectDataTypes);
  }
}

/**
 * ValueInput - set the input's active data type
 *
 * @param {string} pDataType - new data type
 */
ValueInput.prototype.setDataType = function(pDataType) {

  if(this.dataTypes.indexOf(pDataType) != -1) {

    this.dataTypeSelectElement.value = pDataType;
    this.onDataTypeSelectElementChange();
  }
}

/**
 * ValueInput - set the input's value
 *
 * @param {string} pValue - new value
 */
ValueInput.prototype.setValue = function(pValue) {

  var dataType = this.getDataType(pValue);

  if(dataType == 'string') {

    this.stringInput.value = pValue;

  } else if(dataType == 'number') {

    this.numberInput.value = pValue;

  } else if(dataType == 'boolean') {

    this.booleanInput.checked = pValue;

  } else if(dataType == 'array') {

    this.setArrayValues(pValue);

  } else if(dataType == 'object') {

    this.setObjectValues(pValue);
  }

  this.setDataType(dataType);
}
