import { useEffect, useState } from "react";
import weatherService from "../services/weather";

const CountryDetails = ({ countryData }) => {
  if (!countryData) {
    return;
  }

  const [weather, setWeather] = useState(null);
  const [icon, setIcon] = useState(null);

  let languages = Object.values(countryData.languages);
  let cityName = countryData.capital.toString().replace(/\s+/g, "-");

  useEffect(() => {
    setWeather(null);
    
    weatherService.getWeather(cityName).then((weatherData) => {
      setWeather(weatherData);

      switch (weatherData.days[0].icon) {
        case "clear-day":
          setIcon("https://openweathermap.org/img/wn/01d@2x.png");
          return;
        case "clear-night":
          setIcon("https://openweathermap.org/img/wn/01n@2x.png");
          return;
        case "cloudy":
          setIcon("https://openweathermap.org/img/wn/03d@2x.png");
          return;
        case "fog":
          setIcon("https://openweathermap.org/img/wn/50d@2x.png");
          return;
        case "partly-cloudy-day":
          setIcon("https://openweathermap.org/img/wn/02d@2x.png");
          return;
        case "partly-cloudy-night":
          setIcon("https://openweathermap.org/img/wn/02n@2x.png");
          return;
        case "rain":
          setIcon("https://openweathermap.org/img/wn/10d@2x.png");
          return;
        case "snow":
          setIcon("https://openweathermap.org/img/wn/13d@2x.png");
          return;
        default:
          console.log("Couldn't find picture");
          return;
      }
    });
  }, [countryData, weatherService]);

  return (
    <div>
      <h2>{countryData.name.common}</h2>
      <h4>Official Name: {countryData.name.official}</h4>
      <div>
        <p>
          <b>Region:</b> {countryData.region}
        </p>
        <p>
          <b>Capital:</b> {countryData.capital}
        </p>
        <p>
          <b>Area:</b> {new Intl.NumberFormat().format(countryData.area)}
        </p>
        <p>
          <b>Population:</b>{" "}
          {new Intl.NumberFormat().format(countryData.population)}
        </p>
        <div>
          <h4>Languages</h4>
          <ul>
            {languages.map((language) => (
              <li key={language}>{language}</li>
            ))}
          </ul>
        </div>
        <img src={countryData.flags.png} alt={countryData.name.alt} />
      </div>
      <h4>Weather in {countryData.capital}</h4>
      {weather ? (
        <div>
          <p>
            <b>Temperature:</b> {weather.days[0].temp} Fahrenheit
          </p>
          <p>
            <b>Wind Speed:</b> {weather.days[0].windspeed}
          </p>
          {icon && <img src={icon} alt={weather.days.description} />}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default CountryDetails;
