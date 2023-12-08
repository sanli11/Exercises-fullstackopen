import axios from "axios";

// This service uses weather API from https://www.visualcrossing.com/weather-api

const api_key = import.meta.env.VITE_API_KEY;

const getWeather = (city) => {
  console.log("Getting weather data from API");
  const request = axios.get(
    `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}/?key=${api_key}`
  );

  return request.then((response) => {
    console.log("Response from Weather API: ", response.data);
    return response.data;
  });
};

export default { getWeather };
