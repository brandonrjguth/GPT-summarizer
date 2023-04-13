// scripts/background.js
async function callGptApi(prompt) {
  try {
    const response = await fetch('http://localhost:3000/gpt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error(error);
    return 'Error processing the request';
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

  console.log('wholePage checked? '+request.wholePage);
  if (request.wholePage){
    getText = () => document.body.innerText;
    textOrPage = "web page";
  } else {
    textOrPage = "text";
    getText = () => window.getSelection().toString();
  }
  
  if (request.action === 'summarize') {
    
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      chrome.scripting.executeScript(
        {
          target: { tabId: tab.id },
          function: getText,
        },
        async (selectedTextArray) => {
          const selectedText = selectedTextArray[0].result || '';
          const textToSend = "please summarize the following "+textOrPage+": \""+selectedText+"\"";
          const result = await callGptApi({prompt:textToSend, maxTokens:Number(request.maxTokens)});
          sendResponse({ result });
        }
      );
    });

    return true; // Required to use sendResponse asynchronously
  } else {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tab = tabs[0];
  
        chrome.scripting.executeScript(
          {
            target: { tabId: tab.id },
            function: () => window.getSelection().toString(),
          },
          async (selectedTextArray) => {
            const selectedText = selectedTextArray[0].result || '';
            const textToSend = "I have a question about the following "+textOrPage+": \""+selectedText+"\" Here is my question: \""+request.inputText+"\"";
            const result = await callGptApi({prompt:textToSend, maxTokens:Number(request.maxTokens)});
            sendResponse({ result });
          }
        );
      });
  
      return true; // Required to use sendResponse asynchronously
  }
});