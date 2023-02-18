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
