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
const AUTOFILLED_THEN_FIXED = 'autofilled-then-fixed';

// Global variable storing autofill statuses for each field
const autofillStatuses = {};
// Example: {
//     "name": "autofilled",
//     "street-address": "never-autofilled",
//     "country": "autofilled-then-fixed"
// }

function initializeChangeObserver(formEl) {
  const allFieldsAsArray = Array.from(formEl.querySelectorAll('input, select'));
  // Intialize autofill status for all fields
  allFieldsAsArray.forEach((fieldEl) => {
    autofillStatuses[fieldEl.id] = NEVER_AUTOFILLED;
  });
  // Add event listener to all fields to update autofill status
  allFieldsAsArray.forEach((fieldEl) => {
    fieldEl.addEventListener('change', function (event) {
      updateAutofillStatus(formEl, fieldEl);
    });
  });
}

function getAllAutofilledFields(formEl) {
  // Get all elements that are autofilled, using the :autofill pseudo-class
  return formEl.querySelectorAll(':is(:autofill)');
}

function checkIsAutofilled(formEl, fieldEl) {
  const allAutofilledElements = getAllAutofilledFields(formEl);
  // Check if the passed element is in the list of autofilled elements
  return Array.from(allAutofilledElements).includes(fieldEl);
}

function updateAutofillStatus(formEl, fieldEl) {
  const isAutofilled = checkIsAutofilled(formEl, fieldEl);
  const previousAutofillStatus = autofillStatuses[fieldEl.id];
  if (isAutofilled) {
    autofillStatuses[fieldEl.id] = AUTOFILLED;
  } else {
    if (previousAutofillStatus === NEVER_AUTOFILLED) {
      autofillStatuses[fieldEl.id] = NEVER_AUTOFILLED;
    } else if (
      previousAutofillStatus === AUTOFILLED ||
      previousAutofillStatus === AUTOFILLED_THEN_FIXED
    ) {
      autofillStatuses[fieldEl.id] = AUTOFILLED_THEN_FIXED;
    }
  }
}

// ------------------------- FORM EVENT + FORMATTER ---------------------- //

function formatAutofillStatusesAsHtml(autofillStatuses) {
  let outputAsHtml = '';
  const autofillStatusFormattedAsHtml = {
    [AUTOFILLED]: `<span class="positive">✅ Autofilled</span>`,
    [AUTOFILLED_THEN_FIXED]: `<span class="negative">🖊️ Autofilled then fixed manually</span>`,
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
