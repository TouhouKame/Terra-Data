export const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error('Request took too long!'));
    }, s * 1000);
  });
};

export const correctLongitude = (longitude) =>
  longitude < -180 ? longitude + 360 : longitude;

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
