---
layout: project
title: Signature PNG Creator
description: Draw a signature on the site and download it as a transparent PNG.
---

Draw your signature below and download it as a transparent PNG!

<div class="container">
    <div class="controls">
        <label for="penColor">Pen Color:</label>
        <input type="color" id="penColor" value="#000000">

        <button id="undoBtn">Undo</button>
        <button id="clearBtn">Clear</button>
        <button id="downloadBtn">Download Signature</button>
    </div>
    <canvas id="signatureCanvas"></canvas>
    <div id="error-message" class="error-message" style="display: none;"></div>

</div>

<style>
  /* Inherit some styles from the example for general layout */
  .container {
    max-width: 800px;
    margin: 20px auto;
    background-color: #f8f9fa;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    padding: 30px;
    text-align: center; /* Center the canvas and controls */
  }

  .controls {
    margin-bottom: 20px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 10px; /* Space between control elements */
  }

  .controls label {
    margin-right: 5px;
    font-weight: 600;
  }

  .controls input[type="color"] {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    width: 40px; /* Adjust size */
    height: 40px;
    border: none;
    background-color: transparent;
    cursor: pointer;
    padding: 0;
    border-radius: 4px;
    overflow: hidden; /* Hide default color picker border */
  }

  .controls input[type="color"]::-webkit-color-swatch-wrapper {
    padding: 0;
  }

  .controls input[type="color"]::-webkit-color-swatch {
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  .controls input[type="color"]::-moz-color-swatch-wrapper {
    padding: 0;
  }

  .controls input[type="color"]::-moz-color-swatch {
    border: 1px solid #ccc;
    border-radius: 4px;
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
    font-weight: 600;
  }

  button:hover {
    background-color: #3a7bc8;
  }

  button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }

  #signatureCanvas {
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: #fff;
    touch-action: none; /* Prevent scrolling on mobile when drawing */
    max-width: 100%; /* Ensure canvas is responsive */
    height: auto; /* Maintain aspect ratio */
  }

  .error-message {
    background-color: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
    text-align: center;
    font-size: 16px;
    padding: 10px;
    margin-top: 20px;
    border-radius: 8px;
  }
</style>

<script src="https://cdn.jsdelivr.net/npm/signature_pad@4.1.0/dist/signature_pad.umd.min.js"></script>
<script>
    document.addEventListener('DOMContentLoaded', () => {
        const canvas = document.getElementById('signatureCanvas');
        const penColorInput = document.getElementById('penColor');
        const undoBtn = document.getElementById('undoBtn');
        const clearBtn = document.getElementById('clearBtn');
        const downloadBtn = document.getElementById('downloadBtn');
        const errorMessageDiv = document.getElementById('error-message');

        let signaturePad = null;

        // Function to resize canvas
        function resizeCanvas() {
            const ratio = Math.max(window.devicePixelRatio || 1, 1);
            canvas.width = canvas.offsetWidth * ratio;
            canvas.height = canvas.offsetHeight * ratio;
            canvas.getContext('2d').scale(ratio, ratio);
            if (signaturePad) {
                signaturePad.clear(); // Clear the canvas on resize to avoid drawing issues
                // Re-apply drawing if needed, but for signature, it's usually cleared.
            }
        }

        // Set initial canvas size and then adjust on window resize
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Initialize SignaturePad
        signaturePad = new SignaturePad(canvas, {
            backgroundColor: 'rgba(255, 255, 255, 0)', // Transparent background for PNG
            penColor: penColorInput.value,
            minWidth: 0.5, // Mimic pen pressure
            maxWidth: 2.5, // Mimic pen pressure
            throttle: 0, // No throttling for smoother drawing
            velocityFilterWeight: 0.7 // Adjust for a more natural feel
        });

        // Event Listeners
        penColorInput.addEventListener('input', (event) => {
            signaturePad.penColor = event.target.value;
        });

        undoBtn.addEventListener('click', () => {
            const data = signaturePad.toData();
            if (data.length > 0) {
                data.pop(); // Remove the last stroke
                signaturePad.fromData(data);
            }
        });

        clearBtn.addEventListener('click', () => {
            signaturePad.clear();
        });

        downloadBtn.addEventListener('click', () => {
            if (signaturePad.isEmpty()) {
                showError('Please draw your signature before downloading.');
                return;
            }

            // Hide error message if drawing exists
            errorMessageDiv.style.display = 'none';

            // Get the signature as a data URL (PNG format, transparent background)
            const dataURL = signaturePad.toDataURL('image/png');

            // Create a temporary link element to trigger download
            const a = document.createElement('a');
            a.href = dataURL;
            a.download = 'signature.png'; // File name
            document.body.appendChild(a); // Append to body is necessary for Firefox
            a.click(); // Programmatically click the link to trigger download
            document.body.removeChild(a); // Clean up the temporary link
        });

        function showError(message) {
            errorMessageDiv.textContent = message;
            errorMessageDiv.style.display = 'block';
        }
    });
</script>
