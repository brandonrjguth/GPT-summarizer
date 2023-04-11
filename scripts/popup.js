// scripts/popup.js
document.getElementById('summarizeBtn').addEventListener('click', () => {
    const inputText = document.getElementById('inputText').value;
    const resultDiv = document.getElementById('result');
  
    resultDiv.textContent = 'Processing...';

    if (inputText == ""){
        chrome.runtime.sendMessage({ action: 'summarize', inputText }, (response) => {
            if (chrome.runtime.lastError) {
              resultDiv.textContent = 'Error: ' + chrome.runtime.lastError.message;
            } else {
              resultDiv.textContent = response.result;
            }
          });
    }

    else{
        chrome.runtime.sendMessage({ action: 'custom', inputText }, (response) => {
        if (chrome.runtime.lastError) {
            resultDiv.textContent = 'Error: ' + chrome.runtime.lastError.message;
        } else {
            resultDiv.textContent = response.result;
        }
        });
    }
  });