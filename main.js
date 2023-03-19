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

function getDayFromDate(unixTimestamp) {
  const date = new Date(unixTimestamp * 1000);

  return days[date.getDay()];
}

let celsiusTemp = undefined;
const fahrenheitTempButton = document.querySelector("#fahrenheit-unit");
fahrenheitTempButton.addEventListener("click", convertToFahrenheit);
const celsiusTempButton = document.querySelector("#celsius-unit");
celsiusTempButton.addEventListener("click", convertToCelsius);

function convertToFahrenheit(event) {
  event.preventDefault();

  const fahrenheitTemp = (celsiusTemp * 9) / 5 + 32;
  const temperatureElement = document.querySelector(".temperature");
  temperatureElement.innerHTML = Math.round(fahrenheitTemp);
}

function convertToCelsius(event) {
  event.preventDefault();

  const temperatureElement = document.querySelector(".temperature");
  temperatureElement.innerHTML = Math.round(celsiusTemp);
}

const builtInGeocodingApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${defaultCity}&appid=${apiKey}&units=metric`;
axios.get(builtInGeocodingApiUrl).then(handleSearchResponse);

function handleSearchResponse(response) {
  celsiusTemp = Math.round(response.data.main.temp);

  const iconElement = document.querySelector("#icon");
  iconElement.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );

  const temperature = Math.round(response.data.main.temp);
  const temperatureElement = document.querySelector(".temperature");
  temperatureElement.innerHTML = temperature;

  const cityElement = document.querySelector("h1");
  cityElement.innerHTML = response.data.name;

  const description = response.data.weather[0].description;
  const descriptionElement = document.querySelector("#weather-description");
  descriptionElement.innerHTML = description;

  const windSpeedDisplay = document.querySelector("#wind");
  windSpeedDisplay.innerHTML = `Wind Speed: ${Math.round(
    response.data.wind.speed
  )} m/h`;

  const humidityDisplay = document.querySelector("#humidity");
  humidityDisplay.innerHTML = ` Humidity: ${response.data.main.humidity} %`;

  const pressureDisplay = document.querySelector("#pressure");
  pressureDisplay.innerHTML = `Pressure: ${response.data.main.pressure} hPA`;

  let dateElement = document.querySelector("#date");
  dateElement.innerHTML = formatDateAndTime(response.data.dt);

  getWeeklyForecast(response.data.coord);
}

const searchButton = document.querySelector("#search-button");
searchButton.addEventListener("click", getSearchCityTemp);

function getSearchCityTemp(event) {
  event.preventDefault();

  const cityInput = document.querySelector("#city-input");
  const builtInGeocodingApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput.value}&appid=${apiKey}&units=metric`;

  axios.get(builtInGeocodingApiUrl).then(handleSearchResponse);
}

const currentLocationButton = document.querySelector("#current-button");
currentLocationButton.addEventListener("click", getCurrentCityAndTemp);

function getCurrentCityAndTemp(event) {
  event.preventDefault();

  navigator.geolocation.getCurrentPosition(retrieveCurrentLocationWeather);
}

function retrieveCurrentLocationWeather(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
  const currentWeatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?appid=${apiKey}&lon=${lon}&lat=${lat}&units=metric`;

  axios.get(currentWeatherApiUrl).then(handleSearchResponse);
}

function getWeeklyForecast(coordinates) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;

  axios.get(apiUrl).then(displayWeeklyForecast);
}

function displayWeeklyForecast(response) {
  const forecast = response.data.daily;
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
      </div>
    </div>`;
  });

  forecastHTML = forecastHTML + `</div>`;
  weeklyForecast.innerHTML = forecastHTML;
}
