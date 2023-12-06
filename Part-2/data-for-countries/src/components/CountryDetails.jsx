import { useEffect } from "react";
import weatherService from "../services/weather";

const CountryDetails = ({ countryData }) => {
  if (!countryData) {
    return;
  }

  let weatherData = null;

  useEffect(() => {
    weatherData = weatherService.getData(countryData.capital);
  }, [weatherService]);

  let languages = Object.values(countryData.languages);

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
          <b>Area:</b> {countryData.area}
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
      {weatherData ? (
        <div>
          <p>
            <b>Temperature:</b> {weatherData.current.temp}
          </p>
          <p>
            <b>Wind Speed:</b> {weatherData.current.wind_speed}
          </p>
          
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default CountryDetails;
