import { useEffect, useState } from "react";
import countryService from "./services/countries";
import CountryDetails from "./components/CountryDetails";

console.log("Initial Render");

const App = () => {
  const [countries, setCountries] = useState([]);
  const [query, setQuery] = useState("");
  const [result, setResult] = useState([]);
  const [details, setDetails] = useState(null);

  useEffect(() => {
    countryService.getAll().then((list) => setCountries(list));
  }, [countryService]);

  let displayedResults = null;

  if (query) {
    if (result.length === 0) {
      displayedResults = <p>No matches</p>;
    } else if (result.length === 1) {
      displayedResults = <CountryDetails countryData={result[0]} />;
    } else if (result.length > 10) {
      displayedResults = <p>Too many matches. Specify another filter</p>;
    } else {
      displayedResults = (
        <>
          <ul>
            {result.map((country) => (
              <li key={country.cca2}>
                {country.name.common}
                <button onClick={() => handleClick(country)}>Show</button>
              </li>
            ))}
          </ul>
          <CountryDetails countryData={details} />
        </>
      );
    }
  }

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
    setResult(searchedResult);
    setDetails(null);
  };

  return (
    <div>
      <input
        type="search"
        placeholder="Search Country"
        value={query}
        onChange={handleQuery}
      />
      <div>{displayedResults}</div>
    </div>
  );
};

export default App;
