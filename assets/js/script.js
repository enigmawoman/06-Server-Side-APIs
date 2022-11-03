const ApiKey = "178d36bdcc83df412e2d037f1e872a87";
const WeatherBaseUrl = "https://pro.openweathermap.org"
const maxFutureDays = 6;

const searchLocation = document.getElementById('search-bar')
const searchBtn = document.getElementById('search-btn');

let searchHistory = [];

function getLocation () {
    var city = searchLocation.value;
if (city == ''){
    window.alert("must input");
    return;
} else if (!searchHistory.includes(city)) {
    searchHistory.push(city);
    localStorage.setItem("search-history", JSON.stringify(searchHistory));
    renderSearchedLocations();
}
    getCurrentWeather(city);
}

function getCurrentWeather(city) {


var ApiKey = "178d36bdcc83df412e2d037f1e872a87";

var queryURL = `https://pro.openweathermap.org/geo/1.0/direct?q=${city},GB&limit=5&appid=${ApiKey}`

fetch(queryURL)
    .then(function (response) {
        return response.json();
    })
    .then(function (data){
        getFutureWeather(data);
        document.getElementById("city-now").textContent = data[0].name + ", " + data[0].country;
    })

};


function getFutureWeather (data) {
    console.log(data);

    var lat = data[0].lat;
    console.log(lat);
    var lon = data[0].lon;
    console.log(lon);

    var queryURLFuture = `https://pro.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&exclude=minutely,hourly&appid=${ApiKey}`

    fetch(queryURLFuture)
    .then(function (response) {
        return response.json();
    })
    .then(function (data){
        console.log(data);
        renderCurrentWeather(data);
        renderFutureWeather(data);
    })

};

function renderCurrentWeather (weatherData) {

    const currentWeather = weatherData.current;
    const icon = weatherData.current.weather[0].icon
    const date = new Date(currentWeather.dt * 1000).toLocaleDateString('en-GB', {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    document.getElementById("date-now").textContent = date;
    document.getElementById("icon-now").src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
    document.getElementById("temp-now").textContent = "Temp: " + `${currentWeather.temp}` + "°C";
    document.getElementById("humidity-now").textContent = "Humidity: " + `${currentWeather.humidity}` + " %";
    document.getElementById("wind-speed-now").textContent = "Wind speed: " + `${currentWeather.wind_speed}` + " kph";
};

function renderFutureWeather (futureData) {
    
    const futureWeather = futureData.daily;
    //const icon = futureData.daily.weather[0].icon;
    const forecastList = document.getElementById("five-day-fore");
    forecastList.innerHTML = '';

    for (let i=1; i < maxFutureDays; i++) {

        const dailyForecast = futureWeather[i];
        const dailyDate = new Date(dailyForecast.dt * 1000).toLocaleDateString('en-GB', {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        const dailyIcon = `${dailyForecast.weather[0].icon}`;
        const dailyTemp = "Temp: " + `${dailyForecast.temp.day}` + "°C";
        const dailyHumidity = "Humidity: " + `${dailyForecast.humidity}` + " %";
        const dailyWindSpeed = "Wind speed: " + `${dailyForecast.wind_speed}` + " kph";

        const newForecast = document.createElement('div');
        newForecast.classList.add('forecast-day');
        newForecast.innerHTML = `<div class="weather-info">
                <div class="date-future">
                    <span>${dailyDate}</span>
                </div>
                <div class="icon-future">
                    <img src="https://openweathermap.org/img/wn/${dailyIcon}@2x.png"/>
                </div>
                <div class="temp-future">
                    <span>${dailyTemp}</span>
                </div>
                <div class="humidity-future">
                    <span>${dailyHumidity}</span>
                </div>
                <div class="wind-future">
                    <span>${dailyWindSpeed}</span>
                </div>
            </div>`
            forecastList.appendChild(newForecast);        

   }
}


function getSearchHistory () {

    if (localStorage.getItem("search-history")) {
        searchHistory = JSON.parse(localStorage.getItem("search-history"));
        console.log(searchHistory);
        renderSearchedLocations();
    } else {
        console.log("no recent searches");
        document.getElementById("recent-locations").textContent = " No recent searches "
    };

};


function renderSearchedLocations() {
    
    const locationList = document.getElementById("recent-locations");

    locationList.innerHTML = '';

    for (i=0; i < searchHistory.length; i++) {

       const recentLocation = document.createElement('div');
       recentLocation.textContent = searchHistory[i];
       recentLocation.addEventListener('click', onClickLocation);
      // console.log(recentLocation);

      
        locationList.appendChild(recentLocation);

    }
}

function onClickLocation(event) {

    const cityName = event.target.textContent
    getCurrentWeather(cityName);
    
    // searchHistory.filter(data => {
    //     if (data.name === cityName) {
    //         displayWeather();
    //     }
    // });
}

//  function displayWeather (data) {
//    // document.getElementById("city-now").textContent = data[0].name + ", " + data[0].country;

//     getFutureWeather(data);
//  }

getSearchHistory();
searchBtn.addEventListener('click', getLocation);