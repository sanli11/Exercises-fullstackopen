import { useEffect, useState } from "react";
import countryService from "./services/countries";
import CountryDetails from "./components/CountryDetails";

console.log("Initial Render");

const App = () => {
  const [loading, setLoading] = useState(true);
  const [countries, setCountries] = useState([]);
  const [query, setQuery] = useState("");
  const [result, setResult] = useState([]);
  const [details, setDetails] = useState(null);

  useEffect(() => {
    countryService.getAll().then((list) => {
      setLoading(false);
      setCountries(list);
    });
  }, [countryService]);

  const displayResults = (matchedCountries) => {
    if (query) {
      if (matchedCountries.length === 0) {
        setDetails(null);
        return <p>No matches</p>;
      } else if (matchedCountries.length === 1) {
        setDetails(matchedCountries[0]);
        return null;
      } else if (matchedCountries.length > 10) {
        setDetails(null);
        return <p>Too many matches. Specify another filter</p>;
      } else {
        if (!matchedCountries.includes(details)) {
          setDetails(null);
        }
        return (
          <ul>
            {matchedCountries.map((country) => (
              <li key={country.cca2}>
                {country.name.common}
                <button onClick={() => handleClick(country)}>Show</button>
              </li>
            ))}
          </ul>
        );
      }
    } else {
      return null;
    }
  };

  const handleClick = (country) => {
    console.log("Showing Details for: ", country);
    setDetails(country);
  };

  const handleQuery = (e) => {
    let search = e.target.value;
    setQuery(search);

    console.log("Searching for: ", search);

    let searchedResult = countries.filter((country) => {
      let matchedCommonName = country.name.common
        .toLowerCase()
        .includes(search.toLowerCase());

      let matchedOfficialName = country.name.official
        .toLowerCase()
        .includes(search.toLowerCase());

      let matchedAltName = country.altSpellings.some((altName) =>
        altName.toLowerCase().includes(search.toLowerCase())
      );

      return matchedCommonName || matchedOfficialName || matchedAltName;
    });

    console.log("List of countries returned: ", searchedResult);
    setResult(displayResults(searchedResult));
  };

  return (
    <div>
      <input
        type="search"
        placeholder="Search Country"
        disabled={loading}
        value={query}
        onChange={handleQuery}
      />
      {result}
      <div>{CountryDetails && <CountryDetails countryData={details} />}</div>
    </div>
  );
};

export default App;
