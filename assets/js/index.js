const API_KEY = "7ec1ea2463d21d115915eb7b42565bed";

const searchHistoryContainer = $("#search-history-container");

const searchBtn = $("#search-button");

const form = $("#select-city");

const formInput = $("#input-city");

const searchHistory = $("#search-history");

const cityButton = $("#city-button");

const weatherContainer = $("#weather-container");

const currentWeather = $(".current-weather");

const forecastContainer = $("#forecast-container");

const currentDate = moment.unix().format("dddd Do MMMM YYYY");

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
  // get from LS by key & parse LS data
  return JSON.parse(localStorage.getItem("cities"));
};

const renderCities = () => {
  // get recent cities from LS []
  const recentCities = readFromLocalStorage();

  const message = "Your 6 most recent searches will be saved here.";

  // if [] is empty then render alert
  if (!recentCities.length) {
    searchHistory.append(`<h2 class="message">${message}</h2>`);
  } else {
    // else render all recent cities

    for (let i = 0; i < 6; i += 1) {
      if (recentCities[i]) {
        searchHistory.append(`<div><button data-city="${recentCities[i]}" id="city-button" type="submit">${recentCities[i]}</button></div>
        `);
      }
    }
  }
};

const handleFormSubmit = async (event) => {
  event.preventDefault();

  // get the city name from input
  const city = formInput.val();

  const renderStatus = await renderWeatherData(city);

  const recentCities = readFromLocalStorage();

  const message = "Please enter a valid city.";
  // if city name is empty or nothing returned for value entered (e.g. not a city), display message
  if (!city || !renderStatus) {
    form.append(`<h2 class="message" id="enter-message">${message}</h2>`);
  } else if (!recentCities.slice(0, 5).includes(city) && renderStatus) {
    // else if city isn't already in recent searches and renderstatus is truthy, write to local storage and render weather data

    // remove message
    $("#enter-message").remove();

    // add city to start of array in LS

    recentCities.unshift(city);

    writeToLocalStorage("cities", recentCities);

    searchHistory.empty();

    renderCities();
  }
};

const handleButtonClick = async (event) => {
  event.preventDefault();

  // find target from search history section
  const target = $(event.target);

  // if target is button, record value and write to LS
  if (target.is('button[id="city-button"]')) {
    const city = target.attr("data-city");

    await renderWeatherData(city);
  }
};

const writeToLocalStorage = (key, value) => {
  // stringify object value
  const stringifiedValue = JSON.stringify(value);
  // set value for each key within LS
  localStorage.setItem(key, stringifiedValue);
};

const constructUrl = (baseUrl, params) => {
  const queryParams = new URLSearchParams(params).toString();

  return queryParams ? `${baseUrl}?${queryParams}` : baseUrl;
};

const fetchData = async (url, options = {}) => {
  try {
    const response = await fetch(url, options);

    if (response.ok) {
      const data = await response.json();

      return data;
    } else {
      throw new Error("Failed to fetch data");
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

const fetchWeatherData = async (city) => {
  // use API to fetch current weather data
  const currentWeatherUrl = constructUrl(
    "https://api.openweathermap.org/data/2.5/weather",
    {
      q: city,
      appid: API_KEY,
    }
  );

  // await fetch response
  const currentData = await fetchData(currentWeatherUrl);

  // get latitude and longitude for city names
  const cityName = currentData?.name || [];
  const latitude = currentData?.coord?.lat || [];
  const longitude = currentData?.coord?.lon || [];

  // apply latitude and longitude to onecall api
  const forecastWeatherUrl = constructUrl(
    "https://api.openweathermap.org/data/2.5/onecall",
    {
      lat: latitude,
      lon: longitude,
      exclude: "minutely,hourly",
      units: "metric",
      appid: API_KEY,
    }
  );

  // await fetch response
  const forecastData = await fetchData(forecastWeatherUrl);

  // return data retrieved from api
  return {
    name: cityName,
    weatherData: forecastData,
  };
};

const renderWeatherData = async (city) => {
  try {
    // fetch weather data
    const weatherData = await fetchWeatherData(city);

    // empty container
    weatherContainer.empty();

    // HITTING this

    // render current data
    renderCurrentWeather(weatherData);

    // NOT hitting this and catching error instead

    // render forecast data
    renderForecastWeather(weatherData);

    return true;
  } catch (error) {
    renderError();
    return false;
  }
};

const renderCurrentWeather = (data) => {
  // render the current weather data and append to section
  weatherContainer.append(`<div class="current-weather">
    <img class="weather-icon" src="http://openweathermap.org/img/w/${
      data.weatherData.current.weather[0].icon
    }.png" />
    <div class="current-weather-info">
  <h1>${data.name}</h1>
  <h2>${moment
    .unix(data.weatherData.current.dt)
    .format("dddd Do MMMM YYYY")}</h2>
  <p>Temperature<span>${data.weatherData.current.temp}&deg;C</span></p>
  <p>Wind<span>${Math.round(
    data.weatherData.current.wind_speed * 2.23694
  )}mph</span></p>
  <p>Humidity<span>${data.weatherData.current.humidity}%</span></p>
  <p id="indexUV">UV index<span class="${uvIndexColor(
    data.weatherData.current.uvi
  )}">${data.weatherData.current.uvi}</span></p>
    </div>
    </div>`);
};

const renderForecastWeather = (data) => {
  // render the forecast weather data and append each card to section
  const forecastContainer = $(`<div id="forecast-container"></div>`);

  const createForecastByDate = (each) => {
    const forecast = `
    <div class="forecast">
        <div>
        <img class="small-weather-icon" src="http://openweathermap.org/img/w/${
          each.weather[0].icon
        }.png" />
        </div>
        <div class="forecast-weather-info">
        <h2>${moment.unix(each.dt).format("Do MMM")}</h2>
        <p><span>${each.temp.day}&deg;C</span></p>
        <p>Wind<span>${Math.round(each.wind_speed * 2.23694)}mph</span></p>
        <p>Humidity<span>${each.humidity}%</span></p>
       
    </div>`;

    return forecast;
  };

  const forecastByDate = data.weatherData.daily
    .slice(1, 6)
    .map(createForecastByDate);

  forecastContainer.append(forecastByDate);

  weatherContainer.append(forecastContainer);
};

const renderError = () => {
  //    remove existing data from container
  weatherContainer.empty();

  const message = "Oops, that didn't work. Please try again.";

  weatherContainer.append(`<h2 class="message">${message}</h2>`);
};

const uvIndexColor = (uvi) => {
  if (uvi >= 0 && uvi < 2.5) {
    return "lowUV";
  }

  if (uvi >= 2.5 && uvi < 5.5) {
    return "moderateUV";
  }

  if (uvi >= 5.5 && uvi < 7.5) {
    return "highUV";
  }

  if (uvi >= 7.5 && uvi < 10.5) {
    return "veryHighUV";
  }

  if (uvi >= 10.5) {
    return "extremeUV";
  }
};

$(searchHistoryContainer).click(handleButtonClick);

$(searchBtn).click(handleFormSubmit);

$(document).ready(onReady);
