import { useState, useEffect } from "react";
import "./index.css";
import Filter from "./components/Filter";
import Notification from "./components/Notification";
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
  const [error, setError] = useState(false);
  const [message, setMessage] = useState(null);

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
  let numbers = persons.filter((person) =>
    person.name
      .split(" ")
      .some((name) => name.toLowerCase().startsWith(search.toLowerCase()))
  );

  /*
      Functions
  */
  // This snippet was taken from React Official Documentation
  // https://react.dev/learn/sharing-state-between-components#challenges
  let clearInputFields = () => {
    setNewName("");
    setNewNumber("");
    setSearch("");
  };

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
        .then(() => {
          setMessage(`Deleted ${deletedPerson.name}`);
          setInterval(() => setMessage(null), 5000);

          setPersons(persons.filter((person) => person.id !== id));
        })
        .catch((error) => {
          console.log(
            `Error occurred while deleting ${deletedPerson.name}`,
            error.message
          );

          setError(true);
          setMessage(
            `Information of ${deletedPerson.name} has already been removed from the server`
          );
          setInterval(() => {
            setError(false);
            setMessage(null);
          }, 5000);
        });
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
          .then((updatedPerson) => {
            clearInputFields();
            setMessage(`Changed number for ${matchedPerson.name}`);
            setInterval(() => setMessage(null), 5000);

            setPersons(
              persons.map((person) =>
                person.id === updatedPerson.id ? updatedPerson : person
              )
            );
          })
          .catch((error) => {
            console.log(
              `Error occurred while changing ${matchedPerson.name}'s number`,
              error.message
            );

            setError(true);
            setMessage(
              `Information of ${newName} has already been removed from the server`
            );
            setInterval(() => {
              setError(false);
              setMessage(null);
            }, 5000);
          });

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

      personService
        .createNewPerson(newPerson)
        .then((newPersonAdded) => {
          setMessage(`Added ${newPersonAdded.name}`);
          setInterval(() => setMessage(null), 5000);

          setPersons(persons.concat(newPersonAdded));
          clearInputFields();
        })
        .catch((error) => {
          console.log(
            `Error occurred while adding ${newPerson.name}`,
            error.message
          );

          setError(true);
          setMessage(`Information of ${newName} already exists in the server`);
          setInterval(() => {
            setError(false);
            setMessage(null);
          }, 5000);
        });
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={message} error={error} />

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
