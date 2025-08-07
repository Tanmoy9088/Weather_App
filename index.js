const apiKey = "0fb92c3562b1cbbe6aeddb73eaaa63a5";
const apiUrl =
  "https://api.openweathermap.org/data/2.5/weather?units=metric&q="; // This is the base URL for the OpenWeatherMap API. It includes the API key and specifies that the temperature should be in metric units (Celsius

let isCelsius = true; // Initialize temperature values. These will be updated when the weather data is fetched
let celsiusValue = null;
let fahrenheitValue = null;

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

  celsiusValue = Math.round(data.main.temp);
  fahrenheitValue = Math.round((celsiusValue * 9) / 5 + 32);
  tempElement.innerText = celsiusValue; // Initialize with Celsius value
  isCelsius = true; // Track the current temperature unit
  // celsiusElement.style.color = "white"; // Set Celsius to active color
  // fahrenheitElement.style.color = "#b3babfff"; // Set Fahrenheit to inactive color
  
  document.querySelector(".city-name").innerText = "Weather in " + data.name;
  // document.querySelector(".temp").innerText = Math.round(data.main.temp) + "";
  document.querySelector(".humidity").innerText =
    "Humidity: " + data.main.humidity + "%";
  document.querySelector(".humidity-1").innerText =
    "Humidity: " + data.main.humidity + "%";
  document.querySelector(".feels-like").innerText =
    "Feels Like: " + Math.round(data.main.feels_like) + "°C";
  document.querySelector(".pressure").innerText =
    "Pressure: " + data.main.pressure + "mb";
  document.querySelector(".wind").innerText = data.wind.speed + " km/hr";
  document.querySelector(".weather-description").innerText =
    data.weather[0].description;
  data.weather[0].description;
  if (data.weather[0].main == "Clouds") {
    document.querySelector(".weather-icon").src = "images/images/clouds.png";
    document.querySelector(".card").style.backgroundColor = "#8a895bff";
  } else if (data.weather[0].main == "Clear") {
    document.querySelector(".weather-icon").src = "images/images/clear.png";
    document.querySelector(".card").style.backgroundColor = "#e3cd50ff";
  } else if (data.weather[0].main == "Drizzle") {
    document.querySelector(".weather-icon").src = "images/images/drizzle.png";
    document.querySelector(".card").style.backgroundColor = "#306066ff";
  } else if (data.weather[0].main == "Mist") {
    document.querySelector(".weather-icon").src = "images/images/mist.png";
    document.querySelector(".card").style.backgroundColor = "#37193cff";
  } else if (data.weather[0].main == "Rain") {
    document.querySelector(".weather-icon").src = "images/images/rain.png";
    document.querySelector(".card").style.backgroundColor = "#30a54bff";
  } else {
    document.querySelector(".weather-icon").src = "images/images/snow.png";
    document.querySelector(".card").style.backgroundColor = "#d5e9ecff";
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

console.log("Hello, World!");
