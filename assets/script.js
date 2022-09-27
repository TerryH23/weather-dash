// Custom api key
const apiKey = "5bea0415c609384b28cee2d49fb54226";



// fetches api data for the current day and appends that data to the html
function todaysWeather(city) {
// api request url with parameters for city, unit type and ends with the apikey
    const queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {

        $("#cityWeather").empty();
        
        const today = moment().format("LL");
        const iconCode = response.weather[0].icon;
        const lat = response.coord.lat;
        const lon = response.coord.lon;
        const cityWeather = $(`
            <h2 id="cityWeather">${response.name} ${today}</h2> 
            <img src="https://openweathermap.org/img/w/${iconCode}.png"/>
            <br><br>
            <p>Temp: ${response.main.temp}°F</p>
            <p>Wind: ${response.wind.speed} MPH</p>
            <p>Humidity: ${response.main.humidity}%</p>
        `);

        $("#cityWeather").append(cityWeather);

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function() {
            fiveDayWeather(lat, lon)
        });
    });
}


// fetches the data for the 5 day forecast and appends it to the html
function fiveDayWeather(lat, lon) {
    
    const forecastUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;

    $.ajax({
        url: forecastUrl,
        method: "GET"
    }).then(function(forecast) {
        
        $("#forecast").empty();
        
        // sets group of 5 day forecast, can change the i variable for more or less days
    for (let i = 0; i < 5; i++) {
        weatherInfo = {
            date: forecast.daily[i].dt,
            icon: forecast.daily[i].weather[0].icon,
            temp: forecast.daily[i].temp.day,
            wind: forecast.daily[i].wind_speed,
            humidity: forecast.daily[i].humidity
};

    const forecastDate = moment.unix(weatherInfo.date).format("M/DD/YYYY");
    const weatherIcon = `<img src="https://openweathermap.org/img/w/${weatherInfo.icon}.png"/>`;
    const fiveDay = $(`
        <div class="card pl-3 mx-2 bg-dark text-light">
            <div class="results card-body">
                <h3>${forecastDate}</h3>
                <li>${weatherIcon}</li>
                <li>Temp: ${weatherInfo.temp}°F</li>
                <li>Wind: ${weatherInfo.wind} MPH</li>
                <li>Humidity: ${weatherInfo.humidity}%</li>
            </div>
        </div>    
            `);

            $("#forecast").append(fiveDay);
        }
    }); 
}

$(document).on("click", ".list-group-item", function() {
    const listCity = $(this).text();
    todaysWeather(listCity);
});

$(document).ready(function() {
    const cityList = JSON.parse(localStorage.getItem("city"));

    if (cityList !== null) {
        const listedCities = cityList.length - 1;
        const lastSearchedCity = cityList[listedCities];
        todaysWeather(lastSearchedCity);
    }
});

const cityHistory = [];

$("#searchBtn").on("click", function() {

    todaysWeather($("#citySearch").val());
    if (!cityHistory.includes($("#citySearch").val())) {
        cityHistory.push($("#citySearch").val());
        const searchedCity = $(`<li class="list-group-item">${$("#citySearch").val()}</li>`);
        $("#searchHistory").append(searchedCity);
    };

    localStorage.setItem("city", JSON.stringify(cityHistory))
});
