/**
 * Will alert error message. If there is an error details object given, will also log it in console
 * @param {string} message Error message to display
 * @param {object} errorDetails Error details object that will be logged to console
 */
export function displayError(message, errorDetails = null) {
  message = message || "Error";
  if (errorDetails) {
    console.log(message, errorDetails);
    message += "\nSee console for details.";
  }
  alert(message);
}

/**
 * Sorts the given array by its property and returns itself (without creating new one)
 */
export function orderBy(list, propertyName = null, asc = true) {
  if (!propertyName) return list.sort();

  return list.sort(function (a, b) {
    let valA = a[propertyName];
    let valB = b[propertyName];
    let result;
    if (typeof valA === "string" && typeof valB === "string") {
      // string
      valA = valA.toLocaleLowerCase();
      valB = valB.toLocaleLowerCase();
      result = valA < valB ? -1 : valA > valB ? 1 : 0;
    } else {
      result = valA - valB; // numeric
    }
    return result * (asc ? 1 : -1);
  });
}

/**
 * Will generate a random string of lower case characters of given length
 * @param {number} length
 */
export function generateRandomString(length) {
  return [...Array(length)].reduce(
    (accumulator) =>
      accumulator + String.fromCharCode(97 + Math.floor(Math.random() * 26)),
    ""
  );
}

/**
 * Will check if given array has duplicate elements or elements that are objects and have duplicate properties
 * @param {Array} arr source array to check for duplicates
 * @param {function} func optional mapping expression (arrow function) to select a specific property from objects in array. E.g x=>x.key
 * @returns boolean
 */
export function hasDuplicates(arr, func = null) {
  const uniques = new Set(func ? arr.map(func) : arr); // Set has unique elements
  return uniques.size < arr.length;
}

/**
 * Will deep check if 2 given objects are same by converting them into strings. Additonally can alert a message on failure
 * @returns boolean
 */
export function areSame(obj1, obj2, successMessage = null) {
  const same = JSON.stringify(obj1) === JSON.stringify(obj2);
  if (same && successMessage) alert(successMessage);
  return same;
}

/**
 * Creates an indexed object from list of objects where key is the iteratee for element.
 * @param {object} baseObj if none given will create brand new object, otherwise will append to given base one
 */
export function indexBy(list, key, baseObj = {}) {
  return list.reduce(
    (acc, obj) => {
      acc[obj[key]] = obj;
      return acc;
    },
    { ...baseObj }
  );
}

/**
 * Check if given input is null, undefined, empty string, empty object or empty array
 * @param {*} input
 * @returns boolean
 */
export function isNullOrEmpty(input) {
  if (input === null || input === undefined) return true;
  if (input instanceof String) return input === "";
  if (input instanceof Object) return Object.keys(input).length === 0;
  if (input instanceof Array) return input.length === 0;
  throw new Error("Unknown type");
}
