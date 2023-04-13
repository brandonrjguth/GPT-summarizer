const tokenSlider = document.getElementById('token-slider');
const tokenValue = document.getElementById('token-value');
tokenSlider.value = 150;

tokenSlider.addEventListener('input', () => {
  tokenValue.textContent = tokenSlider.value;
});

document.getElementById('summarizeBtn').addEventListener('click', () => {
    const inputText = document.getElementById('inputText').value;
    const resultDiv = document.getElementById('result');
    // scripts/popup.js
   
    let maxTokens = tokenSlider.value;

    resultDiv.textContent = 'Processing...';

    if (inputText == ""){
        chrome.runtime.sendMessage({ action: 'summarize', inputText, maxTokens }, (response) => {
            if (chrome.runtime.lastError) {
              resultDiv.textContent = 'Error: ' + chrome.runtime.lastError.message;
            } else {
              const formattedResult = response.result.replace(/\n/g, '<br>');
              resultDiv.innerHTML = formattedResult;
            }
          });
    }

    else{
        chrome.runtime.sendMessage({ action: 'custom', inputText, maxTokens }, (response) => {
        if (chrome.runtime.lastError) {
            resultDiv.textContent = 'Error: ' + chrome.runtime.lastError.message;
        } else {
          const formattedResult = response.result.replace(/\n/g, '<br>');
          resultDiv.innerHTML = formattedResult;
        }
        });
    }
  });