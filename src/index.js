function updateWeather(response) {
  let temperatureElement = document.querySelector("#temperature");
  let temperature = response.data.temperature.current;
  let cityElement = document.querySelector("#city");
  let descriptionElement = document.querySelector("#clouds");
  let humidityElement = document.querySelector("#humidity");
  let speedElement = document.querySelector("#speed");
  let timeElement = document.querySelector("#time");
  let iconElement = document.querySelector("#weather-icon");

  let city = response.data.city;
  let iconCode = response.data.condition.icon;

  descriptionElement.innerHTML = response.data.condition.description;
  humidityElement.innerHTML = `${response.data.temperature.humidity}%`;
  speedElement.innerHTML = `${response.data.wind.speed} km/h`;
  cityElement.innerHTML = city;

  temperatureElement.innerHTML = `${Math.round(temperature)}`;
  iconElement.src = `https://shecodes-assets.s3.amazonaws.com/api/weather/icons/${iconCode}.png`;

  getForecast(city);
}

function updateForecast(response) {
  let forecastHtml = "";
  response.data.daily.forEach(function (day, index) {
    if (index > 0 && index < 7) {
      forecastHtml += `
                        <div class="weather-forecast-day">
                            <div>${formatDay(day.time)}</div>
                            <img src="https://shecodes-assets.s3.amazonaws.com/api/weather/icons/${
                              day.condition.icon
                            }.png" class="weather-forecast-icon" />
                            <div><strong>${Math.round(
                              day.temperature.maximum
                            )}°</strong></div>
                            <div>${Math.round(day.temperature.minimum)}°</div>
                        </div>
                    `;
    }
  });
  document.querySelector("#forecast").innerHTML = forecastHtml;
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[date.getDay()];
}

function getForecast(city) {
  let apiKey = "2c25e8ee30afc855b6tobf84420a3ae3";
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}&units=metric`;
  axios.get(apiUrl).then(updateForecast);
}

function formatDate(date) {
  let minutes = date.getMinutes();
  let hours = date.getHours();
  let seconds = date.getSeconds();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];

  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  if (seconds < 10) {
    seconds = `0${seconds}`;
  }

  return `${day} ${hours}:${minutes}:${seconds}`;
}

function updateTime() {
  let timeElement = document.querySelector("#time");
  let date = new Date();
  timeElement.innerHTML = formatDate(date);
}

function handleSubmit(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#search-form-input");
  searchCity(searchInput.value);
}

function searchCity(city) {
  let apiKey = "2c25e8ee30afc855b6tobf84420a3ae3";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;
  axios.get(apiUrl).then(updateWeather);
}

let searchFormElement = document.querySelector("#inputForm");
searchFormElement.addEventListener("submit", handleSubmit);

setInterval(updateTime, 1000);
searchCity("Harare");
