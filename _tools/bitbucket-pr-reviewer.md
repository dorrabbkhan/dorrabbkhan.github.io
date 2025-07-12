---
layout: project
title: BitBucket PR Reviewer
description: Get a code review for your Bitbucket Pull Request using Google Gemini
---

Get a code review for your Bitbucket Pull Request using Google Gemini

<style>
  .container {
    max-width: 800px;
    margin: 20px auto;
    background-color: #f8f9fa; /* Lighter background for the main form container */
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* Subtle shadow */
    padding: 30px; /* More padding */
  }

  .form-group {
    margin-bottom: 20px; /* Spacing between input groups */
  }

  label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600; /* Bolder label */
    color: #333; /* Darker text for labels */
  }

  input[type="text"],
  input[type="password"] { /* Applied to all relevant inputs */
    width: calc(100% - 24px); /* Full width minus padding */
    padding: 10px 12px; /* From #api-key-input */
    border: 1px solid #ced4da; /* From #api-key-input */
    border-radius: 4px; /* From #api-key-input */
    font-size: 16px; /* From #api-key-input */
    transition: border-color 0.2s, box-shadow 0.2s;
    box-sizing: border-box; /* Include padding in width */
  }

  input[type="text"]:focus,
  input[type="password"]:focus {
    border-color: #4a90e2; /* From #api-key-input:focus */
    outline: none;
    box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.25); /* From #api-key-input:focus */
  }

  button { /* Applied to #get-review-btn */
    background-color: #4a90e2; /* From #submit-btn */
    color: white;
    border: none;
    border-radius: 4px; /* From #submit-btn */
    padding: 10px 16px; /* From #submit-btn */
    font-size: 16px; /* From #submit-btn */
    cursor: pointer;
    transition: background-color 0.2s;
    width: 100%; /* Make button full width */
    font-weight: 600;
    margin-top: 10px; /* Add some space above the button */
  }

  button:hover {
    background-color: #3a7bc8; /* From #submit-btn:hover */
  }

  button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }

  .loading, .error-message { /* Combined styles for loading and error */
    text-align: center;
    font-size: 18px;
    color: #666;
    padding: 20px;
    margin-top: 20px;
    border-radius: 8px;
  }

  .error-message {
    background-color: #f8d7da; /* Light red background */
    color: #721c24; /* Dark red text */
    border: 1px solid #f5c6cb; /* Red border */
  }

  .loading-spinner { /* Added loading spinner styles */
    border: 4px solid rgba(0, 0, 0, 0.1);
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border-left-color: #4a90e2; /* Matching primary color */
    animation: spin 1s linear infinite;
    margin: 0 auto 10px; /* Center and space below */
  }
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  #review-result {
    margin-top: 30px;
    padding: 20px; /* Consistent padding */
    background-color: #fff; /* White background for results */
    border: 1px solid #eaeaea; /* Light border */
    border-radius: 8px; /* Rounded corners */
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08); /* Consistent shadow */
  }

  .info-text {
    font-size: 0.9em;
    color: #6c757d;
    margin-top: 5px; /* Adjust spacing */
    margin-bottom: 10px; /* Adjust spacing */
    text-align: left; /* Changed from right to left for better flow below input */
  }

  body > .container {
      margin-top: 20px;
      margin-bottom: 20px;
  }

</style>
<script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>

<div class="container">
    <div class="form-group">
        <label for="bitbucket-pr-url">Bitbucket Pull Request URL:</label>
        <input type="text" id="bitbucket-pr-url" placeholder="e.g., https://bitbucket.org/your-workspace/your-repo/pull-requests/123" required>
        <div class="info-text">Supports Bitbucket Cloud URLs only.</div>
    </div>

    <div class="form-group">
        <label for="bitbucket-username">Bitbucket Username:</label>
        <input type="text" id="bitbucket-username" placeholder="Your Bitbucket username (or email for app password)" required>
    </div>

    <div class="form-group">
        <label for="bitbucket-app-password">Bitbucket App Password:</label>
        <input type="password" id="bitbucket-app-password" placeholder="Generate an app password with 'Pull Request Read' permission" required>
        <div class="info-text">Highly recommended instead of your main password.</div>
    </div>

    <div class="form-group">
        <label for="gemini-api-key">Gemini API Key:</label>
        <input type="password" id="gemini-api-key" placeholder="Your Google Gemini API Key" required>
        <div class="info-text">Get one from <a href="https://aistudio.google.com/app/apikey" target="_blank">Google AI Studio</a>.</div>
    </div>

    <button id="get-review-btn">Get PR Review</button>

<div id="loading" class="loading" style="display: none;">
<p>Loading...</p>
</div>

    <div id="error-message" class="error-message" style="display: none;"></div>

    <div id="review-result" style="display: none;">
        <h2>Gemini's Code Review</h2>
        <div id="review-content"></div> </div>

</div>

<script>
    document.addEventListener('DOMContentLoaded', () => {
        const prUrlInput = document.getElementById('bitbucket-pr-url');
        const usernameInput = document.getElementById('bitbucket-username');
        const appPasswordInput = document.getElementById('bitbucket-app-password');
        const geminiApiKeyInput = document.getElementById('gemini-api-key');
        const getReviewBtn = document.getElementById('get-review-btn');
        const loadingDiv = document.getElementById('loading');
        const errorMessageDiv = document.getElementById('error-message');
        const reviewResultDiv = document.getElementById('review-result');
        const reviewContentDiv = document.getElementById('review-content');

        getReviewBtn.addEventListener('click', async () => {
            const prUrl = prUrlInput.value.trim();
            const bitbucketUsername = usernameInput.value.trim();
            const bitbucketAppPassword = appPasswordInput.value.trim();
            const geminiApiKey = geminiApiKeyInput.value.trim();

            errorMessageDiv.style.display = 'none';
            reviewResultDiv.style.display = 'none';
            reviewContentDiv.innerHTML = '';

            if (!prUrl || !bitbucketUsername || !bitbucketAppPassword || !geminiApiKey) {
                showError('All fields are required.');
                return;
            }

            // Regex to parse Bitbucket Cloud PR URL
            const bitbucketUrlRegex = /https:\/\/bitbucket.org\/([^\/]+)\/([^\/]+)\/pull-requests\/(\d+)/;
            const match = prUrl.match(bitbucketUrlRegex);

            if (!match) {
                showError('Invalid Bitbucket Pull Request URL format. Please use: https://bitbucket.org/your-workspace/your-repo/pull-requests/123');
                return;
            }

            const workspace = match[1];
            const repoSlug = match[2];
            const prId = match[3];

            // Show loading
            loadingDiv.style.display = 'block';
            getReviewBtn.disabled = true;
            getReviewBtn.textContent = 'Processing...';

            try {
                // 1. Fetch Diff from Bitbucket
                const diffUrl = `https://api.bitbucket.org/2.0/repositories/${workspace}/${repoSlug}/pullrequests/${prId}/diff`;
                const authString = btoa(`${bitbucketUsername}:${bitbucketAppPassword}`);

                const diffResponse = await fetch(diffUrl, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Basic ${authString}`,
                        'Accept': 'text/plain' // Request plain text diff
                    }
                });

                if (!diffResponse.ok) {
                    const errorBody = await diffResponse.text();
                    let errorMessage = `Failed to fetch diff from Bitbucket: ${diffResponse.status} ${diffResponse.statusText}.`;
                    if (diffResponse.status === 401 || diffResponse.status === 403) {
                        errorMessage += ' Check your Bitbucket username and app password/permissions.';
                    }
                    if (errorBody) {
                            errorMessage += ` Details: ${errorBody.substring(0, 200)}...`; // Limit length
                    }
                    throw new Error(errorMessage);
                }

                const diffContent = await diffResponse.text();

                if (diffContent.trim() === '') {
                    throw new Error('No diff content found for this pull request. It might be an empty PR or already merged.');
                }

                // 2. Send Diff to Gemini for Review
                // Switched to gemini-2.0-flash for faster responses
                const geminiApiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`;

                const prompt = `You are an expert code reviewer. Please review the following code diff from a Bitbucket Pull Request. Focus on potential bugs, code quality, readability, security vulnerabilities, performance issues, and adherence to best practices. Provide actionable suggestions and explain your reasoning clearly.

Here is the code diff:

\`\`\`diff
${diffContent}
\`\`\`

Provide your review in a concise and clear manner, using markdown for formatting.`;

                const geminiResponse = await fetch(geminiApiEndpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{
                                text: prompt
                            }]
                        }]
                    })
                });

                if (!geminiResponse.ok) {
                    const errorBody = await geminiResponse.json();
                    let errorMessage = `Failed to get review from Gemini API: ${geminiResponse.status} ${geminiResponse.statusText}.`;
                    if (geminiResponse.status === 400 && errorBody.error && errorBody.error.message.includes('API key not valid')) {
                        errorMessage += ' Check your Gemini API key.';
                    } else if (errorBody.error && errorBody.error.message) {
                        errorMessage += ` Details: ${errorBody.error.message}`;
                    }
                    throw new Error(errorMessage);
                }

                const geminiData = await geminiResponse.json();
                const review = geminiData.candidates && geminiData.candidates[0] && geminiData.candidates[0].content && geminiData.candidates[0].content.parts[0] && geminiData.candidates[0].content.parts[0].text;

                if (review) {
                    // Convert markdown to HTML using marked.js
                    reviewContentDiv.innerHTML = marked.parse(review);
                    reviewResultDiv.style.display = 'block';
                } else {
                    showError('Gemini did not return a review. The diff might be too large or complex for the model, or there was an issue with the response structure.');
                }

            } catch (error) {
                console.error('Error:', error);
                showError(error.message || 'An unexpected error occurred.');
            } finally {
                loadingDiv.style.display = 'none';
                getReviewBtn.disabled = false;
                getReviewBtn.textContent = 'Get PR Review';
            }
        });

        function showError(message) {
            errorMessageDiv.textContent = message;
            errorMessageDiv.style.display = 'block';
        }
    });
</script>
