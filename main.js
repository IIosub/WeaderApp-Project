// API key and default city
const apiKey = "04bde8cc7f569f7c5603cdbc6deb89a3";
const defaultCity = "London";
const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// Function to format date and time from Unix timestamp
function formatDateAndTime(unixTimestamp) {
  const date = new Date(unixTimestamp * 1000);

  let hour = date.getHours();
  if (hour < 10) {
    hour = `0${hour}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  const day = days[date.getDay()];

  return `${day} ${hour}:${minutes}`;
}

// Function to get day from Unix timestamp
function getDayFromDate(unixTimestamp) {
  const date = new Date(unixTimestamp * 1000);

  return days[date.getDay()];
}

// Celsius temperature variable
let celsiusTemp = undefined;

// Event listener for Fahrenheit button
const fahrenheitTempButton = document.querySelector("#fahrenheit-unit");
fahrenheitTempButton.addEventListener("click", convertToFahrenheit);

// Event listener for Celsius button
const celsiusTempButton = document.querySelector("#celsius-unit");
celsiusTempButton.addEventListener("click", convertToCelsius);

// Function to convert temperature to Fahrenheit
function convertToFahrenheit(event) {
  event.preventDefault();

  const fahrenheitTemp = (celsiusTemp * 9) / 5 + 32;
  const temperatureElement = document.querySelector(".temperature");
  temperatureElement.innerHTML = Math.round(fahrenheitTemp);
}

// Function to convert temperature to Celsius
function convertToCelsius(event) {
  event.preventDefault();

  const temperatureElement = document.querySelector(".temperature");
  temperatureElement.innerHTML = Math.round(celsiusTemp);
}

// API request for the default city
const builtInGeocodingApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${defaultCity}&appid=${apiKey}&units=metric`;

// Fetch API request for default city
fetch(builtInGeocodingApiUrl)
  .then((response) => response.json())
  .then(handleSearchResponse)
  .catch((error) => console.error("Error fetching data:", error));

// Function to handle the response from the API request
function handleSearchResponse(data) {
  celsiusTemp = Math.round(data.main.temp);

  // Updating DOM elements with weather information
  const iconElement = document.querySelector("#icon");
  iconElement.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
  );

  const temperature = Math.round(data.main.temp);
  const temperatureElement = document.querySelector(".temperature");
  temperatureElement.innerHTML = temperature;

  const cityElement = document.querySelector("h1");
  cityElement.innerHTML = data.name;

  const description = data.weather[0].description;
  const descriptionElement = document.querySelector("#weather-description");
  descriptionElement.innerHTML = description;

  const windSpeedDisplay = document.querySelector("#wind");
  windSpeedDisplay.innerHTML = `Wind Speed: ${Math.round(data.wind.speed)} m/h`;

  const humidityDisplay = document.querySelector("#humidity");
  humidityDisplay.innerHTML = ` Humidity: ${data.main.humidity} %`;

  const pressureDisplay = document.querySelector("#pressure");
  pressureDisplay.innerHTML = `Pressure: ${data.main.pressure} hPA`;

  let dateElement = document.querySelector("#date");
  dateElement.innerHTML = formatDateAndTime(data.dt);

  getWeeklyForecast(data.coord);
}

// Event listener for the search button
const searchButton = document.querySelector("#search-button");
searchButton.addEventListener("click", getSearchCityTemp);

// Function to get temperature for the searched city
function getSearchCityTemp(event) {
  event.preventDefault();

  const cityInput = document.querySelector("#city-input");
  const builtInGeocodingApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput.value}&appid=${apiKey}&units=metric`;

  // Fetch API request for searched city
  fetch(builtInGeocodingApiUrl)
    .then((response) => response.json())
    .then(handleSearchResponse)
    .catch((error) => console.error("Error fetching data:", error));
}

// Event listener for the current location button
const currentLocationButton = document.querySelector("#current-button");
currentLocationButton.addEventListener("click", getCurrentCityAndTemp);

// Function to get temperature for the current location
function getCurrentCityAndTemp(event) {
  event.preventDefault();

  navigator.geolocation.getCurrentPosition(retrieveCurrentLocationWeather);
}

// Function to retrieve weather for the current location
function retrieveCurrentLocationWeather(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
  const currentWeatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?appid=${apiKey}&lon=${lon}&lat=${lat}&units=metric`;

  // Fetch API request for current location
  fetch(currentWeatherApiUrl)
    .then((response) => response.json())
    .then(handleSearchResponse)
    .catch((error) => console.error("Error fetching data:", error));
}

// Function to get the weekly forecast
function getWeeklyForecast(coordinates) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;

  // Fetch API request for weekly forecast
  fetch(apiUrl)
    .then((response) => response.json())
    .then(displayWeeklyForecast)
    .catch((error) => console.error("Error fetching data:", error));
}

// Function to display the weekly forecast
function displayWeeklyForecast(data) {
  const forecast = data.daily;
  const weeklyForecast = document.querySelector("#weekly-forecast");
  let forecastHTML = `<div class="row">`;

  forecast.forEach(function (forecastDay) {
    forecastHTML =
      forecastHTML +
      `<div class="col-2">
        <div class="week-date">${getDayFromDate(forecastDay.dt)}</div>
        <img src="https://openweathermap.org/img/wn/${
          forecastDay.weather[0].icon
        }@2x.png" alt="" width="60">
        <div class="day-temperature">
          <span class="max-temp">${Math.round(
            forecastDay.temp.max
          )}°</span> / <span class="min-temp">${Math.round(
        forecastDay.temp.min
      )}°</span>
        </div>
      </div>`;
  });

  forecastHTML = forecastHTML + `</div>`;
  weeklyForecast.innerHTML = forecastHTML;
}
