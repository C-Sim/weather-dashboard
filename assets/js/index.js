const API_KEY = "7ec1ea2463d21d115915eb7b42565bed";

const searchHistoryContainer = $("#search-history-container");

const searchBtn = $("#search-button");

const form = $("#select-city");

const formInput = $("#input-city");

const searchHistory = $("#search-history");

const cityButton = $("#city-button");

const weatherContainer = $("#weatherContainer");

const currentDate = moment().format("dddd Do MMMM YYYY");

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

    for (let i = 0; i < 6; i += 1) {
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

    renderWeatherData(city);
  }
};

const writeToLocalStorage = (key, value) => {
  // stringify object value
  const stringifiedValue = JSON.stringify(value);
  // set value for each key within LS
  localStorage.setItem(key, stringifiedValue);
};

const renderWeatherData = (city) => {
  // set http method
  const fetchOptions = { method: "GET" };

  // use API to fetch current weather data
  //   TODO - add ,uk after city to specify??
  const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

  const handleCurrentAsync = async () => {
    try {
      // make request to API
      const response = await fetch(currentWeatherUrl, fetchOptions);
      //   check response status
      if (response.ok) {
        //   return data
        const currentData = await response.json();
        return currentData;
      } else {
        //   return error
        throw new error("Couldn't fetch data");
      }
    } catch (error) {
      // respond to error
      throw new Error(error.message);
    }
  };

  // from the response cherry pick all the data you want to see in the current weather card
  const currentWeatherData = (currentData) => {
    const cityName = currentData?.name || [];
    const cityLatitude = currentData?.coord?.lat || [];
    const cityLongitude = currentData?.coord?.long || [];
    //   const avTemp = currentData?.main?.temp || [];
    //   const humidity = currentData?.main?.humidity || [];
    //   const windSpeed = currentData?.wind?.speed*2.23694 || [];
    //   const weatherIcon = currentData?.weather?.icon || [];
  };

  // get the lat and lon from current weather data API response
  const forecastWeatherUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly&units=metric&appid=${API_KEY}&units=metric`;

  const handleOneCallAsync = async () => {
    try {
      // make request to API
      const response = await fetch(forecastWeatherUrl, fetchOptions);
      //   check response status
      if (response.ok) {
        //   return data
        const forecastData = await response.json();
        return forecastData;
      } else {
        //   return error
        throw new error("Couldn't fetch data");
      }
    } catch (error) {
      // respond to error
      throw new Error(error.message);
    }
  };

  const forecastWeatherData = (forecastData) => {
    const Latitude = forecastData?.lat || [];
    const Longitude = forecastData?.long || [];
    const avTemp = forecastData?.current?.temp || [];
    const humidity = forecastData?.current?.humidity || [];
    const windSpeed = forecastData?.current?.wind_speed * 2.23694 || [];
    const weatherIcon = forecastData?.current?.weather?.icon || [];
    const date = forecastData?.current?.dt || [];
    const uvIndex = forecastData?.current?.uvi || [];
  };

  // render current weather data
  renderCurrentWeather(currentWeatherData);

  // render forecast weather data
  renderForecastWeather(forecastWeatherData);
};

const renderCurrentWeather = (currentWeatherData) => {
  // render the current weather data and append to section
  weatherContainer.append(`<div class="current-weather">
<img class="weather-icon" src=${weatherIcon} />
<div class="current-weather-info">
  <h1>${cityName}</h1>
  <h2>${currentDate}</h2>
  <p>Temperature: <span>${avTemp}</span></p>
  <p>Wind: <span>${windSpeed}</span></p>
  <p>Humidity: <span>${humidity}</span></p>
  <p id="indexUV">UV index: <span class="highUV">${uvIndex}</span></p>
</div>
</div>`);
};

const renderForecastWeather = (forecastWeatherData) => {
  // render the forecast weather data and append each card to section
  //   for (let i = currentDate ++ 1, i < currentDate ++ 5, i +=1) {
  weatherContainer.append(`<div id="forecast-container">
  <div class="forecast">
    <div>
      <img class="small-weather-icon" src=${weatherIcon} />
    </div>
    <div class="forecast-weather-info">
      <h2>${[i]}</h2>
      <p>Temperature: <span>${avTemp}</span></p>
      <p>Wind: <span>${windSpeed}</span></p>
      <p>Humidity: <span>${humidity}</span></p>
    </div>
  </div>`);
};

$(searchHistoryContainer).click(handleButtonClick);

$(searchBtn).click(handleFormSubmit);

$(document).ready(onReady);
