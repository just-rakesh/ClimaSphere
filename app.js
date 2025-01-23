const input = document.querySelector("input");
const button = document.querySelector("button");
const cityName = document.querySelector(".city");
const foreCasts = document.querySelector(".forecastInfo");

const apiKey = "a0713eaa16ec88ca58c6c3e0de41a891";

let city = "";

button.addEventListener("click", function () {
  if (input.value.trim() === "") {
    toggleDisplay({ error: true });
    input.value = "";
    input.blur();
    input.placeholder = "Search Another City";
  } else {
    city = input.value.trim();
    input.value = "";
    input.blur();
    input.placeholder = "Search Another City";
    updateWeather();
    updateForecast("forecast");
  }
});
input.addEventListener("keypress", function (e) {
  if (e.key == "Enter" && input.value.trim() != "") {
    city = input.value.trim();
    input.value = "";
    input.blur();
    input.placeholder = "Search Another City";
    updateWeather();
    updateForecast("forecast");
  }
});

function toggleDisplay({ weather = false, error = false, search = false }) {
  document.querySelector(".weatherData").style.display = weather
    ? "flex"
    : "none";
  document.querySelector(".errorMessage").style.display = error
    ? "flex"
    : "none";
  document.querySelector(".searchMessage").style.display = search
    ? "flex"
    : "none";
}

function updateWeather() {
  fetchWeatherData("weather");
}

async function fetchWeatherData(entrypoint) {
  const url = `https://api.openweathermap.org/data/2.5/${entrypoint}?q=${city}&appid=${apiKey}`;
  try {
    let res = await axios.get(url);
    let data = await res.data;
    updateWeatherData(data);
    toggleDisplay({ weather: true });
  } catch (e) {
    toggleDisplay({ error: true });
  }
}

function updateWeatherData(data) {
  document.querySelector(".city").textContent = data.name;

  document.querySelector(".date").textContent = getTodaysDate();

  let celsius = Math.round(data.main.temp - 273.15);
  document.querySelector(".temperature").textContent = celsius + " °C";

  let state = data.weather[0].main;
  document.querySelector(".state").textContent = state;

  let stateId = data.weather[0].id;

  let stateName = setStateImg(stateId);
  document.querySelector(
    ".weatherImg"
  ).src = `./assets/weather/${stateName}.svg`;

  document.querySelector(".humidityValue").textContent =
    data.main.humidity + " %";

  document.querySelector(".windSpeedValue").textContent =
    data.wind.speed + " M/S";
}

function getTodaysDate() {
  const date = new Date();
  const opt = {
    weekday: "short",
    day: "2-digit",
    month: "short",
  };
  return date.toLocaleDateString("en-GB", opt);
}

function setStateImg(stateId) {
  if (stateId <= 232) return "thunderstorm";
  if (stateId <= 321) return "drizzle";
  if (stateId <= 531) return "rain";
  if (stateId <= 622) return "snow";
  if (stateId <= 781) return "atmosphere";
  if (stateId <= 800) return "clear";
  if (stateId <= 804) return "clouds";
}

function updateForecast() {
  fetchForecastData("forecast");
}

async function fetchForecastData(entrypoint) {
  const url = `https://api.openweathermap.org/data/2.5/${entrypoint}?q=${city}&appid=${apiKey}`;
  try {
    let res = await axios.get(url);
    let data = await res.data;
    updateForecastData(data);
  } catch (e) {
    toggleDisplay({ error: true });
  }
}

function updateForecastData(data) {
  const currTime = "12:00:00";
  const todaysDate = new Date().toLocaleDateString("en-CA");

  foreCasts.innerHTML = ``;
  data.list.forEach((forecastWeather) => {
    if (
      forecastWeather.dt_txt.includes(currTime) &&
      !forecastWeather.dt_txt.includes(todaysDate)
    ) {
      updateForecastItems(forecastWeather);
    }
  });
}

function updateForecastItems(data) {
  const {
    dt_txt: date,
    weather: [{ id }],
    main: { temp },
  } = data;
  const newDate = new Date(date);
  const opt = {
    day: "2-digit",
    month: "short",
  };
  let nextDate = newDate.toLocaleDateString("en-GB", opt);
  const forecastItem = document.createElement("div");
  forecastItem.classList.add("forecast");
  forecastItem.innerHTML = `
              <span class="day">${nextDate}</span>
              <img src="./assets/weather/${getWeatherIcon(
                id
              )}.svg" alt="" class="foreImg" />
              <span class="temp">${Math.round(temp - 273.15)} °C</span>
  `;
  foreCasts.append(forecastItem);
}

function getWeatherIcon(stateId) {
  if (stateId <= 232) return "thunderstorm";
  if (stateId <= 321) return "drizzle";
  if (stateId <= 531) return "rain";
  if (stateId <= 622) return "snow";
  if (stateId <= 781) return "atmosphere";
  if (stateId <= 800) return "clear";
  if (stateId <= 804) return "clouds";
}
