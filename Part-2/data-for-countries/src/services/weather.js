import axios from "axios";

const api_key = import.meta.env.VITE_API_KEY;

const getLatLng = (city) => {
  console.log("Getting location data from API");
  const request = axios.get(
    `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${api_key}`
  );

  return request.then((response) => {
    console.log("Response from Geolocation API: ", response.data);
    return response.data;
  });
};

const getWeather = (lat, lng) => {
  console.log("Getting weather data from API");
  const request = axios.get(
    `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lng}&units=metric&appid=${api_key}`
  );

  return request.then((response) => {
    console.log("Response from Weather API: ", response.data);
    return response.data;
  });
};

const getData = (city) => {
  const request1 = getLatLng(city);

  return request1.then((cityInfo) => {
    const lat = cityInfo[0].lat;
    const lng = cityInfo[0].lon;

    const request2 = getWeather(lat, lng);
    request2.then((response) => response.data);
  });
};

export default { getData };
