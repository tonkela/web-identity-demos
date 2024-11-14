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
const NEVER_AUTOFILLED = 'never-autofilled';
const AUTOFILLED_THEN_MODIFIED = 'autofilled-then-modified';

// Global variable storing autofill statuses for each field
const autofillStatuses = {};
// Example: {
//     "name": "autofilled",
//     "street-address": "never-autofilled",
//     "country": "autofilled-then-modified"
// }

// Update autofill status
function initializeChangeObserver(formElement) {
  const allFieldsAsArray = Array.from(
    formElement.querySelectorAll('input, select')
  );
  // Intialize autofill status for all fields
  allFieldsAsArray.forEach((fieldElement) => {
    autofillStatuses[fieldElement.id] = NEVER_AUTOFILLED;
  });
  // Add event listener to all fields to update autofill status
  allFieldsAsArray.forEach((fieldElement) => {
    fieldElement.addEventListener('change', function (event) {
      updateAutofillStatus(formElement, fieldElement);
    });
  });
}

// Get all elements that are autofilled, using the :autofill pseudo-class
function getAllAutofilledFields(formElement) {
  return formElement.querySelectorAll(':autofill');
}

// Check if the passed element is in the list of autofilled fields
function checkIsAutofilled(allAutofilledFields, fieldElement) {
  return Array.from(allAutofilledFields).includes(fieldElement);
}

function updateAutofillStatus(formElement, fieldElement) {
  const allAutofilledFields = getAllAutofilledFields(formElement);
  const isAutofilled = checkIsAutofilled(allAutofilledFields, fieldElement);
  const previousAutofillStatus = autofillStatuses[fieldElement.id];
  if (isAutofilled) {
    autofillStatuses[fieldElement.id] = AUTOFILLED;
  } else {
    if (previousAutofillStatus === NEVER_AUTOFILLED) {
      autofillStatuses[fieldElement.id] = NEVER_AUTOFILLED;
    } else if (
      previousAutofillStatus === AUTOFILLED ||
      previousAutofillStatus === AUTOFILLED_THEN_MODIFIED
    ) {
      autofillStatuses[fieldElement.id] = AUTOFILLED_THEN_MODIFIED;
    }
  }
}

// ------------------------- FORM EVENT + FORMATTER ---------------------- //

function formatAutofillStatusesAsHtml(autofillStatuses) {
  let outputAsHtml = '';
  const autofillStatusFormattedAsHtml = {
    [AUTOFILLED]: `<span class="positive">✅ Autofilled</span>`,
    [AUTOFILLED_THEN_MODIFIED]: `<span class="negative">🖊️ Autofilled then manually modified</span>`,
    [NEVER_AUTOFILLED]: `<span class="neutral">⚫️ Never autofilled</span>`,
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

initializeChangeObserver(document.getElementById('form'));

window.submitForm = submitForm;
