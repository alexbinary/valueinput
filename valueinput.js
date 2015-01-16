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
 */
function ValueInput(pValue) {

  this.wrapper = document.createElement('span');
  this.wrapper.classList.add('valueinput');

  this.innerWrapper = document.createElement('span');
  this.innerWrapper.classList.add('innerwrapper');

  this.valueTypeSelect = document.createElement('select');
  var optElement = document.createElement('option');
  optElement.value = 'string';
  optElement.label = 'string';
  this.valueTypeSelect.add(optElement);
  var optElement = document.createElement('option');
  optElement.value = 'number';
  optElement.label = 'number';
  this.valueTypeSelect.add(optElement);
  var optElement = document.createElement('option');
  optElement.value = 'boolean';
  optElement.label = 'boolean';
  this.valueTypeSelect.add(optElement);
  var optElement = document.createElement('option');
  optElement.value = 'array';
  optElement.label = 'array';
  this.valueTypeSelect.add(optElement);
  var optElement = document.createElement('option');
  optElement.value = 'object';
  optElement.label = 'object';
  this.valueTypeSelect.add(optElement);
  var optElement = document.createElement('option');
  optElement.value = 'null';
  optElement.label = 'null';
  this.valueTypeSelect.add(optElement);
  var optElement = document.createElement('option');
  optElement.value = 'undefined';
  optElement.label = 'undefined';
  this.valueTypeSelect.add(optElement);

  this.valueWrapper = document.createElement('span');
  this.valueWrapper.classList.add('valuewrapper');

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
  this.arrayAddBtn.classList.add('addbtn');

  this.objectAddBtn = document.createElement('button');
  this.objectAddBtn.textContent = '+';
  this.objectAddBtn.classList.add('addbtn');

  this.collapseBtn = document.createElement('button');
  this.collapseBtn.textContent = '';
  this.collapseBtn.classList.add('collapsebtn');

  this.value = undefined;
  this.valueText = undefined;
  this.collapsed = false;
  this.previousValueType = null;

  this.wrapper.appendChild(this.innerWrapper);
  this.innerWrapper.appendChild(this.collapseBtn);
  this.innerWrapper.appendChild(this.valueTypeSelect);
  this.innerWrapper.appendChild(this.valueWrapper);

  // this.wrapper.addEventListener('mouseover', this.setCollapsed.bind(this, false));
  // this.wrapper.addEventListener('mouseout', this.setCollapsed.bind(this, true));
  // this.valueLabel.addEventListener('click', this.setCollapsed.bind(this, false));
  // this.wrapper.addEventListener('click', this.setCollapsed.bind(this, true));

  this.valueTypeSelect.addEventListener('change', this.onValueTypeSelectChange.bind(this));

  this.stringInput.addEventListener('input', this.updateValue.bind(this));
  this.numberInput.addEventListener('input', this.updateValue.bind(this));
  this.booleanInput.addEventListener('change', this.updateValue.bind(this));

  this.arrayAddBtn.addEventListener('click', this.addArrayValue.bind(this));
  this.objectAddBtn.addEventListener('click', this.addObjectValue.bind(this));

  this.collapseBtn.addEventListener('click', this.toggleCollapsed.bind(this));

  this.changeEvent = new Event('change');

  this.setValue(pValue);
  this.setCollapsed(true);
}

ValueInput.prototype.onValueTypeSelectChange = function(pEvent) {

  console.log('onSelectChange');

  var pNewValueType = this.valueTypeSelect.value;

  this.unsetValueInput(this.previousValueType);
  this.setupValueInput(pNewValueType);

  this.updateValue();

  this.previousValueType = pNewValueType;
}

ValueInput.prototype.unsetValueInput = function(pChoice) {

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

ValueInput.prototype.setupValueInput = function(pChoice) {

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

ValueInput.prototype.addArrayValue = function(pValue) {

  var listItem = document.createElement('li');

  var arrayValueInput = new ValueInput(pValue);
  arrayValueInput.wrapper.addEventListener('change', this.updateValue.bind(this));

  var arrayRemoveBtn = document.createElement('button');
  arrayRemoveBtn.textContent = '-';
  arrayRemoveBtn.classList.add('removebtn');
  arrayRemoveBtn.addEventListener('click', this.removeArrayValue.bind(this, arrayValueInput, listItem));

  this.arrayValueInputs.push(arrayValueInput);

  listItem.appendChild(arrayRemoveBtn);
  listItem.appendChild(arrayValueInput.wrapper);
  this.arrayListElement.appendChild(listItem);

  this.updateValue();
}

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

  this.objectLabelInputs.push(objectLabelInput);
  this.objectValueInputs.push(objectValueInput);

  listItem.appendChild(objectRemoveBtn);
  listItem.appendChild(objectLabelInput);
  listItem.appendChild(document.createTextNode(':'));
  listItem.appendChild(objectValueInput.wrapper);
  this.objectListElement.appendChild(listItem);

  this.updateValue();
}

ValueInput.prototype.removeArrayValue = function(pInput, pListItem) {

  var i = this.arrayValueInputs.indexOf(pInput);
  if(i != -1) this.arrayValueInputs.splice(i, 1);

  this.arrayListElement.removeChild(pListItem);

  this.updateValue();
}

ValueInput.prototype.removeObjectValue = function(pLabelInput, pValueInput, pListItem) {

  var i = this.objectLabelInputs.indexOf(pLabelInput);
  if(i != -1) this.objectLabelInputs.splice(i, 1);

  var i = this.objectValueInputs.indexOf(pValueInput);
  if(i != -1) this.objectValueInputs.splice(i, 1);

  this.objectListElement.removeChild(pListItem);

  this.updateValue();
}

ValueInput.prototype.updateValue = function() {

  // compute new value

  var newValue = undefined;

  if(this.valueTypeSelect.value == 'string') {

    newValue = String(this.stringInput.value);

  } else if(this.valueTypeSelect.value == 'number') {

    newValue = Number(this.numberInput.value);

  } else if(this.valueTypeSelect.value == 'boolean') {

    newValue = Boolean(this.booleanInput.checked);

  } else if(this.valueTypeSelect.value == 'array') {

    newValue = new Array();

    for(var i in this.arrayValueInputs) {
      newValue.push(this.arrayValueInputs[i].value);
    }

  } else if(this.valueTypeSelect.value == 'object') {

    newValue = new Object();

    for(var i in this.objectValueInputs) {
      newValue[this.objectLabelInputs[i].value] = this.objectValueInputs[i].value;
    }

  } else if(this.valueTypeSelect.value == 'null') {

    newValue = null;

  } else if(this.valueTypeSelect.value == 'undefined') {

    newValue = undefined;
  }

  // if value has changed, update value and valueText

  if(newValue !== this.value) {

    this.value = newValue;

    var newValueText = undefined;

    if(this.valueTypeSelect.value == 'string') {

      newValueText = '"' + this.stringInput.value + '"';

    } else if(this.valueTypeSelect.value == 'number') {

      newValueText = this.numberInput.value;

    } else if(this.valueTypeSelect.value == 'boolean') {

      newValueText = this.booleanInput.checked ? 'true' : 'false';

    } else if(this.valueTypeSelect.value == 'array') {

      newValueText = '[';

      for(i in this.arrayValueInputs) {

        if(i != 0) {
          newValueText += ', ';
        }
        newValueText += this.arrayValueInputs[i].valueText;
      }

      newValueText += ']';

    } else if(this.valueTypeSelect.value == 'object') {

      newValueText = '{';

      for(i in this.objectValueInputs) {

        if(i != 0) {
          newValueText += ', ';
        }
        newValueText += '"' + this.objectLabelInputs[i].value + '": ' + this.objectValueInputs[i].valueText;
      }

      newValueText += '}';

    } else if(this.valueTypeSelect.value == 'null') {

      newValueText = 'null';

    } else if(this.valueTypeSelect.value == 'undefined') {

      newValueText = 'undefined';
    }

    this.valueText = newValueText;
    this.valueLabel.textContent = this.valueText;

    this.wrapper.dispatchEvent(this.changeEvent);
  }
}

ValueInput.prototype.setValueType = function(pNewValueType) {

  this.valueTypeSelect.value = pNewValueType;
  this.onValueTypeSelectChange();
}

ValueInput.prototype.setValue = function(pValue) {

  // value     typeof
  //
  // string    string
  // number    number
  // boolean   boolean
  // array     object
  // object    object
  // null      object
  // undefined undefined

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

    while(this.arrayListElement.hasChildNodes()) {
      this.arrayListElement.removeChild(this.arrayListElement.lastChild);
    }
    this.arrayValueInputs = [];

    for(var i in pValue) {
      this.addArrayValue(pValue[i]);
    }

  } else if(typeof pValue == 'object') {

    valueType = 'object';

    for(var i in pValue) {
      this.addObjectValue(i, pValue[i]);
    }
  }

  this.setValueType(valueType);
}

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

ValueInput.prototype.toggleCollapsed = function() {

  this.setCollapsed(!this.collapsed);
}
