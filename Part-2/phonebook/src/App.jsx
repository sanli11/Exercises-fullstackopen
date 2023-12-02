import { useState } from "react";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";

const dummyData = [
  { name: "Arto Hellas", number: "040-123456", id: 1 },
  { name: "Ada Lovelace", number: "39-44-5323523", id: 2 },
  { name: "Dan Abramov", number: "12-43-234345", id: 3 },
  { name: "Mary Poppendieck", number: "39-23-6423122", id: 4 },
];

const App = () => {
  const [persons, setPersons] = useState(dummyData);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [search, setSearch] = useState("");

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
