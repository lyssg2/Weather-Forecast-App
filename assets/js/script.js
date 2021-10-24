// Bunch of variables
const inputEl = document.getElementById("city-search");
const searchEl = document.getElementById("search-btn");
const nameEl = document.getElementById("city-name");
const currentIcon = document.getElementById("city-pic")
const currentTempEl = document.getElementById("temperature");
const currentHumidityEl = document.getElementById("humidity");
const currentWindEl = document.getElementById("wind-speed");
const currentUVEl = document.getElementById("UVIndex");
const historyEl = document.getElementById("search-history");
let searchHistory = JSON.parse(localStorage.getItem("search")) || [];
let searchHistoryEl = document.getElementById("search-history-buttons")
let currentHour = moment().hours();
let cities = []
let currentContent = $("city-info")
let cityContent = $("city-content")

// APIkey variable
const APIkey = "8708010a185a4985cc529f417e310a09"


// Listens for search button click, starts results function
$('#search-btn').click(function(event) {
    event.preventDefault()
    var city = inputEl.value.trim()
    renderWeather()
    saveSearch()
    renderSearchHistory(city)
})

var saveSearch = function() {
    localStorage.setItem("cities", JSON.stringify(cities));
};

function renderWeather() {

    let cityInput = $('#city-search').val()

    document.getElementById("city-pic").innerHTML = ""

    let url = "https://api.openweathermap.org/data/2.5/weather?q=" + cityInput + "&units=imperial&appid=" + APIkey

    fetch(url)

    .then(function(response) {
        return response.json()
    }).then(function(data) {

        // Grabs city name, sticks it in header of container
        let currentDate = moment().format('l');
        nameEl.innerHTML = data.name + " - " + currentDate

        // Displays weather icon
        let cityIcon = document.createElement("img");
        cityIcon.setAttribute("src", "http://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png")
        cityIcon.setAttribute("alt", data.weather[0].description);
        currentIcon.append(cityIcon)


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

            let UVIndex = document.createElement("span")

            // Sets UV scale color
            if (data.current.uvi < 4) {
                UVIndex.setAttribute("class", "badge badge-success")
            } else if (data.current.uvi <= 8) {
                UVIndex.setAttribute("class", "badge badge-warning")
            } else {
                UVIndex.setAttribute("class", "badge badge-danger")
            }
            // Clears the input field
            $('#city-search').val('')

            // Appends UV Index to page
            UVIndex.innerHTML = data.current.uvi
            currentUVEl.innerHTML = "UV Index: "
            currentUVEl.append(UVIndex)

            const forecastEl = document.querySelectorAll(".forecast")


            for (let i = 0; i < 5; i++) {
                forecastEl[i].innerHTML = ""
                let temp = data.daily[i].temp.day
                let humidity = data.daily[i].humidity
                let wind = data.daily[i].wind_speed
                forecastEl[i].append()

                // Displays forecast date
                let forecastDate = moment().add(i + 1, 'days').format('MMM Do YYYY')
                const forecastDateEl = document.createElement("h5");
                forecastDateEl.innerHTML = forecastDate
                forecastEl[i].append(forecastDateEl);


                const forecastIcon = document.createElement("img");
                forecastIcon.setAttribute("src", "http://openweathermap.org/img/wn/" + data.daily[i].weather[0].icon + "@2x.png")
                forecastIcon.setAttribute("alt", data.daily[i].weather.description);
                forecastEl[i].append(forecastIcon);

                const forecastTempEl = document.createElement("p")
                forecastTempEl.innerHTML = "Temp: " + temp + " &#176F";
                forecastEl[i].append(forecastTempEl);

                const forecastHumidityEl = document.createElement("p");
                forecastHumidityEl.innerHTML = "Humidity: " + humidity + "%";
                forecastEl[i].append(forecastHumidityEl);

                const forecastWindEl = document.createElement("p");
                forecastWindEl.innerHTML = "Wind Speed: " + wind + " MPH"
                forecastEl[i].append(forecastWindEl);

            }


        })

    })
}

// Clears local storage and cities when button is clicked
$("#clear-history").click(function() {
    localStorage.clear();
    searchHistory = []
    $('#search-history').remove()
});

// Retrieves searched cities from local storage and displays them on page
function renderSearchHistory(pastSearch) {

    searchHistoryEl = document.createElement("button")
    searchHistoryEl.setAttribute("class", "btn btn-outline-dark btn-lg btn-block");
    searchHistoryEl.textContent = pastSearch
    searchHistoryEl.setAttribute("data-city", pastSearch);
    historyEl.append(searchHistoryEl);

    // When recent search button is clicked, get previous search results
    searchHistoryEl.addEventListener("click", function() {
        document.getElementById("city-search").value = $(this).text()
        document.getElementById("city-pic").innerHTML = ""
        renderWeather()
    })
}

$(document).keypress(function(event) {
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if (keycode == '13') {
        event.preventDefault()
        var city = inputEl.value.trim()
        renderWeather()
        saveSearch()
        renderSearchHistory(city)
    }
});