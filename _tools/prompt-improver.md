---
layout: project
title: Prompt Improver
description: Supercharges your LLM prompts using, yes, an LLM.
---

This tool helps you refine and enhance your LLM prompts using, yes, an LLM. Simply provide your Gemini API key and a basic prompt, and the tool will return an improved, more detailed version designed for better results.

<style>
  .container {
    max-width: 800px;
    margin: 20px auto;
    background-color: #f8f9fa;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    padding: 30px;
  }

  .form-group {
    margin-bottom: 20px;
  }

  label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    color: #333;
  }

  input[type="text"],
  input[type="password"],
  textarea { /* Added textarea for general use */
    width: calc(100% - 24px);
    padding: 10px 12px;
    border: 1px solid #ced4da;
    border-radius: 4px;
    font-size: 16px;
    transition: border-color 0.2s, box-shadow 0.2s;
    box-sizing: border-box;
  }

  input[type="text"]:focus,
  input[type="password"]:focus,
  textarea:focus {
    border-color: #4a90e2;
    outline: none;
    box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.25);
  }

  button {
    background-color: #4a90e2;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 10px 16px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.2s;
    width: 100%;
    font-weight: 600;
    margin-top: 10px;
  }

  button:hover {
    background-color: #3a7bc8;
  }

  button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }

  .loading, .error-message {
    text-align: center;
    font-size: 18px;
    color: #666;
    padding: 20px;
    margin-top: 20px;
    border-radius: 8px;
  }

  .error-message {
    background-color: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
  }

  .loading-spinner {
    border: 4px solid rgba(0, 0, 0, 0.1);
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border-left-color: #4a90e2;
    animation: spin 1s linear infinite;
    margin: 0 auto 10px;
  }
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  #result-output { /* Generic ID for output */
    margin-top: 30px;
    padding: 20px;
    background-color: #fff;
    border: 1px solid #eaeaea;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  }

  .result-header {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 10px;
  }

  #copy-button {
    display: flex;
    align-items: center;
    gap: 5px;
    background-color: #f0f0f0;
    color: #333;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 6px 12px;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s;
    width: auto;
    margin-top: 0;
  }

  #copy-button:hover {
    background-color: #e0e0e0;
  }

  #copy-button.copied {
    background-color: #4caf50;
    color: white;
  }

  .info-text {
    font-size: 0.9em;
    color: #6c757d;
    margin-top: 5px;
    margin-bottom: 10px;
    text-align: left;
  }

  body > .container {
      margin-top: 20px;
      margin-bottom: 20px;
  }
</style>

<script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>

<div class="container">
    <div class="form-group">
        <label for="gemini-api-key">Gemini API Key:</label>
        <input type="password" id="gemini-api-key" placeholder="Enter your Gemini API key" required>
    </div>
    <div class="form-group">
        <label for="user-prompt">Prompt:</label>
        <textarea id="user-prompt" rows="8" placeholder="Enter the prompt you want to improve..." required></textarea>
    </div>
    <button id="improve-prompt-button">Improve Prompt</button>

    <div id="loading" class="loading" style="display: none;">
        <div class="loading-spinner"></div>
        <p>Improving prompt...</p>
    </div>

    <div id="error-message" class="error-message" style="display: none;"></div>

    <div id="result-output" style="display: none;">
        <h2>Improved Prompt:</h2>
        <div class="result-header">
            <button id="copy-button" title="Copy to clipboard">Copy</button>
        </div>
        <div id="improved-prompt-content"></div>
    </div>

</div>

<script>
    document.addEventListener('DOMContentLoaded', () => {
        const geminiApiKeyInput = document.getElementById('gemini-api-key');
        const userPromptInput = document.getElementById('user-prompt');
        const improvePromptButton = document.getElementById('improve-prompt-button');
        const loadingDiv = document.getElementById('loading');
        const errorMessageDiv = document.getElementById('error-message');
        const resultOutputDiv = document.getElementById('result-output');
        const improvedPromptContentDiv = document.getElementById('improved-prompt-content');
        const copyButton = document.getElementById('copy-button');


        improvePromptButton.addEventListener('click', async () => {
            const geminiApiKey = geminiApiKeyInput.value.trim();
            const userPrompt = userPromptInput.value.trim();

            // Clear previous states
            errorMessageDiv.style.display = 'none';
            resultOutputDiv.style.display = 'none';
            improvedPromptContentDiv.innerHTML = '';

            if (!geminiApiKey) {
                showError('Please enter your Gemini API key.');
                return;
            }
            if (!userPrompt) {
                showError('Please enter a prompt to improve.');
                return;
            }

            // Show loading
            loadingDiv.style.display = 'block';
            improvePromptButton.disabled = true;
            improvePromptButton.textContent = 'Processing...';

            try {
                const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`;

                const requestBody = {
                    contents: [{
                        parts: [{
                            text: `Improve the following prompt for a large language model to be more effective, detailed, and clear. Suggest a suitable persona if applicable, and consider what additional context or constraints would lead to a better response. Output ONLY the improved prompt, without any conversational filler or explanation. Do NOT surround the improved prompt with any additional text or quotation marks.

Original prompt:
"${userPrompt}"

Improved prompt:`
                        }]
                    }]
                };

                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(requestBody)
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error.message || `HTTP error! status: ${response.status}`);
                }

                const data = await response.json();

                if (data.candidates && data.candidates.length > 0 && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts.length > 0) {
                    const improvedPrompt = data.candidates[0].content.parts[0].text;
                    improvedPromptContentDiv.innerHTML = marked.parse(improvedPrompt);
                    resultOutputDiv.style.display = 'block';
                    
                    copyButton.innerHTML = 'Copy';
                    copyButton.classList.remove('copied');
                } else {
                    showError('No improved prompt received from the API. Please check your API key and prompt.');
                }

            } catch (error) {
                console.error('Error:', error);
                showError(`Error improving prompt: ${error.message}. Please ensure your API key is correct and you have access to the Gemini API.`);
            } finally {
                loadingDiv.style.display = 'none';
                improvePromptButton.disabled = false;
                improvePromptButton.textContent = 'Improve Prompt';
            }
        });

        function showError(message) {
            errorMessageDiv.textContent = message;
            errorMessageDiv.style.display = 'block';
        }

        // Copy to clipboard functionality
        copyButton.addEventListener('click', () => {
            // Get the raw text from the improved prompt content (without HTML formatting)
            const improvedPromptText = improvedPromptContentDiv.textContent;
            
            // Copy to clipboard
            navigator.clipboard.writeText(improvedPromptText).then(() => {
                // Visual feedback
                copyButton.innerHTML = 'Copied!';
                copyButton.classList.add('copied');
                
                // Reset after 2 seconds
                setTimeout(() => {
                    copyButton.innerHTML = 'Copy';
                    copyButton.classList.remove('copied');
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy text: ', err);
            });
        });
    });
</script>
