let buddyVisible = false;

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.action === 'toggleBuddy') {
    if (buddyVisible) {
      hideBuddy();
    } else {
      showBuddy();
    }
  }
});

function showBuddy() {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      files: ['buddy.js']
    });
    buddyVisible = true;
  });
}

function hideBuddy() {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      function: () => {
        const buddyElement = document.getElementById('buddy');
        if (buddyElement) {
          buddyElement.remove();
        }
      }
    });
    buddyVisible = false;
  });
}
