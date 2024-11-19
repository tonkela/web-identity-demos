// Copyright 2024 Google LLC

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

//     https://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// ----------------------------- AUTOFILL LOGIC ----------------------------- //

// Possible values for autofill statuses
const AUTOFILLED = 'autofilled';
const AUTOFILLED_THEN_MODIFIED = 'autofilled-then-modified';
const EMPTY = 'empty';
const ONLY_MANUAL = 'only-manual';

// Global variable storing autofill statuses for each field
const autofillStatuses = {};
// Example: {
//     "name": "autofilled",
//     "street-address": "autofilled-then-modified",
//     "country": "only-manual"
// }

// Collect all field elements for a given form
function getAllFieldsAsArray(formElement) {
  return Array.from(formElement.querySelectorAll('input, select'));
}

// Initialize autofill status for all fields
function initializeAutofillStatuses(formElement) {
  const allFieldsAsArray = getAllFieldsAsArray(formElement);
  allFieldsAsArray.forEach((fieldElement) => {
    autofillStatuses[fieldElement.id] = EMPTY;
  });
}

// Add event listener to all fields to update autofill status
function initializeChangeObserver(formElement) {
  const allFieldsAsArray = getAllFieldsAsArray(formElement);
  allFieldsAsArray.forEach((fieldElement) => {
    fieldElement.addEventListener('change', () => {
      updateAutofillStatus(formElement, fieldElement);
    });
  });
}

// Get all elements that are autofilled, using the :autofill pseudo-class
function getAllAutofilledFields(formElement) {
  return formElement.querySelectorAll(':autofill');
}

// Check if the element is in the list of autofilled fields
function checkIsAutofilled(allAutofilledFields, fieldElement) {
  return Array.from(allAutofilledFields).includes(fieldElement);
}

// Check if the value of the element is empty
function checkIsEmpty(fieldElement) {
  const value = fieldElement.value.trim();
  // value is a string, even for a type = number field
  const isEmpty = value === '';
  return isEmpty;
}

// Update autofill status
function updateAutofillStatus(formElement, fieldElement) {
  const isEmpty = checkIsEmpty(fieldElement);
  const allAutofilledFields = getAllAutofilledFields(formElement);
  const isAutofilled = checkIsAutofilled(allAutofilledFields, fieldElement);
  const previousAutofillStatus = autofillStatuses[fieldElement.id];
  if (isEmpty) {
    if (isAutofilled) {
      // NOTE: Emptied by autofill
      autofillStatuses[fieldElement.id] = AUTOFILLED;
    } else {
      autofillStatuses[fieldElement.id] = EMPTY;
      // NOTE: if (previousAutofillStatus === AUTOFILLED), the field has just been emptied manually
    }
  } else {
    if (isAutofilled) {
      autofillStatuses[fieldElement.id] = AUTOFILLED;
    } else {
      if (
        previousAutofillStatus === ONLY_MANUAL ||
        previousAutofillStatus === EMPTY
      ) {
        // NOTE: ONLY_MANUAL is only used for fields where autofilled was *never* used. A field where autofilled was used will be AUTOFILLED_THEN_MODIFIED, even if the user has completely retyped the whole value
        autofillStatuses[fieldElement.id] = ONLY_MANUAL;
      } else if (
        previousAutofillStatus === AUTOFILLED ||
        previousAutofillStatus === AUTOFILLED_THEN_MODIFIED
      ) {
        autofillStatuses[fieldElement.id] = AUTOFILLED_THEN_MODIFIED;
      }
    }
  }
}

// ------------------------- FORM EVENT + FORMATTER ---------------------- //

function formatAutofillStatusesAsHtml(autofillStatuses) {
  let outputAsHtml = '';
  const autofillStatusFormattedAsHtml = {
    [AUTOFILLED]: `<span class="autofilled">✅ Autofilled</span>`,
    [AUTOFILLED_THEN_MODIFIED]: `<span class="autofilled-then-modified">🖊️ Autofilled then manually modified</span>`,
    [ONLY_MANUAL]: `<span class="only-manual">🖊️ Filled only manually</span>`,
    [EMPTY]: `<span class="empty">⚫️ Empty</span>`,
  };
  Object.entries(autofillStatuses).forEach(([elId, autofillStatus]) => {
    const output = `<div class="output-wrapper"><div class="element-id">${elId}</div><div>${autofillStatusFormattedAsHtml[autofillStatus]}</div></div>`;
    outputAsHtml += output;
  });
  return outputAsHtml;
}

function submitForm(e) {
  e.preventDefault();
  // Display results of autofill status assessment
  document.getElementById('autofillInfo').innerHTML =
    formatAutofillStatusesAsHtml(autofillStatuses);
  return false;
}

// ------------------------- MAIN ---------------------- //

initializeAutofillStatuses(document.getElementById('form'));
initializeChangeObserver(document.getElementById('form'));

window.submitForm = submitForm;
