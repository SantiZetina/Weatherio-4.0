const apiKey = '725df7184af4b24b878a3b2877922076'
const searchForm = document.getElementById("search-form");
const cityInput = document.getElementById("city-input");
const historyList = document.getElementById("history-list");
const currentWeatherDetails = document.getElementById("current-weather-details");
const forecastContainer = document.getElementById("forecast-container");

function loadSearchHistory() {
  const searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
  searchHistory.forEach(city => appendCityToHistory(city));
}

function saveToSearchHistory(city) {
  let searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
  if (!searchHistory.includes(city)) {
    searchHistory.push(city);
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
    appendCityToHistory(city);
  }
}

function appendCityToHistory(city) {
  const li = document.createElement("li");
  li.textContent = city;
  li.addEventListener("click", () => fetchWeatherData(city));
  historyList.appendChild(li);
}

async function fetchWeatherData(city) {
  const cityDataResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`);
  const cityData = await cityDataResponse.json();
  const { lat, lon } = cityData.coord;
  const weatherDataResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
  const weatherData = await weatherDataResponse.json();
  displayCurrentWeather(weatherData);
  displayForecast(weatherData);
}

function displayCurrentWeather(weatherData) {
    const currentDate = new Date(weatherData.list[0].dt * 1000);
    const currentWeather = weatherData.list[0];
  
    currentWeatherDetails.innerHTML = `
      <h3>${weatherData.city.name} (${currentDate.toLocaleDateString()})</h3>
      <img src="https://openweathermap.org/img/wn/${currentWeather.weather[0].icon}.png" alt="${currentWeather.weather[0].description}">
      <p>Temperature: ${currentWeather.main.temp}°C</p>
      <p>Humidity: ${currentWeather.main.humidity}%</p>
      <p>Wind Speed: ${currentWeather.wind.speed} m/s</p>
    `;
  }
  

function displayForecast(weatherData) {
    forecastContainer.innerHTML = ""; 
  
    for (let i = 1; i < weatherData.list.length; i += 8) {
      const forecast = weatherData.list[i];
      const forecastDate = new Date(forecast.dt * 1000);
  
      const forecastCard = document.createElement("div");
      forecastCard.classList.add("forecast-card");
      forecastCard.innerHTML = `
        <h4>${forecastDate.toLocaleDateString()}</h4>
        <img src="https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png" alt="${forecast.weather[0].description}">
        <p>Temp: ${forecast.main.temp}°C</p>
        <p>Wind: ${forecast.wind.speed} m/s</p>
        <p>Humidity: ${forecast.main.humidity}%</p>
      `;
  
      forecastContainer.appendChild(forecastCard);
    }
  }
  

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const city = cityInput.value.trim();
  if (!city) return;
  fetchWeatherData(city);
  saveToSearchHistory(city);
  cityInput.value = "";
});

loadSearchHistory();
const lastSearchedCity = JSON.parse(localStorage.getItem("searchHistory")).pop();
if (lastSearchedCity) fetchWeatherData(lastSearchedCity);
