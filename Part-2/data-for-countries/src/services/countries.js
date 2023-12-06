import axios from "axios";

const getAll = () => {
  console.log("Getting all countries from API");
  const request = axios.get(
    "https://studies.cs.helsinki.fi/restcountries/api/all"
  );

  return request.then((response) => {
    console.log("Response from API: ", response.data);
    return response.data;
  });
};

export default { getAll };
