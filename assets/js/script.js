// below is my API key for the openweather API
const ApiKey = "178d36bdcc83df412e2d037f1e872a87";
const WeatherBaseUrl = "https://pro.openweathermap.org"
// the number of days forecast needed including the current day
const maxFutureDays = 6;

const searchLocation = document.getElementById('search-bar')
const searchBtn = document.getElementById('search-btn');
const fiveDay = document.getElementById('five-day-title');
const currentTitle = document.getElementById('current-title');

// the array that will be populated with the searched locations
let searchHistory = [];

init();
// will run on page load
function init() {
    fiveDay.style.display = 'none';
    currentTitle.style.display = 'none';

};

// this function will take the 'value' of the location typed into the search box and push it into the functions that will fetch data from the openweather API
function getLocation () {
    var city = searchLocation.value;
   // the user will be alerted if they do not type a location into the searchbox
if (city == ''){
    window.alert("Please enter a location.");
    return;
    // this will check to see if the location has already be searched and stored, if it hasnt it will push the new location into the search history array
} else if (!searchHistory.includes(city)) {
    searchHistory.push(city);
    localStorage.setItem("search-history", JSON.stringify(searchHistory));
    // the list of recently searched items will be loaded to the page via the function below
    renderSearchedLocations();
}
// this will clear the search box once the functions have run
    searchLocation.value = '';
    getCurrentWeather(city);
}


// this function fetches the lat and lon required for the five day forecast API by fetching data using the city name
function getCurrentWeather(city) {


var ApiKey = "178d36bdcc83df412e2d037f1e872a87";

var queryURL = `https://pro.openweathermap.org/geo/1.0/direct?q=${city},GB&limit=5&appid=${ApiKey}`

fetch(queryURL)
    .then(function (response) {
        return response.json();
    })
    .then(function (data){
        // if the data is good, then the gutFutureWeather function will be called
        getFutureWeather(data);
        // writes the name and country of the searched city to the dashboard
        document.getElementById("city-now").textContent = data[0].name + ", " + data[0].country;
    })


};

// this function uses the 5day forecast API from Openweather to fetch the 5 day forecast for the searched location using the lat and lon data retrieved in getCurrentWeather
function getFutureWeather (data) {

    console.log(data);

    var lat = data[0].lat;
    console.log(lat);
    var lon = data[0].lon;
    console.log(lon);

    // fertching data using the lat and lon from the data retrieved in the first APi call
    var queryURLFuture = `https://pro.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&exclude=minutely,hourly&appid=${ApiKey}`

    fetch(queryURLFuture)
    .then(function (response) {
        return response.json();
    })
    .then(function (data){
        console.log(data);
        // the data will be rendered to the dashboard using these functions
        renderCurrentWeather(data);
        renderFutureWeather(data);
    })

};


// this will display the current weather using the data extracted from the API call in getFutureWeather
function renderCurrentWeather (weatherData) {

    currentTitle.style.display = 'block';

    const currentWeather = weatherData.current;
    const icon = weatherData.current.weather[0].icon
    //converting the date using the info in dt:(Data receiving time)
    const date = new Date(currentWeather.dt * 1000).toLocaleDateString('en-GB', {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    // writing the data from the API call to the current weather in the HTML
    document.getElementById("date-now").textContent = date;
    document.getElementById("icon-now").src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
    document.getElementById("temp-now").textContent = "Temp: " + `${currentWeather.temp}` + "°C";
    document.getElementById("humidity-now").textContent = "Humidity: " + `${currentWeather.humidity}` + " %";
    document.getElementById("wind-speed-now").textContent = "Wind speed: " + `${currentWeather.wind_speed}` + " kph";
};

// this will display the future weather using the data extracted from the API call in getFutureWeather
function renderFutureWeather (futureData) {

    fiveDay.style.display = 'block';
    
    const futureWeather = futureData.daily;
    const forecastList = document.getElementById("five-day-fore");
    forecastList.innerHTML = '';

        // using a for loop to get the data from index 1 through 6 in the daily array of the data recived from the API call, and render to the forecast section of the HTML using dynmaically created HTML 
    for (let i=1; i < maxFutureDays; i++) {

        // creating const here to make the dynamically created HMTL below easier to read and write
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
            // telling the new divs where they should sit in the HTML
            forecastList.appendChild(newForecast);        

   }
}

// this retrieves the list of previously searched locations from local storage and runs the function which will add them to the recent locations part of the dashboard
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

// writes the recent locations to the dashboard
function renderSearchedLocations() {

        // reversing the searchHistory array so that the last location searched is at the top of the displyed list
    const reversed = searchHistory.reverse();
    
    const locationList = document.getElementById("recent-locations");

    locationList.innerHTML = '';

        // using a for loop to dynamically create the list of recently searched locations in the HMTL
    for (i=0; i < reversed.length; i++) {

       const recentLocation = document.createElement('div');
       recentLocation.classList.add('added-locations');
       recentLocation.textContent = reversed[i];
       recentLocation.addEventListener('click', onClickLocation);
      

      
        locationList.appendChild(recentLocation);

    }
}

// this function creates and event listener on list of recently searched locations and will research the weather for the location clicked

function onClickLocation(event) {

    const cityName = event.target.textContent
    getCurrentWeather(cityName);
    
  }

  // search history will load on page load
getSearchHistory();
// an event listener for the search button
searchBtn.addEventListener('click', getLocation);