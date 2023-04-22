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
export function areSame(obj1, obj2, failMessage = null) {
  const result = JSON.stringify(obj1) === JSON.stringify(obj2);
  if (failMessage && !result) alert(failMessage);
  return result;
}
