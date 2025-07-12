---
layout: project
title: Wardrobe Advisor
description: Get personalized clothing recommendations based on your current location and the weather.
---

Get personalized clothing recommendations based on your current location and the weather.

<div class="container">
    <button id="get-recommendation-btn">Get My Wardrobe Recommendation</button>

    <div id="loading" class="loading" style="display: none;">
        <div class="loading-spinner"></div>
        <p>Detecting location and fetching weather...</p>
    </div>

    <div id="error-message" class="error-message" style="display: none;"></div>

    <div id="results" style="display: none;">
        <div class="weather-section">
            <h2><span class="emoji-icon">☀️</span> Your Current Weather</h2>
            <div class="detail-row">
                <p><span class="label">Location:</span> <span id="location-display" class="value"></span></p>
                <p><span class="label">Temperature:</span> <span id="temperature-display" class="value"></span></p>
                <p><span class="label">Feels Like:</span> <span id="feels-like-display" class="value"></span></p>
                <p><span class="label">Conditions:</span> <span id="conditions-display" class="value"></span></p>
            </div>
        </div>

        <div class="recommendation-section">
            <h2><span class="emoji-icon">👕</span> Wardrobe Recommendation</h2>
            <div class="detail-row">
                <p><span class="label">Layers:</span> <span id="layers-recommendation" class="value"></span></p>
                <p><span class="label">Special Items:</span> <span id="special-items-recommendation" class="value"></span></p>
            </div>
        </div>
    </div>

</div>

<style>
  /* Existing container and form styles from previous example */
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

  .info-text {
    font-size: 0.9em;
    margin-top: 5px; /* Adjust spacing */
    margin-bottom: 10px; /* Adjust spacing */
    text-align: left; /* Changed from right to left for better flow below input */
  }

  body > .container {
      margin-top: 20px;
      margin-bottom: 20px;
  }

  /* --- NEW STYLES FOR PRETTIER OUTPUT --- */
  #results {
      margin-top: 30px;
  }

  .weather-section, .recommendation-section {
      background-color: #fff;
      border: 1px solid #e0e0e0;
      border-radius: 8px; /* Slightly more rounded */
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05); /* Lighter shadow */
      padding: 20px 25px; /* More padding */
      margin-bottom: 25px; /* Space between sections */
  }
  .recommendation-section {
      margin-bottom: 0; /* No margin after the last section */
  }

  .emoji-icon {
      font-size: 1.3em; /* Larger emoji for heading */
      margin-right: 12px; /* More space */
  }

  .detail-row p {
      margin-bottom: 12px; /* More spacing between lines of data */
      font-size: 1.1em; /* Slightly larger text */
      display: flex; /* Use flex to align label and value */
      align-items: baseline; /* Align text baselines */
  }
  .detail-row p:last-child {
      margin-bottom: 0; /* No margin after the last line in a row */
  }

  .label {
      margin-right: 8px; /* Space between label and value */
      flex-shrink: 0; /* Prevent label from shrinking */
  }

  .value {
      word-break: break-word; /* Ensure long values wrap */
  }

  /* Specific emoji styling for special items in the list using ::before */
  .special-item-emoji {
      white-space: nowrap; /* Keep emoji and text together */
  }

  .special-item-umbrella::before { content: '☔ '; }
  .special-item-raincoat::before { content: '🧥 '; }
  .special-item-snow-boots::before { content: '👢 '; }
  .special-item-hat::before { content: '🧢 '; } /* You can choose 👒 or 🎩 */
  .special-item-gloves::before { content: '🧤 '; }
  .special-item-scarf::before { content: '🧣 '; }
  .special-item-sunscreen::before { content: '🧴 '; }
  .special-item-sunglasses::before { content: '🕶️ '; }
  .special-item-windbreaker::before { content: '🌬️ '; }
  .special-item-winter-coat::before { content: '🧥 '; } /* Generic coat emoji */
  .special-item-none::before { content: ''; } /* No emoji for 'None' */

</style>

<script>
    document.addEventListener('DOMContentLoaded', () => {
        const getRecommendationBtn = document.getElementById('get-recommendation-btn');
        const loadingDiv = document.getElementById('loading');
        const errorMessageDiv = document.getElementById('error-message');
        const resultsDiv = document.getElementById('results');

        const locationDisplay = document.getElementById('location-display');
        const temperatureDisplay = document.getElementById('temperature-display');
        const feelsLikeDisplay = document.getElementById('feels-like-display');
        const conditionsDisplay = document.getElementById('conditions-display');
        const layersRecommendation = document.getElementById('layers-recommendation');
        const specialItemsRecommendation = document.getElementById('special-items-recommendation');

        // Function to attempt to get user's location with fallbacks for accuracy
        async function getUserLocation() {
            return new Promise((resolve, reject) => {
                const optionsHighAccuracy = { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 };
                const optionsLowAccuracy = { enableHighAccuracy: false, timeout: 15000, maximumAge: 60000 }; // Accept cached up to 1 min

                navigator.geolocation.getCurrentPosition(
                    resolve,
                    (error) => {
                        // If high accuracy failed due to timeout or position unavailable, try low accuracy
                        if ((error.code === error.TIMEOUT || error.code === error.POSITION_UNAVAILABLE) && optionsHighAccuracy.enableHighAccuracy) {
                            console.warn("High accuracy timed out or unavailable, trying low accuracy...");
                            navigator.geolocation.getCurrentPosition(resolve, reject, optionsLowAccuracy);
                        } else {
                            reject(error); // Reject for other errors or if low accuracy also fails
                        }
                    },
                    optionsHighAccuracy
                );
            });
        }

        getRecommendationBtn.addEventListener('click', async () => {
            // Clear previous states
            errorMessageDiv.style.display = 'none';
            resultsDiv.style.display = 'none';
            loadingDiv.style.display = 'block';
            getRecommendationBtn.disabled = true;
            getRecommendationBtn.textContent = 'Getting Recommendation...';

            try {
                // 1. Get User Location (using the improved function)
                const position = await getUserLocation();
                const { latitude, longitude } = position.coords;

                // 2. Get Weather Data from Open-Meteo (no API key needed!)
                const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,precipitation,rain,showers,snowfall,weather_code,wind_speed_10m&temperature_unit=celsius&wind_speed_unit=ms&precipitation_unit=mm&forecast_days=1`;
                
                const weatherResponse = await fetch(weatherUrl);

                if (!weatherResponse.ok) {
                    throw new Error(`Failed to fetch weather data from Open-Meteo: ${weatherResponse.status} ${weatherResponse.statusText}`);
                }
                const weatherData = await weatherResponse.json();

                const tempCelsius = weatherData.current.temperature_2m;
                const feelsLikeCelsius = weatherData.current.apparent_temperature;
                const weatherCode = weatherData.current.weather_code;
                // const precipitationAmount = weatherData.current.precipitation; // Not used directly in current logic
                const windSpeed = weatherData.current.wind_speed_10m; // meters/second

                const displayLat = latitude.toFixed(4);
                const displayLon = longitude.toFixed(4);
                let displayLocation = `📍 Lat: ${displayLat}, Lon: ${displayLon}`;


                // --- Mapping Open-Meteo Weather Codes to Descriptions with Emojis ---
                let conditionsDescription = '';
                let isRaining = false;
                let isSnowing = false;

                switch(weatherCode) {
                    case 0: conditionsDescription = '☀️ Clear sky'; break;
                    case 1: conditionsDescription = '🌤️ Mainly clear'; break;
                    case 2: conditionsDescription = '⛅ Partly cloudy'; break;
                    case 3: conditionsDescription = '☁️ Overcast'; break;
                    case 45: conditionsDescription = '🌫️ Fog'; break;
                    case 48: conditionsDescription = '🌫️ Depositing rime fog'; break;
                    case 51: conditionsDescription = '💧 Drizzle: Light'; isRaining = true; break;
                    case 53: conditionsDescription = '🌧️ Drizzle: Moderate'; isRaining = true; break;
                    case 55: conditionsDescription = '🌧️ Drizzle: Dense intensity'; isRaining = true; break;
                    case 56: conditionsDescription = '🥶💧 Freezing Drizzle: Light'; isRaining = true; break;
                    case 57: conditionsDescription = '🥶🌧️ Freezing Drizzle: Dense intensity'; isRaining = true; break;
                    case 61: conditionsDescription = '☔ Rain: Slight'; isRaining = true; break;
                    case 63: conditionsDescription = '🌧️ Rain: Moderate'; isRaining = true; break;
                    case 65: conditionsDescription = '🌧️ Heavy intensity rain'; isRaining = true; break;
                    case 66: conditionsDescription = '🥶☔ Freezing Rain: Light'; isRaining = true; break;
                    case 67: conditionsDescription = '🥶🌧️ Freezing Rain: Heavy intensity'; isRaining = true; break;
                    case 71: conditionsDescription = '🌨️ Snow fall: Slight'; isSnowing = true; break;
                    case 73: conditionsDescription = '❄️ Snow fall: Moderate'; isSnowing = true; break;
                    case 75: conditionsDescription = '🌨️ Heavy intensity snow'; isSnowing = true; break;
                    case 77: conditionsDescription = '🧊 Snow grains'; isSnowing = true; break;
                    case 80: conditionsDescription = '🌦️ Rain showers: Slight'; isRaining = true; break;
                    case 81: conditionsDescription = '🌧️ Rain showers: Moderate'; isRaining = true; break;
                    case 82: conditionsDescription = '⛈️ Rain showers: Violent'; isRaining = true; break;
                    case 85: conditionsDescription = '🌨️ Snow showers: Slight'; isSnowing = true; break;
                    case 86: conditionsDescription = '❄️ Snow showers: Heavy'; isSnowing = true; break;
                    case 95: conditionsDescription = '⚡ Thunderstorm: Slight or moderate'; break;
                    case 96: conditionsDescription = '⛈️ Thunderstorm with slight hail'; break;
                    case 99: conditionsDescription = '⛈️ Thunderstorm with heavy hail'; break;
                    default: conditionsDescription = '❓ Unknown conditions'; break;
                }
                // --- End Weather Code Mapping ---

                // 3. Clothing Recommendation Logic
                let layers = '';
                let specialItemsArray = []; // Array of objects { text: 'Item Name', class: 'css-class' }

                if (feelsLikeCelsius < -10) {
                    layers = '🥶 Very cold! 4+ layers (thermal base, mid-layer, fleece, heavy winter coat).';
                    specialItemsArray.push({ text: 'Warm hat', class: 'special-item-hat' }, { text: 'Gloves/Mittens', class: 'special-item-gloves' }, { text: 'Scarf', class: 'special-item-scarf' }, { text: 'Winter boots', class: 'special-item-snow-boots' });
                } else if (feelsLikeCelsius >= -10 && feelsLikeCelsius < 0) {
                    layers = '❄️ Cold! 3-4 layers (long-sleeve base, sweater/fleece, warm jacket).';
                    specialItemsArray.push({ text: 'Hat', class: 'special-item-hat' }, { text: 'Gloves', class: 'special-item-gloves' }, { text: 'Scarf', class: 'special-item-scarf' });
                } else if (feelsLikeCelsius >= 0 && feelsLikeCelsius < 10) {
                    layers = '🌬️ Chilly! 2-3 layers (long-sleeve shirt, light sweater or jacket).';
                    specialItemsArray.push({ text: 'Light hat or beanie', class: 'special-item-hat' });
                } else if (feelsLikeCelsius >= 10 && feelsLikeCelsius < 20) {
                    layers = '🍃 Mild! 1-2 layers (t-shirt, light jacket or cardigan).';
                } else if (feelsLikeCelsius >= 20 && feelsLikeCelsius < 25) {
                    layers = '☀️ Warm! 1 layer (t-shirt or light top).';
                    specialItemsArray.push({ text: 'Sunscreen', class: 'special-item-sunscreen' }, { text: 'Sunglasses', class: 'special-item-sunglasses' });
                } else { // >= 25 C
                    layers = '🔥 Hot! Minimal clothing (light t-shirt, shorts/skirt).';
                    specialItemsArray.push({ text: 'Sunscreen', class: 'special-item-sunscreen' }, { text: 'Sunglasses', class: 'special-item-sunglasses' }, { text: 'Hat', class: 'special-item-hat' });
                }

                if (isRaining) {
                    specialItemsArray.push({ text: 'Umbrella', class: 'special-item-umbrella' }, { text: 'Raincoat', class: 'special-item-raincoat' });
                }
                if (isSnowing) {
                    specialItemsArray.push({ text: 'Snow boots', class: 'special-item-snow-boots' }, { text: 'Heavy winter coat', class: 'special-item-winter-coat' }, { text: 'Waterproof gloves', class: 'special-item-gloves' });
                    if (!specialItemsArray.some(item => item.text === 'Warm hat')) specialItemsArray.push({ text: 'Warm hat', class: 'special-item-hat' });
                }
                if (windSpeed > 10) { // Example threshold for strong wind in m/s (~36 km/h or 22 mph)
                    specialItemsArray.push({ text: 'Windbreaker', class: 'special-item-windbreaker' });
                }
                
                // Filter out duplicates based on text content (after adding all possibilities)
                const uniqueSpecialItems = Array.from(new Set(specialItemsArray.map(item => JSON.stringify(item))))
                    .map(item => JSON.parse(item));


                // 4. Display Results
                locationDisplay.textContent = displayLocation;
                temperatureDisplay.textContent = `${tempCelsius.toFixed(1)}°C`;
                feelsLikeDisplay.textContent = `${feelsLikeCelsius.toFixed(1)}°C`;
                conditionsDisplay.textContent = conditionsDescription; 
                layersRecommendation.textContent = layers;

                if (uniqueSpecialItems.length > 0) {
                    // Construct HTML string with spans for each item to apply CSS emojis
                    specialItemsRecommendation.innerHTML = uniqueSpecialItems.map(item => 
                        `<span class="special-item-emoji ${item.class}">${item.text}</span>`
                    ).join(', ');
                } else {
                    specialItemsRecommendation.textContent = 'None';
                }

                resultsDiv.style.display = 'block';

            } catch (error) {
                console.error('Error:', error);
                let userFriendlyError = 'An unexpected error occurred.';
                if (error.code === error.PERMISSION_DENIED) {
                    userFriendlyError = 'Location access denied. Please enable location services in your browser/device settings.';
                } else if (error.code === error.TIMEOUT || error.code === error.POSITION_UNAVAILABLE) {
                    userFriendlyError = 'Could not determine your location within a reasonable time. Please check your internet connection and try again.';
                } else {
                    userFriendlyError = error.message || userFriendlyError;
                }
                showError(userFriendlyError);
            } finally {
                loadingDiv.style.display = 'none';
                getRecommendationBtn.disabled = false;
                getRecommendationBtn.textContent = 'Get My Wardrobe Recommendation';
            }
        });

        function showError(message) {
            errorMessageDiv.textContent = message;
            errorMessageDiv.style.display = 'block';
        }
    });
</script>
