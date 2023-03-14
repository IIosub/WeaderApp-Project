//First Display London Weather  and 7 days of forecast for start-up;

let apiKey = "04bde8cc7f569f7c5603cdbc6deb89a3";

let city = "London";
let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

function formatDateAndTime(timestamp) {
  let now = new Date(timestamp);
  let hours = now.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = now.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[now.getDay()];

  return `${day} ${hours}:${minutes}`;
}

//Full Week Forecats

function displayWeeklyForecast(response) {
  console.log(response.data.daily);
  let weeklyForecast = document.querySelector("#weekly-forecast");
  let forecastHTML = `<div class="row">`;
  let days = ["Thu", "Fri", "Sat", "Sun", "Mon", "Tue", "Wed"];

  days.forEach(function (day) {
    forecastHTML =
      forecastHTML +
      `<div class="col-2">
        <div class="week-date">${day}</div>
        <img src="https://openweathermap.org/img/wn/10d@2x.png" alt="" width="60">
        <div class="day-temperature">
          <span class="max-temp">10°</span> / <span class="min-temp">2°</span>
        </div>
      </div>
    </div>`;
  });

  forecastHTML = forecastHTML + `</div>`;
  weeklyForecast.innerHTML = forecastHTML;
}

///////////////////

function currentLondonTemperature(response) {
  let iconElement = document.querySelector("#icon");
  iconElement.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  celsiusTemp = Math.round(response.data.main.temp);
  let cityTemperature = Math.round(response.data.main.temp);
  let temp = document.querySelector(".temperature");
  temp.innerHTML = `${cityTemperature}`;

  let cityElement = document.querySelector("h1");
  cityElement.innerHTML = response.data.name;

  let currentDescription = response.data.weather[0].description;
  let description = document.querySelector("#weather-description");
  description.innerHTML = currentDescription;

  document.querySelector("#wind").innerHTML = ` Wind Speed: ${Math.round(
    response.data.wind.speed
  )} mph`;

  document.querySelector(
    "#humidity"
  ).innerHTML = ` Humidity: ${response.data.main.humidity} %`;

  document.querySelector(
    "#pressure"
  ).innerHTML = `Pressure: ${response.data.main.pressure} hPA`;

  let dateElement = document.querySelector("#dateElement");
  dateElement.innerHTML = formatDateAndTime(response.data.dt * 1000);
}

axios.get(apiUrl).then(currentLondonTemperature);

// Challenge Current

function getCoordinates(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?appid=${apiKey}&lon=${lon}&lat=${lat}&units=metric`;

  axios.get(apiUrl).then(getTemperatureAndCity);
}

function getTemperatureAndCity(response) {
  let currentCity = response.data.name;
  let currentCityTemp = Math.round(response.data.main.temp);
  let h1 = document.querySelector("h1");
  h1.innerHTML = currentCity;

  let temp = document.querySelector("#temperature");
  temp.innerHTML = `${currentCityTemp}°`;

  let currentDescription = response.data.weather[0].description;
  let description = document.querySelector("#weather-description");
  description.innerHTML = currentDescription;

  document.querySelector(
    "#wind"
  ).innerHTML = ` Wind Speed: ${response.data.wind.speed} mph`;

  document.querySelector(
    "#humidity"
  ).innerHTML = ` Humidity: ${response.data.main.humidity} %`;

  document.querySelector(
    "#pressure"
  ).innerHTML = `Pressure: ${response.data.main.pressure} hPA`;
}

function displayCurrentCityAndTemp(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(getCoordinates);
}

let currentButton = document.querySelector("#current-button");
currentButton.addEventListener("click", displayCurrentCityAndTemp);

//Challange Search

//Explenation: When Selecting The button Search we want to have the search input (city) in the h1, and the the temperature to changed based on the city.

//!!!!!!!!!!!!!!

function getWeeklyForecast(coordinates) {
  console.log(coordinates);
  apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayWeeklyForecast);
}

//!!!!!!!!!!!!!!!

// 6 We create the functions
function worldTemperature(response) {
  let iconElement = document.querySelector("#icon");
  iconElement.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  // 7 We get the temperature

  celsiusTemp = Math.round(response.data.main.temp);
  let temperature = Math.round(response.data.main.temp);
  // 9 We put select  dosplay temperature
  let showTemp = document.querySelector("#temperature");
  showTemp.innerHTML = `${temperature}`;
  // 10 We also also select the description and display

  document.querySelector("#weather-description").innerHTML =
    response.data.weather[0].description;

  console.log(response.data.weather[0].description);

  document.querySelector(
    "#wind"
  ).innerHTML = ` Wind Speed: ${response.data.wind.speed} mph`;

  document.querySelector(
    "#humidity"
  ).innerHTML = ` Humidity: ${response.data.main.humidity} %`;

  document.querySelector(
    "#pressure"
  ).innerHTML = `Pressure: ${response.data.main.pressure} hPA`;

  //11 Select h1 and replace with the name of the city
  let h1 = document.querySelector("h1");
  h1.innerHTML = response.data.name;

  getWeeklyForecast(response.data.coord);
}

// 2 Secondly we create the funtion wolrdCitiesAndTemp
function worldCitiesAndTemp(event) {
  event.preventDefault();
  //  3 I creeate a variable that will give me the city by typing in the search box input
  let cityInput = document.querySelector("#city-input");
  // 4 We place the input value in the weather api URL (cityInput.value)
  let newApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput.value}&appid=${apiKey}&units=metric`;

  // 5 Axiol will make a request on the location of the weather api, once the weather API returns Data, the function will be called with a parametre (respone).
  axios.get(newApiUrl).then(worldTemperature);
}

//  1 Firstly we selected the search button and add a eventListener. Then the puton will  be clicked, the function worlsCitiesAndTemp is going to be cold.
let searchButton = document.querySelector("#search-button");
searchButton.addEventListener("click", worldCitiesAndTemp);

function convertToFahrenheit(event) {
  event.preventDefault();
  let fahrenheitTemp = (celsiusTemp * 9) / 5 + 32;
  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = Math.round(fahrenheitTemp);
}

let celsiusTemp = null;
let fahrenheitConversion = document.querySelector("#fahrenheit-unit");
fahrenheitConversion.addEventListener("click", convertToFahrenheit);

function convertToCelsius(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = Math.round(celsiusTemp);
}

let celsiusConversion = document.querySelector("#celsius-unit");
celsiusConversion.addEventListener("click", convertToCelsius);
