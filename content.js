// runs in context of web page
// interacts directly with the content of the web page that the user visits
// read/modify content of web page


// Example of extracting text and sending it to the background script
let pageText = document.body.innerText; // Simplistic example
chrome.runtime.sendMessage({text: pageText});
