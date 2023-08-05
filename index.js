const API_KEY = '3fe0628f157c01d77029201efd7f9bf1';

const cityInputForm = document.querySelector('.city-input');
const cityInput = document.querySelector('.city-input input[type="text"]');
const citiesContainer = document.querySelector('.cities');
const cityInputError = document.querySelector('.error');

let cities = [];
let citySet = new Set();

function updateCities() {
    citiesContainer.innerHTML = '';

    for (const city of cities) {
        const data = city.data;
        const weatherIcon = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
        const weatherDescription = data.weather[0].description;
        const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
        const cityEl = document.createElement('div');
        cityEl.classList.add('city');
        cityEl.id = 'glass'
        cityEl.innerHTML = `
        <div class="city-header">
            <img src="${weatherIcon}" alt="${weatherDescription}">
            <h2>${data.name}, ${regionNames.of(data.sys.country)}</h2>
        </div>
        <div class="city-body">
            <span>
                <p><strong>Temperature:</strong> ${data.main.temp}°C</p>
                <span><p><strong>H:</strong> ${data.main.temp_max}°</p>
                <p><strong>L:</strong> ${data.main.temp_min}°</p></span>
            </span>
            <p><strong>Weather Condition:</strong> ${titleCase(weatherDescription)}</p>
            <p><strong>Humidity:</strong> ${data.main.humidity}%</p>
            <p><strong>Pressure:</strong> ${data.main.pressure} hPa</p>
            <p><strong>Wind Speed:</strong> ${data.wind.speed} m/s</p>
        </div>
    `;
        citiesContainer.appendChild(cityEl);
    }
}

cityInputForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const cityName = cityInput.value.trim();
    if (!cityName) {
        cityInputError.textContent = 'Please enter a city name';
        return;
    }

    if (citySet.has(cityName)) {
        cityInputError.textContent = 'City has already been added';
        return;
    }

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`,{ method: "GET" })
        .then(res => res.json())
        .then(data => {
            if (data.cod === '404') {
                cityInputError.textContent = 'City not found';
                return;
            }

            cities.push({ name: cityName, data });
            cities.sort((a, b) => a.data.main.temp - b.data.main.temp);
            citySet.add(cityName);

            updateCities();

            cityInput.value = '';
            cityInputError.textContent = '';
        });
});

function titleCase(str) {
    str = str.toLowerCase().split(' ');
    for (var i = 0; i < str.length; i++) {
        str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
    }
    return str.join(' ');
}

