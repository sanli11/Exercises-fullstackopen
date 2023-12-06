const CountryDetails = ({ countryData }) => {
  if (!countryData) {
    return;
  }

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
    </div>
  );
};

export default CountryDetails;
