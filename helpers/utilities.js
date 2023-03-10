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
 * @param {Number} length
 */
export function generateRandomString(length) {
  return [...Array(length)].reduce(
    (accumulator) =>
      accumulator + String.fromCharCode(97 + Math.floor(Math.random() * 26)),
    ""
  );
}