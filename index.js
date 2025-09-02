// index.js
// This script fetches weather data from the OpenWeatherMap API and updates the UI accordingly.
// It allows users to search for a city and view the current weather conditions, including temperature, humidity, pressure, wind speed, and weather description.
// It also provides functionality to switch between Celsius and Fahrenheit temperature units.
// The API key and base URL for the OpenWeatherMap API are defined at the beginning of the script.
// The script also includes event listeners for user interactions, such as clicking the search button, pressing

const apiKey = "0fb92c3562b1cbbe6aeddb73eaaa63a5";
const apiUrl =
  "https://api.openweathermap.org/data/2.5/weather?units=metric&q="; // This is the base URL for the OpenWeatherMap API. It includes the API key and specifies that the temperature should be in metric units (Celsius)

// Format the date and time for display

function refreshTime() {
  const getDay = new Date().getDate(); // Get the current day of the month
  const getMonth = new Date().getMonth() + 1; // Get the current month
  const getYear = new Date().getFullYear(); // Get the current year
  const getHours = new Date().getHours(); // Get the current hour
  const getMinutes = new Date().getMinutes(); // Get the current minutes
  const getSeconds = new Date().getSeconds(); // Get the current seconds
  // const getMilliseconds = new Date().getMilliseconds(); // Get the current milliseconds
  const formattedDate = `${getDay}/${getMonth}/${getYear} ${getHours}:${getMinutes}:${getSeconds}`; // Format the date and time as a string
  document.querySelector(".date").innerText = formattedDate; // Display the formatted date and time
}
setInterval(refreshTime, 100);

// Initialize variables to store weather data
// let sunriseTime = null;
// let sunsetTime = null;
let isCelsius = true; // Initialize temperature values. These will be updated when the weather data is fetched
let celsiusValue = null;
let fahrenheitValue = null; // Fahrenheit value will be calculated based on the Celsius value
let degree = null; // Wind direction in degrees
let description = ""; // Default weather description, will be updated with actual data
let weatherCondition = ""; // Default weather condition, will be updated with actual data
const clearBtn = document.getElementById("clearBtn");
const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const tempElement = document.querySelector(".temp");
const celsiusElement = document.querySelector(".celsius");
const fahrenheitElement = document.querySelector(".fahrenheit");

async function checkWeather(city) {
  const response = await fetch(apiUrl + city + `&appid=${apiKey}`);
  var data = await response.json();

  if (searchBox.value == "") {
    alert("Please enter a city name");
    return;
  }
  if (data.cod == "404") {
    alert("City not found");
    return;
  }
  console.log(data);
  let sunriseTime = data.sys.sunrise;
  let sunsetTime = data.sys.sunset;
  let visibility = data.visibility / 1000;
  let maxTemp = Math.round(data.main.temp_max);
  let minTemp = Math.round(data.main.temp_min);
  //Convert Unix time to readable time
  const convertTimestamp = (timeStamp_1, timeStamp_2) => {
    var sunrise = new Date(parseInt(timeStamp_1 * 1000));
    var sunset = new Date(parseInt(timeStamp_2 * 1000));

    const sunRiseTime = sunrise.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const sunSetTime = sunset.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    return { sunrise: sunRiseTime, sunset: sunSetTime };
  };
  const times = convertTimestamp(sunriseTime, sunsetTime);
  console.log(times.sunrise, times.sunset);

  document.querySelector(".ground-level").innerText =
    "Ground-Level: " + data.main.grnd_level + "m";
  document.querySelector(".sea-level").innerText =
    "Sea-Level: " + data.main.sea_level + "m";
  document.querySelector(".max-temp").innerText = "Max-Temp: " + maxTemp + " °C";
  document.querySelector(".min-temp").innerText = "Min-Temp: " + minTemp + " °C";
  document.querySelector(".visibility").innerText =
    "Visibility: " + visibility + " KM";
  document.querySelector(".timeRise").innerText = times.sunrise;
  document.querySelector(".timeSet").innerText = times.sunset;
  weatherCondition = data.weather[0].main; // Get the main weather condition (e.g., Clear, Clouds, Rain)
  console.log("Weather condition:", weatherCondition);

  // Example usage after fetching weather:
  setWeatherBackground(weatherCondition);

  celsiusValue = Math.round(data.main.temp);
  fahrenheitValue = Math.round((celsiusValue * 9) / 5 + 32);
  tempElement.innerText = celsiusValue; // Initialize with Celsius value
  isCelsius = true; // Track the current temperature unit
  // celsiusElement.style.color = "white"; // Set Celsius to active color
  // fahrenheitElement.style.color = "#b3babfff"; // Set Fahrenheit to inactive color
  degree = data.wind.deg; // Get the wind direction in degrees
  console.log("Wind direction in degrees:", degree);
  description = data.weather[0].description; // Get the weather description

  document.querySelector(".city-name").innerText =
    data.name + ", " + data.sys.country;
  // document.querySelector(".temp").innerText = Math.round(data.main.temp) + "";
  document.querySelector(".humidity").innerText =
    "Humidity: " + data.main.humidity + "%";
  document.querySelector(".humidity-1").innerText =
    "Humidity: " + data.main.humidity + "%";
  document.querySelector(".feels-like").innerText =
    "Feels Like: " + Math.round(data.main.feels_like) + "°C";
  document.querySelector(".pressure").innerText =
    "Pressure: " + data.main.pressure + " Mb";
  document.querySelector(".wind").innerText =
    "Wind Speed: " +
    data.wind.speed +
    " km/hr" +
    " (" +
    getDirectonWind(degree) +
    ")";

  document.querySelector(".weather-description").innerText =
    description.charAt(0).toUpperCase() + description.slice(1); // Capitalize the first letter of the description
  document.querySelector(".cloud").innerText =
    "Clouds cover: " + data.clouds.all + "%";

  if (data.weather[0].main == "Clouds") {
    document.querySelector(".weather-icon").src = "images/images/Cloudy.gif";
    // document.querySelector(".card").style.backgroundColor = "#8a895bff";
  } else if (data.weather[0].main == "Clear") {
    document.querySelector(".weather-icon").src = "images/images/Weather-sunny.gif";
    // document.querySelector(".card").style.backgroundColor = "#d2b929ff";
  } else if (data.weather[0].main == "Drizzle") {
    document.querySelector(".weather-icon").src = "images/images/drizzle.png";
    // document.querySelector(".card").style.backgroundColor = "#306066ff";
  } else if (data.weather[0].main == "Mist") {
    document.querySelector(".weather-icon").src = "images/images/Weather-mist.gif";
    // document.querySelector(".card").style.backgroundColor = "#37193cff";
  } else if (data.weather[0].main == "Rain") {
    document.querySelector(".weather-icon").src = "images/images/Rainy.gif";
    // document.querySelector(".card").style.backgroundColor = "#34abbdff";
  } else {
    document.querySelector(".weather-icon").src = "images/images/Weahter-snow.";
    // document.querySelector(".card").style.backgroundColor = "#d5e9ecff";
  }
}
searchBtn.addEventListener("click", () => {
  const city = searchBox.value;
  checkWeather(city);
});
searchBox.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    console.log("Enter pressed, calling checkWeather");
    const city = searchBox.value;
    checkWeather(city);
  }
});

searchBox.addEventListener("input", () => {
  if (searchBox.value !== "") {
    clearBtn.style.display = "block";
  } else {
    clearBtn.style.display = "none";
  }
});

clearBtn.addEventListener("click", () => {
  searchBox.value = ""; // Clear the input field

  clearBtn.style.display = "none"; // Hide the clear button after clearing
});

fahrenheitElement.addEventListener("click", () => {
  if (!isCelsius || celsiusValue === null) return; // If already in Fahrenheit, do nothing
  isCelsius = false; // Switch to Fahrenheit
  fahrenheitElement.style.color = "white";
  celsiusElement.style.color = "#b3babfff";
  tempElement.innerText = fahrenheitValue;
  // alert("Temperature is now in Fahrenheit");
  console.log("Temperature is now in Fahrenheit");
  console.log("Fahrenheit value:", fahrenheitValue);
});
celsiusElement.addEventListener("click", () => {
  if (isCelsius || celsiusValue === null) return; // If already in Celsius, do nothing
  isCelsius = true; // Switch to Celsius
  celsiusElement.style.color = "white";
  fahrenheitElement.style.color = "#b3babfff";
  tempElement.innerText = celsiusValue;
  // alert("Temperature is now in Celsius");
  console.log("Temperature is now in Celsius");
  console.log("Celsius value:", celsiusValue);
});

function getDirectonWind(deg) {
  if (deg >= 0 && deg < 45) {
    return "Northeast";
  } else if (deg >= 45 && deg < 90) {
    return "East";
  } else if (deg >= 90 && deg < 135) {
    return "Southeast";
  } else if (deg >= 135 && deg < 180) {
    return "South";
  } else if (deg >= 180 && deg < 225) {
    return "Southwest";
  } else if (deg >= 225 && deg < 270) {
    return "West";
  } else if (deg >= 270 && deg < 315) {
    return "Northwest";
  } else {
    return "North";
  }
}
getDirectonWind(degree); // Example usage of getDirectonWind function
// This function takes a degree value and returns the corresponding wind direction as a string
console.log(getDirectonWind(degree));

// Function to set the background based on weather condition
// This function updates the background of the weather card based on the current weather condition
function setWeatherBackground(condition) {
  const bg = document.getElementById("weather-bg");

  // Remove only old weather classes
  bg.classList.remove("clear-day", "clouds", "rain", "snow", "thunderstorm");

  // Add the new one based on condition
  switch (condition.toLowerCase()) {
    case "clear":
      bg.classList.add("clear-day");
      break;
    case "clouds":
      bg.classList.add("clouds");
      break;
    case "rain":
    case "drizzle":
      bg.classList.add("rain");
      document.querySelector(".rain-container").display = "show";
      break;
    case "snow":
      bg.classList.add("snow");
      break;
    case "thunderstorm":
      bg.classList.add("thunderstorm");
      break;
    default:
      bg.classList.add("clear-day");
  }
}

const toggleButton = document.getElementById("theme-toggle");
const root = document.documentElement;

toggleButton.addEventListener("click", () => {
  const currentTheme = root.getAttribute("data-theme");
  const newTheme = currentTheme === "light" ? "dark" : "light";
  root.setAttribute("data-theme", newTheme);

  // Change icon for fun
  toggleButton.textContent = newTheme === "light" ? "🌞" : "🌙";
});

// const rainContainer = document.querySelector(".rain-container");

// const createDrop = function () {
//   const drop = document.createElement("div");
//   drop.classList.add("raindrop");

//   // Random horizontal position
//   drop.style.left = Math.random() * window.innerWidth + "px";

//   // Random length & speed
//   const length = Math.random() * 20 + 10; // 10-30px
//   drop.style.height = length + "px";
//   const duration = Math.random() * 1 + 0.5; // 0.5 - 1.5s
//   drop.style.animationDuration = duration + "s";

//   // When animation ends → remove drop + make splash
//   drop.addEventListener("animationend", () => {
//     drop.remove();
//     createSplash(parseFloat(drop.style.left));
//   });

//   rainContainer.appendChild(drop);
// };

// // Create splash at drop position
// const createSplash = function (x) {
//   const splash = document.createElement("div");
//   splash.classList.add("splash");
//   splash.style.left = x - 4 + "px"; // center splash
//   splash.style.bottom = "0px";
//   rainContainer.appendChild(splash);

//   splash.addEventListener("animationend", () => splash.remove());
// };

// Continuous rain
// setInterval(() => {
//   for (let i = 0; i < 3; i++) {
//     // 3 drops per tick
//     createDrop();
//   }
// }, 50);

// const timeTable = {
//   timeZone: timezone;

// }
console.log("Hello, World!");
