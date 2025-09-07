// weather-forecast.js - Ready to use in any HTML file

// Complete 7-Day Weather Forecast Implementation
class WeatherForecast {
  constructor() {
    this.baseUrl = "https://api.open-meteo.com/v1/forecast";
  }

  // Get 7-day forecast for coordinates
  async getForecast(latitude, longitude, cityName = "") {
    try {
      const url = `${this.baseUrl}?latitude=${latitude}&longitude=${longitude}&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max,winddirection_10m_dominant,sunrise,sunset&hourly=temperature_2m,relativehumidity_2m,weathercode&timezone=auto&forecast_days=7`;

      const response = await fetch(url);
      if (!response.ok) throw new Error("Weather data fetch failed");

      const data = await response.json();

      return this.formatForecastData(data, cityName);
    } catch (error) {
      console.error("Error fetching forecast:", error);
      throw error;
    }
  }

  // Format the forecast data for display
  formatForecastData(data, cityName) {
    const daily = data.daily;
    const forecast = [];

    for (let i = 0; i < daily.time.length; i++) {
      forecast.push({
        date: daily.time[i],
        dayName: this.getDayName(daily.time[i]),
        weatherCode: daily.weathercode[i],
        weatherDescription: this.getWeatherDescription(daily.weathercode[i]),
        weatherIcon: this.getWeatherIcon(daily.weathercode[i]),
        maxTemp: Math.round(daily.temperature_2m_max[i]),
        minTemp: Math.round(daily.temperature_2m_min[i]),
        precipitation: daily.precipitation_sum[i],
        windSpeed: Math.round(daily.windspeed_10m_max[i]),
        windDirection: daily.winddirection_10m_dominant[i],
        sunrise: this.formatTime(daily.sunrise[i]),
        sunset: this.formatTime(daily.sunset[i]),
      });
    }

    return {
      city: cityName,
      timezone: data.timezone,
      forecast: forecast,
      units: {
        temperature: data.daily_units.temperature_2m_max,
        precipitation: data.daily_units.precipitation_sum,
        windSpeed: data.daily_units.windspeed_10m_max,
      },
    };
  }

  // Get city coordinates using OpenStreetMap Nominatim (free)
  async getCityCoordinates(cityName) {
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        cityName
      )}&limit=1`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.length > 0) {
        return {
          latitude: parseFloat(data[0].lat),
          longitude: parseFloat(data[0].lon),
          displayName: data[0].display_name,
        };
      }
      throw new Error("City not found");
    } catch (error) {
      console.error("Error fetching coordinates:", error);
      throw error;
    }
  }

  // Get weather forecast by city name
  async getForecastByCity(cityName) {
    try {
      const coordinates = await this.getCityCoordinates(cityName);
      return await this.getForecast(
        coordinates.latitude,
        coordinates.longitude,
        coordinates.displayName.split(",")[0]
      );
    } catch (error) {
      console.error("Error getting forecast by city:", error);
      throw error;
    }
  }

  // Helper methods
  getDayName(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    } else {
      return date.toLocaleDateString("en-US", { weekday: "long" });
    }
  }

  getWeatherDescription(code) {
    const weatherCodes = {
      0: "Clear sky",
      1: "Mainly clear",
      2: "Partly cloudy",
      3: "Overcast",
      45: "Fog",
      48: "Depositing rime fog",
      51: "Light drizzle",
      53: "Moderate drizzle",
      55: "Dense drizzle",
      61: "Slight rain",
      63: "Moderate rain",
      65: "Heavy rain",
      71: "Slight snow",
      73: "Moderate snow",
      75: "Heavy snow",
      80: "Slight rain showers",
      81: "Moderate rain showers",
      82: "Violent rain showers",
      95: "Thunderstorm",
      96: "Thunderstorm with slight hail",
      99: "Thunderstorm with heavy hail",
    };
    return weatherCodes[code] || "Unknown";
  }

  getWeatherIcon(code) {
    const iconMap = {
      0: "☀️",
      1: "🌤️",
      2: "⛅",
      3: "☁️",
      45: "🌫️",
      48: "🌫️",
      51: "🌦️",
      53: "🌦️",
      55: "🌦️",
      61: "🌧️",
      63: "🌧️",
      65: "🌧️",
      71: "🌨️",
      73: "🌨️",
      75: "🌨️",
      80: "🌦️",
      81: "🌧️",
      82: "⛈️",
      95: "⛈️",
      96: "⛈️",
      99: "⛈️",
    };
    return iconMap[code] || "🌍";
  }

  formatTime(dateTimeString) {
    return new Date(dateTimeString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }
}

// Initialize weather API
const weatherAPI = new WeatherForecast();

// Main functions to use in your app
async function getForecastByCity(cityName) {
  try {
    console.log(`Getting forecast for: ${cityName}`);
    const forecast = await weatherAPI.getForecastByCity(cityName);
    displayForecast(forecast);
    return forecast;
  } catch (error) {
    console.error("Failed to get forecast:", error);
    displayError("Failed to fetch weather data. Please try again.");
    return null;
  }
}

async function getForecastByCoordinates(lat, lon, cityName = "") {
  try {
    const forecast = await weatherAPI.getForecast(lat, lon, cityName);
    displayForecast(forecast);
    return forecast;
  } catch (error) {
    console.error("Failed to get forecast:", error);
    displayError("Failed to fetch weather data. Please try again.");
    return null;
  }
}

// Display forecast in your HTML
function displayForecast(forecastData) {
  console.log("7-Day Forecast for:", forecastData.city);

  // Clear any previous errors
  const errorElement = document.querySelector("#error-message");
  if (errorElement) errorElement.style.display = "none";

  forecastData.forecast.forEach((day, index) => {
    console.log(
      `${day.dayName}: ${day.weatherIcon} ${day.weatherDescription}, ${day.maxTemp}°/${day.minTemp}°C`
    );

    // Update individual day elements (if you have them)
    const dayElement = document.querySelector(`#day-${index}`);
    if (dayElement) {
      dayElement.innerHTML = `
        <div class="forecast-day">
          <h3>${day.dayName}</h3>
          <div class="weather-icon">${day.weatherIcon}</div>
          <div class="weather-desc">${day.weatherDescription}</div>
          <div class="temps">
            <span class="max-temp">${day.maxTemp}°</span>
            <span class="min-temp">${day.minTemp}°</span>
          </div>
          <div class="details">
            <span>💧 ${day.precipitation}mm</span>
            <span>💨 ${day.windSpeed}km/h</span>
          </div>
        </div>
      `;
    }
  });

  // Update forecast container (if you have one)
  const forecastContainer = document.querySelector("#forecast-container");
  if (forecastContainer) {
    forecastContainer.innerHTML = "";
    forecastData.forecast.forEach((day, index) => {
      const dayDiv = document.createElement("div");
      dayDiv.className = "forecast-item";
      dayDiv.innerHTML = `
        <div class="forecast-day">
          <h4>${day.dayName}</h4>
          <div class="weather-icon" style="font-size: 2rem;">${day.weatherIcon}</div>
          <p class="weather-desc">${day.weatherDescription}</p>
          <div class="temperature-range">
            <span class="max-temp">${day.maxTemp}°C</span> / 
            <span class="min-temp">${day.minTemp}°C</span>
          </div>
          <div class="weather-details">
            <small>💧 ${day.precipitation}mm | 💨 ${day.windSpeed}km/h</small>
          </div>
        </div>
      `;
      forecastContainer.appendChild(dayDiv);
    });
  }
}

function displayError(message) {
  console.error(message);
  const errorElement = document.querySelector("#error-message");
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.style.display = "block";
  } else {
    alert(message); // Fallback if no error element
  }
}

// Auto-initialize when DOM is ready
document.addEventListener("DOMContentLoaded", function () {
  console.log("Weather forecast script loaded");

  // Setup search functionality
  const searchButton = document.querySelector("#search-btn");
  const cityInput = document.querySelector("#city-input");

  if (searchButton && cityInput) {
    searchButton.addEventListener("click", async () => {
      const cityName = cityInput.value.trim();
      if (cityName) {
        await getForecastByCity(cityName);
      } else {
        displayError("Please enter a city name");
      }
    });

    cityInput.addEventListener("keypress", async (e) => {
      if (e.key === "Enter") {
        const cityName = cityInput.value.trim();
        if (cityName) {
          await getForecastByCity(cityName);
        }
      }
    });
  }

  // Get user's location forecast on load (optional)
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        await getForecastByCoordinates(latitude, longitude, "Your Location");
      },
      (error) => {
        console.log("Geolocation not available:", error);
        // Default to a major city
        getForecastByCity("New York");
      }
    );
  }
});

// Make functions available globally (optional)
window.getForecastByCity = getForecastByCity;
window.getForecastByCoordinates = getForecastByCoordinates;
window.weatherAPI = weatherAPI;
