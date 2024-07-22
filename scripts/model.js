// import { TIMEOUT_SEC } from './config';
import { timeout, correctLongitude, getJSON } from './helpers.js';

const display = document.querySelector('.display');

let map;

class Country {
  constructor(country, state, city, id) {
    this.country = country;
    this.state = state;
    this.city = city;
    this.id = id;
  }

  view(data) {
    const html = `
      <div class="description">
        <h2 id="country-name">${data}</h2>
      </div>`;
    display.insertAdjacentHTML('beforeend', html);
  }

  createCountryView() {
    this.view(this.country);
  }
  createStateView() {
    this.view(this.state);
  }
  createCityView() {
    this.view(this.city);
  }
}

const countryData = async function (id) {
  try {
    getJSON(`https://restcountries.com/v3.1/alpha/${id}`).then((data) =>
      console.log(data[0])
    );
  } catch (err) {
    throw new Error(err);
  }
};

const displayAllViews = function (country, state, city, id) {
  const currentCountry = new Country(country, state, city, id);
  display.innerHTML = '';
  if (currentCountry.country) currentCountry.createCountryView();
  if (currentCountry.state) currentCountry.createStateView();
  if (currentCountry.city) currentCountry.createCityView();
};

export const getCoords = function (event) {
  const { lat, lng } = event.latlng;

  // Calling Geoapify

  console.log(lat, lng);
  // prettier ignore
  getJSON(
    `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${correctLongitude(
      lng
    )}&apiKey=33ef84241f6a4184bd0caa258d7e33c1`
  )
    .then((data) => {
      console.log('Data recieved:', data.features[0].properties);
      const {
        country,
        state,
        city,
        country_code: id,
      } = data.features[0].properties;
      displayAllViews(country, state, city, id);
      countryData(id);
    })
    .catch((err) => console.error(`${err} 💥💥`));
};

export const loadMap = function () {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        const { latitude } = position.coords;
        const { longitude } = position.coords;
        const coordinates = [latitude, longitude];
        console.log(latitude, longitude);
        map = L.map('map', {
          worldCopyJump: true,
        }).setView(coordinates, 6);

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          minZoom: 3,
          attribution:
            '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(map);

        map.on('click', getCoords);
      },
      function () {
        console.log('Unable to get location');
      }
    );
  }
};
