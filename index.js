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
  console.log(data);
  document.querySelector(".city-name").innerText = "Weather in " + data.name;
  document.querySelector(".temp").innerText = Math.round(data.main.temp) + "°C";
  document.querySelector(".humidity").innerText =
    "Humidity: " + data.main.humidity + "%";

  document.querySelector(".wind").innerText = data.wind.speed + " km/hr";
  if (data.weather[0].main == "Clouds") {
    document.querySelector(".weather-icon").src = "images/images/clouds.png";
  } else if (data.weather[0].main == "Clear") {
    document.querySelector(".weather-icon").src = "images/images/clear.png";
  } else if (data.weather[0].main == "Drizzle") {
    document.querySelector(".weather-icon").src = "images/images/drizzle.png";
  } else if (data.weather[0].main == "Mist") {
    document.querySelector(".weather-icon").src = "images/images/mist.png";
  } else if (data.weather[0].main == "Rain") {
    document.querySelector(".weather-icon").src = "images/images/rain.png";
  } else {
    document.querySelector(".weather-icon").src = "images/images/snow.png";
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
