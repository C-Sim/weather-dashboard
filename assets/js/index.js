const API_KEY = "7ec1ea2463d21d115915eb7b42565bed";

const searchHistoryContainer = $("#search-history-container");

const searchBtn = $("#search-button");

const form = $("#select-city");

const formInput = $("#input-city");

const searchHistory = $("#search-history");

const cityButton = $("#city-button");

// initialise LS
const onReady = () => {
  // check if cities exists in LS
  const recentCities = readFromLocalStorage();
  // if false then set tasks to empty object in LS
  if (!recentCities) {
    localStorage.setItem("cities", JSON.stringify([]));
  }

  renderCities();
};

// get cities from local storage
const readFromLocalStorage = () => {
  // get from LS by key
  const getCities = localStorage.getItem("cities");
  // parse LS data
  const parsedData = JSON.parse(getCities);
  return parsedData;
};

const renderCities = () => {
  // get recent cities from LS []
  const recentCities = readFromLocalStorage();

  const message = "Your recent searches will be saved here.";

  // if [] is empty then render alert
  if (recentCities.length === 0) {
    searchHistoryContainer.append(`<h2 class="message">${message}</h2>`);
  } else {
    // else render all recent cities
    searchHistoryContainer.append(`<div id="search-history">
    <div>`);

    for (let i = 0; i < 5; i += 1) {
      if (!recentCities[i]) {
      } else {
        searchHistoryContainer.append(`<button name="city-button" id="city-button" type="submit">${recentCities[i]}</button></div>
    <div>`);
      }
    }
  }

  // add an event listener on div containing all cities
};

const handleFormSubmit = (event) => {
  event.preventDefault();

  // get the city name from input
  const city = formInput.val();

  const message = "Please enter a city.";
  // if city name is empty display message
  if (!city) {
    form.append(`<h2 class="message">${message}</h2>`);
  } else {
    // else write to local storage and render weather data

    // add city to start of array in LS
    const recentCities = readFromLocalStorage();
    recentCities.unshift(city);

    writeToLocalStorage("cities", recentCities);

    renderWeatherData(city);
  }
};

const handleButtonClick = (event) => {
  event.preventDefault();

  // find target from search history section
  const target = $(event.target);

  // if target is button, record value and write to LS
  if (target.is('button[name="city-button"]')) {
    // TODO - fix search history click function - returning button text as ""
    const city = cityButton.text();
    console.log(city);

    // add city to start of array in LS
    const recentCities = readFromLocalStorage();
    recentCities.unshift(city);

    writeToLocalStorage("cities", recentCities);

    renderWeatherData();
  }
};

const writeToLocalStorage = (key, value) => {
  // stringify object value
  const stringifiedValue = JSON.stringify(value);
  // set value for each key within LS
  localStorage.setItem(key, stringifiedValue);
};

const renderWeatherData = (city) => {
  // use API to fetch current weather data
  const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`;

  // from the response cherry pick all the data you want to see in the current weather card

  // get the lat and lon from current weather data API response
  const forecastWeatherUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly&units=metric&appid=${API_KEY}`;

  // render current weather data
  renderCurrentWeather();

  // render forecast weather data
  renderForecastWeather();
};

const renderCurrentWeather = (currentWeatherData) => {
  // render the current weather data and append to section
};

const renderForecastWeather = (forecastWeatherData) => {
  // render the forecast weather data and append each card to section
};

$(searchHistoryContainer).click(handleButtonClick);

$(searchBtn).click(handleFormSubmit);

$(document).ready(onReady);
