// Elements 
const searchInput = document.querySelector(".search");
const searchButton = document.getElementById("search-btn");
const img = document.querySelector(".img-container img")
const temprature = document.querySelector(".temp");
const cityName = document.querySelector(".city-name");
const humidityValue = document.getElementById("humidity-value");
const windValue = document.getElementById("wind-value");


/* Using Async/Await */
async function getWeatherData(city) {
  let API_KEY = "ddec5a2a79089defcb4756d78252c247"
  let API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;
  try {

    const response = await fetch(API_URL);
    const data = await response.json();

    const icon = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

    temprature.innerHTML = Math.round(data.main.temp)+"°C";

    cityName.innerHTML = data.name;

    humidityValue.innerHTML = data.main.humidity + "%";

    windValue.innerHTML = data.wind.speed + " Km/h";

    img.src = iconUrl;

  } catch (error) {
    alert("Please Enter The Correct City Name");
    console.log(error);
  }
}

searchButton.addEventListener("click" , () => {
  getWeatherData(searchInput.value);
})


getWeatherData("cairo");