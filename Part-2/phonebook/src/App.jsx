import { useState, useEffect } from "react";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import personService from "./services/axiosPerson";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [search, setSearch] = useState("");

  // Using this to fix issue when (nth - 1) person is deleted
  // Afterwards if a new person is added, it will have same ID as the nth person
  let nextId =
    persons.length > 0 &&
    persons.reduce(
      (prev, curr) => (prev.id > curr.id ? prev : curr),
      persons[persons.length - 1]
    ).id + 1;

  useEffect(() => {
    console.log("Effect is now running");

    personService.getAllPersons().then((initialData) => {
      console.log("Displaying Response from Server");
      return setPersons(initialData);
    });
  }, []);

  // This snippet was taken from React Official Documentation
  // https://react.dev/learn/sharing-state-between-components#challenges
  let numbers = persons.filter((person) =>
    person.name
      .split(" ")
      .some((name) => name.toLowerCase().startsWith(search.toLowerCase()))
  );

  const handleName = (e) => setNewName(e.target.value);
  const handleNumber = (e) => setNewNumber(e.target.value);
  const handleSearch = (e) => setSearch(e.target.value);

  const addPerson = (e) => {
    e.preventDefault();

    if (persons.some((person) => person.name === newName)) {
      let matchedPerson = persons.find((person) => person.name === newName);

      if (matchedPerson.number === newNumber) {
        console.log("Same name and number already in the phonebook");

        alert(`${newName} is already added in the phonebook`);
        return;
      }

      console.log("Same name but different number in the phonebook");
      if (
        window.confirm(
          `${newName} is already added in the phonebook. Do you want to replace the old number with the new one?`
        )
      ) {
        let updatedPerson = {
          name: newName,
          number: newNumber,
          id: matchedPerson.id,
        };

        personService
          .updateAPerson(matchedPerson.id, updatedPerson)
          .then((updatedPerson) =>
            setPersons(
              persons.map((person) =>
                person.id === updatedPerson.id ? updatedPerson : person
              )
            )
          );
          console.log("Person successfully updated");
      } else {
        console.log("Update cancelled");
      }
    } else {
      let newPerson = {
        name: newName,
        number: newNumber,
        id: nextId,
      };
      let clearInputFields = () => {
        setNewName("");
        setNewNumber("");
        setSearch("");
      };

      personService.createNewPerson(newPerson).then((newPersonAdded) => {
        setPersons(persons.concat(newPersonAdded));
        clearInputFields();
      });
    }
  };

  const deletePerson = (id) => {
    let deletedPerson = persons.find((person) => person.id === id);

    if (window.confirm(`Delete ${deletedPerson.name} ?`)) {
      personService
        .deleteAPerson(id)
        .then(() => setPersons(persons.filter((person) => person.id !== id)));
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>

      <Filter value={search} onChange={handleSearch} />

      <h3>Add a New</h3>

      <PersonForm
        valueName={newName}
        valueNumber={newNumber}
        onChangeName={handleName}
        onChangeNumber={handleNumber}
        onSubmit={addPerson}
      />

      <h3>Numbers</h3>

      <Persons personsList={numbers} handleDelete={deletePerson} />
    </div>
  );
};

export default App;
