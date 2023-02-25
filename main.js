let current = new Date();
let hours = current.getHours();
let minutes = current.getMinutes();
let currentTime = document.querySelector("#currentTime");
currentTime.innerHTML = `${hours}:${minutes}`;

let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

let currentDay = document.querySelector("#currentDay");
currentDay.innerHTML = days[current.getDay()];

// Challenge Current
let apiKey = "47d2af59f73bf8798b82906354d30ea3";

function getCoordinates(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?appid=${apiKey}&lon=${lon}&lat=${lat}&units=metric`;

  axios.get(apiUrl).then(getTemperatureAndCity);
}

function getTemperatureAndCity(response) {
  let currentCity = response.data.name;
  console.log(currentCity);
  let currentCityTemp = Math.round(response.data.main.temp);
  let h1 = document.querySelector("h1");
  h1.innerHTML = currentCity;

  let temp = document.querySelector("#temperature");
  temp.innerHTML = `${currentCityTemp}°C`;

  let currentDescription = response.data.weather[0].description;
  let description = document.querySelector("#weather-description");
  description.innerHTML = currentDescription;
}

function displayCurrentCityAndTemp(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(getCoordinates);
}

let currentButton = document.querySelector("#current-button");
currentButton.addEventListener("click", displayCurrentCityAndTemp);

//Challange Search

//Explenation: When Selecting The button Search we want to have the search input (city) in the h1, and the the temperature to changed based on the city.

// 6 We create the functions
function worldTemperature(response) {
  // 7 We get the temperature
  let temperature = Math.round(response.data.main.temp);
  // 9 We put select  dosplay temperature
  let showTemp = document.querySelector("#temperature");
  showTemp.innerHTML = `${temperature}°C`;
  // 10 We also also select the description and display

  document.querySelector("#weather-description").innerHTML =
    response.data.weather[0].description;

  console.log(response.data.weather[0].description);

  document.querySelector(
    "#wind"
  ).innerHTML = ` Wind Speed:${response.data.wind.speed} mph`;

  document.querySelector(
    "#humidity"
  ).innerHTML = ` Humidity:${response.data.main.humidity}%`;

  document.querySelector(
    "#pressure"
  ).innerHTML = `Pressure:${response.data.main.pressure}hPA`;

  //11 Select h1 and replace with the name of the city
  let h1 = document.querySelector("h1");
  h1.innerHTML = response.data.name;
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