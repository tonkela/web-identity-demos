# Autofill observer demo 🔎

This demo showcases how you can programmatically determine whether a user has used browser autofill to fill form fields, or whether the user has manually filled the field.

<p align="center">
  <img src="https://github.com/user-attachments/assets/6deaeb1b-ff65-4537-ad5c-5fdb56f856fd" width="400"/>
</p>

## Try it

[Public live demo](https://chrome.dev/web-identity-demos/autofill-observer-demo/address.html)

## Why this demo?

Using the code in this demo, you can **measure autofill success** on your site by determining: 
- Which fields your users autofill
- Which fields your users fill in completely manually
- Which fields your users autofill and then tweak manually

## Browser support

- ✅ Chrome 125+
- ✅ Edge 125+
- ✅ Safari 17.4.1+
- ✅ Firefox 126+

## How does it work?

It's not a hack :)

This demo relies on the following snippet (by [@battre](https://github.com/battre)):

```javascript
// Get all elements that are autofilled using the :autofill pseudo-class
const allAutofilledElements = document.querySelectorAll(':autofill');
// Check if the passed element is in the list of autofilled elements
const isAutofilled = Array.from(allAutofilledElements).includes(element);
```
