// import { TIMEOUT_SEC } from './config';
import { timeout } from './helpers.js';
let map;

export const getCoords = function (event) {
  const { lat, lng } = event.latlng;

  // Calling Geoapify
  console.log(lat, lng);
  getJSON(
    `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&apiKey=33ef84241f6a4184bd0caa258d7e33c1`
  )
    .then((data) => {
      console.log('Data recieved:', data);
    })
    .catch((err) => console.error(`${err} 💥💥`));
};

export const getJSON = async function (url, errorMsg = 'Something went wrong') {
  try {
    const fetchPro = fetch(url);
    const res = await Promise.race([fetchPro, timeout(10)]);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    throw err;
  }
};

export const loadMap = function () {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        const { latitude } = position.coords;
        const { longitude } = position.coords;
        const coordinates = [latitude, longitude];
        console.log(latitude, longitude);
        map = L.map('map').setView(coordinates, 6);

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
