---
layout: project
title: PrintNode Printers Explorer
description: Explore printers configured in PrintNode using your API key
---

Explore printers configured in PrintNode using your API key

<style>
  .printnode-container {
    max-width: 800px;
    margin: 0 auto;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  }
  
  #api-key-form {
    background-color: #f8f9fa;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    margin-bottom: 30px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 10px;
  }
  
  #api-key-form label {
    font-weight: 600;
    margin-right: 10px;
    color: #333;
  }
  
  #api-key-input {
    flex: 1;
    min-width: 250px;
    padding: 10px 12px;
    border: 1px solid #ced4da;
    border-radius: 4px;
    font-size: 16px;
    transition: border-color 0.2s;
  }
  
  #api-key-input:focus {
    border-color: #4a90e2;
    outline: none;
    box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.25);
  }
  
  #submit-btn {
    background-color: #4a90e2;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 10px 16px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  #submit-btn:hover {
    background-color: #3a7bc8;
  }
  
  #loading {
    text-align: center;
    font-size: 18px;
    color: #666;
    padding: 20px;
  }
  
  #result h2 {
    border-bottom: 2px solid #eaeaea;
    padding-bottom: 12px;
    margin-bottom: 25px;
    font-size: 24px;
    font-weight: 600;
  }
  
  #printer-list {
    list-style-type: none;
    padding: 0;
  }
  
  #printer-list li {
    background-color: #fff;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 20px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
    border: 1px solid #eaeaea;
  }
  
  #printer-list li:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
  
  #printer-list strong {
    color: #4a5568;
    font-weight: 600;
  }
  
  #printer-list hr {
    border: none;
    border-top: 1px solid #eaeaea;
    margin: 15px 0;
  }
  
  .printer-info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 12px;
    margin: 15px 0;
  }
  
  .printer-info-item {
    background-color: #f9f9f9;
    border-radius: 6px;
    padding: 10px 12px;
    display: flex;
    flex-direction: column;
  }
  
  .printer-info-label {
    font-size: 12px;
    text-transform: uppercase;
    color: #718096;
    margin-bottom: 4px;
    letter-spacing: 0.5px;
  }
  
  .printer-info-value {
    font-size: 14px;
    color: #2d3748;
    font-weight: 500;
  }
  
  .printer-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 15px;
  }
  
  .printer-title {
    font-size: 20px;
    font-weight: 600;
    color: #2d3748;
    margin: 0;
  }
  
  .printer-badges {
    display: flex;
    gap: 8px;
  }
</style>

<div class="printnode-container">
  <form id="api-key-form">
    <label for="api-key-input">PrintNode API Key:</label>
    <input type="password" id="api-key-input" placeholder="Enter your PrintNode API Key" required>
    <button type="submit" id="submit-btn">Load Printers</button>
  </form>

  <div id="loading" style="display: none;">Loading printers...</div>

  <div id="result" style="display: none;">
    <h2>Printers in Account:</h2>
    <ul id="printer-list"></ul>
  </div>
</div>

<script>
    document.addEventListener('DOMContentLoaded', () => {
        const apiKeyForm = document.getElementById('api-key-form');
        const apiKeyInput = document.getElementById('api-key-input');
        const submitBtn = document.getElementById('submit-btn');
        const loading = document.getElementById('loading');
        const resultDiv = document.getElementById('result');
        const printerList = document.getElementById('printer-list');

        // Add loading animation
        loading.innerHTML = `
            <div class="loading-spinner">
                <div class="spinner"></div>
                <p>Loading printers...</p>
            </div>
        `;

        // Add styles for loading animation
        const style = document.createElement('style');
        style.textContent = `
            .loading-spinner {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 20px;
            }
            .spinner {
                border: 4px solid rgba(0, 0, 0, 0.1);
                width: 36px;
                height: 36px;
                border-radius: 50%;
                border-left-color: #4a90e2;
                animation: spin 1s linear infinite;
                margin-bottom: 10px;
            }
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            .error-message {
                background-color: #fff8f8;
                border-left: 4px solid #e74c3c;
                padding: 12px 15px;
                color: #c0392b;
                border-radius: 4px;
                margin-bottom: 15px;
            }
            .badge {
                display: inline-block;
                padding: 4px 10px;
                border-radius: 20px;
                font-size: 13px;
                font-weight: 600;
                letter-spacing: 0.3px;
            }
            .badge {
                display: inline-block;
                padding: 3px 8px;
                border-radius: 12px;
                font-size: 12px;
                font-weight: 600;
                margin-left: 5px;
            }
            .badge-online {
                background-color: #27ae60;
                color: white;
            }
            .badge-offline {
                background-color: #e74c3c;
                color: white;
            }
            .badge-default {
                background-color: #3498db;
                color: white;
            }
        `;
        document.head.appendChild(style);

        apiKeyForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const apiKey = apiKeyInput.value.trim();

            if (!apiKey) {
                showError('Please enter your PrintNode API Key.');
                return;
            }

            // Show loading state
            loading.style.display = 'block';
            resultDiv.style.display = 'none';
            printerList.innerHTML = ''; // Clear previous results
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Loading...';

            try {
                // PrintNode API uses Basic Authentication
                const credentials = btoa(`${apiKey}:`); // Base64 encode "API_KEY:"

                const response = await fetch('https://api.printnode.com/printers', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Basic ${credentials}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
                }

                const printers = await response.json();

                if (printers.length === 0) {
                    printerList.innerHTML = `
                        <li>
                            <div class="error-message">
                                No printers found for this API key. Make sure you have printers configured in your PrintNode account.
                            </div>
                        </li>
                    `;
                } else {
                    printers.forEach(printer => {
                        const listItem = document.createElement('li');
                        
                        // Determine connection status badge
                        let statusBadge = '';
                        if (printer.connectionStatus) {
                            const status = printer.connectionStatus.toLowerCase();
                            if (status === 'online') {
                                statusBadge = '<span class="badge badge-online">Online</span>';
                            } else if (status === 'offline') {
                                statusBadge = '<span class="badge badge-offline">Offline</span>';
                            }
                        }
                        
                        // Default badge
                        const defaultBadge = printer.default ? 
                            '<span class="badge badge-default">Default</span>' : '';
                        
                        listItem.innerHTML = `
                            <div class="printer-header">
                                <h3 class="printer-title">${printer.name || 'Unnamed Printer'}</h3>
                                <div class="printer-badges">
                                    ${statusBadge}
                                    ${defaultBadge}
                                </div>
                            </div>
                            
                            <div class="printer-info-grid">
                                <div class="printer-info-item">
                                    <span class="printer-info-label">ID</span>
                                    <span class="printer-info-value">${printer.id || 'N/A'}</span>
                                </div>
                                
                                <div class="printer-info-item">
                                    <span class="printer-info-label">State</span>
                                    <span class="printer-info-value">${printer.state || 'N/A'}</span>
                                </div>
                                
                                <div class="printer-info-item">
                                    <span class="printer-info-label">Type</span>
                                    <span class="printer-info-value">${printer.type || 'N/A'}</span>
                                </div>
                                
                                ${printer.computer ? `
                                <div class="printer-info-item">
                                    <span class="printer-info-label">Computer</span>
                                    <span class="printer-info-value">${printer.computer.name || 'N/A'}</span>
                                </div>
                                
                                <div class="printer-info-item">
                                    <span class="printer-info-label">Computer ID</span>
                                    <span class="printer-info-value">${printer.computer.id || 'N/A'}</span>
                                </div>` : ''}
                            
                            ${printer.description ? `
                            <div class="printer-info-item" style="grid-column: span 3;">
                                <span class="printer-info-label">Description</span>
                                <span class="printer-info-value">${printer.description}</span>
                            </div>` : ''}
                        `;
                        printerList.appendChild(listItem);
                    });
                }
                resultDiv.style.display = 'block';

            } catch (error) {
                console.error('Error fetching printers:', error);
                printerList.innerHTML = `
                    <li>
                        <div class="error-message">
                            <strong>Error:</strong> ${error.message}. Please check your API key and try again.
                        </div>
                    </li>
                `;
                resultDiv.style.display = 'block';
            } finally {
                loading.style.display = 'none';
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Load Printers';
            }
        });

        function showError(message) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = message;
            
            // Insert error before the form
            apiKeyForm.parentNode.insertBefore(errorDiv, apiKeyForm);
            
            // Remove after 5 seconds
            setTimeout(() => {
                errorDiv.remove();
            }, 5000);
        }
    });
</script>
