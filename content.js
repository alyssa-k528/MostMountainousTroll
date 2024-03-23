// runs in context of web page
// interacts directly with the content of the web page that the user visits
// read/modify content of web page


// Example of extracting text and sending it to the background script
let pageText = document.body.innerText; // Simplistic example
chrome.runtime.sendMessage({text: pageText});


// Create and append the character image to the webpage
const characterImageUrl = chrome.runtime.getURL('troll.png');
const characterImage = document.createElement('img');
characterImage.src = characterImageUrl;
characterImage.style.position = 'fixed';
characterImage.style.bottom = '10px'; // Adjust as needed
characterImage.style.right = '10px'; // Adjust as needed
characterImage.style.zIndex = '9999'; // Ensure it's on top of other elements
document.body.appendChild(characterImage);
