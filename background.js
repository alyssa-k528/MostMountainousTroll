// communicates with OpenAI API to generate fun facts based on webpae

// listen for messages from the content script
// fcn executes when message received from content script
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    // sending request to OpenAI API - script sending data to api an expecting response
    fetch('https://api.openai.com/v1/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer YOUR_API_KEY` //TODO: Replace YOUR_API_KEY with your OpenAI API key
      },
      body: JSON.stringify({
        model: "text-davinci-002",
        // prompt dynamically created using text from web page
        prompt: `Create a fun fact about: ${request.text}`, // Use the text from the page
        max_tokens: 50
      })
    })
    // processing response from OpenAI API
    .then(response => response.json())
    .then(data => {
      // Handle the response
      console.log(data.choices[0].text); // This is your fun fact
      // You can send this back to your content script or popup
    })
    .catch(error => console.error('Error:', error));
  });
  