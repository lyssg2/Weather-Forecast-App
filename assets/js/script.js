// Bunch of variables
const inputEl = document.getElementById("city-search");
const searchEl = document.getElementById("search-btn");
const nameEl = document.getElementById("city-name");
const currentTempEl = document.getElementById("temperature");
const currentHumidityEl = document.getElementById("humidity");
const currentWindEl = document.getElementById("wind-speed");
const currentUVEl = document.getElementById("UVIndex");
const historyEl = document.getElementById("history");
let searchHistory = JSON.parse(localStorage.getItem("search")) || [];
// console.log(searchHistory);
var currentHour = moment().hours();

// APIkey variable
const APIkey = "8708010a185a4985cc529f417e310a09"


// Listens for search button click, starts results function
$('#search-btn').click(function(event) {
    event.preventDefault()

    let cityInput = $('#city-search').val()

    let url = "https://api.openweathermap.org/data/2.5/weather?q=" + cityInput + "&units=imperial&appid=" + APIkey

    fetch(url)

    .then(function(response) {
        return response.json()
    }).then(function(data) {

        // Grabs city name, sticks it in header of container
        var h1 = $('<h1>')
        h1.text(data.name)
        $('#city-name').append(h1)

        // Grabs temp, humidity & Wind and displays in container
        currentTempEl.innerHTML = "Temperature: " + data.main.temp + " &#176F"
        currentHumidityEl.innerHTML = "Humidity: " + data.main.humidity + "%"
        currentWindEl.innerHTML = "Wind: " + data.wind.speed + " MPH";

        // Gets lat & long
        let lat = data.coord.lat;
        let lon = data.coord.lon;

        // Puts lat & long in API call to get UV index
        let UVQueryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=" + APIkey

        fetch(UVQueryURL)

        // Puts UV Index with weather info
        .then(function(response) {
            return response.json()
        }).then(function(data) {
            currentUVEl.innerHTML = "UV Index: " + data.current.uvi
        })
    })
})