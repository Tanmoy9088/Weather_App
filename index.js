const apiKey = "0fb92c3562b1cbbe6aeddb73eaaa63a5";
const apiUrl =
  "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
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

  document.querySelector(".city-name").innerText = "Weather in " + data.name;
  document.querySelector(".temp").innerText = Math.round(data.main.temp) + "°C";
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

console.log("Hello, World!");
