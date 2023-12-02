import { useState, useEffect } from "react";
import axios from "axios";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    console.log("Effect is now running");

    const afterGettingData = (response) => {
      console.log("Promise fulfilled");
      setPersons(response.data);
    };

    const getDataPromise = axios.get("http://localhost:3001/persons");
    getDataPromise.then(afterGettingData);
  }, []);

  let numbers = persons.filter((person) =>
    person.name
      .split(" ")
      .some((name) => name.toLowerCase().startsWith(search.toLowerCase()))
  );

  const handleNameChange = (e) => setNewName(e.target.value);
  const handleNumberChange = (e) => setNewNumber(e.target.value);
  const handleSearch = (e) => setSearch(e.target.value);

  const addPerson = (e) => {
    e.preventDefault();

    if (persons.some((person) => person.name === newName)) {
      alert(`${newName} is already added in the phonebook`);
    } else {
      let newPerson = { name: newName, number: newNumber, id: persons.length + 1 };
      setPersons(persons.concat(newPerson));
    }

    setNewName("");
    setNewNumber("");
    setSearch("");
  };

  return (
    <div>
      <h2>Phonebook</h2>

      <Filter value={search} onChange={handleSearch} />

      <h3>Add a New</h3>

      <PersonForm
        valueName={newName}
        valueNumber={newNumber}
        onChangeName={handleNameChange}
        onChangeNumber={handleNumberChange}
        onSubmit={addPerson}
      />

      <h3>Numbers</h3>

      <Persons personsList={numbers} />
    </div>
  );
};

export default App;
