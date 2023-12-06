import { useState, useEffect } from "react";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import personService from "./services/axiosPerson";

const App = () => {
  /*
      States
  */
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [search, setSearch] = useState("");

  /*
      Variables
  */
  // Using this to fix issue when (nth - 1) person is deleted
  // Afterwards if a new person is added, it will have same ID as the nth person
  let nextId =
    persons.length > 0 &&
    persons.reduce(
      (prev, curr) => (prev.id > curr.id ? prev : curr),
      persons[persons.length - 1]
    ).id + 1;

  /*
      Effects
  */
  useEffect(() => {
    console.log("Effect is now running");

    personService.getAllPersons().then((initialData) => {
      console.log("Displaying Response from Server");
      return setPersons(initialData);
    });
  }, []);

  /*
      Functions
  */
  // This snippet was taken from React Official Documentation
  // https://react.dev/learn/sharing-state-between-components#challenges
  let numbers = persons.filter((person) =>
    person.name
      .split(" ")
      .some((name) => name.toLowerCase().startsWith(search.toLowerCase()))
  );

  /*
    Input Event Handler Functions
  */
  const handleName = (e) => setNewName(e.target.value);
  const handleNumber = (e) => setNewNumber(e.target.value);
  const handleSearch = (e) => setSearch(e.target.value);

  /*
    Button Event Handler Functions
  */
  const deletePerson = (id) => {
    let deletedPerson = persons.find((person) => person.id === id);

    if (window.confirm(`Delete ${deletedPerson.name} ?`)) {
      personService
        .deleteAPerson(id)
        .then(() => setPersons(persons.filter((person) => person.id !== id)));
    }
  };

  const addPerson = (e) => {
    e.preventDefault();

    /*
      When name is same as an existing person
    */
    if (persons.some((person) => person.name === newName)) {
      let matchedPerson = persons.find((person) => person.name === newName);

      /*
        When number is also same as the existing person
      */
      if (matchedPerson.number === newNumber) {
        alert(`${newName} is already added in the phonebook`);
        return;
      }

      /*
        When number is different from the existing person
      */
      let windowText = `${newName} is already added in the phonebook. Do you want to replace the old number with the new one?`;
      if (window.confirm(windowText)) {
        matchedPerson = { ...matchedPerson, number: newNumber };

        personService
          .updateAPerson(matchedPerson.id, matchedPerson)
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
      /*
      When name is different from an existing person
    */
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
