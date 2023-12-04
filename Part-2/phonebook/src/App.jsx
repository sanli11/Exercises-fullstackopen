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
      alert(`${newName} is already added in the phonebook`);
    } else {
      let newPerson = {
        name: newName,
        number: newNumber,
        id: persons.length + 1,
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
    if (window.confirm("Are you sure you want to delete this person?")) {
      let newPerson = [...persons];

      personService
        .deleteAPerson(id)
        // .then(() => {
        //   // Since the phonebook works with incremental ID
        //   // If the nth-1 person is deleted, an error will be returned if new person is added.
        //   // Fix for it - fix the gap in IDs of person by following code:
        //   // Not sure if this is the best way to do this
        //   let personsLen = persons.length;

        //   if (id < personsLen + 1) {
        //     console.log("Fixing the gap in IDs of person");

        //     for (let i = id; i < personsLen; i++) {
        //       let nextPerson = persons[i];
        //       console.log("Next Person: ", nextPerson);

        //       let fixedPerson = {
        //         name: nextPerson.name,
        //         number: nextPerson.number,
        //         id: i,
        //       };

        //       personService
        //         .deleteAPerson(nextPerson.id)
        //         .then(() => personService.createNewPerson(fixedPerson))
        //         .then(() => {
        //           newPerson = newPerson.map((person) => {
        //             if (person.id === nextPerson.id) {
        //               return fixedPerson;
        //             } else {
        //               return person;
        //             }
        //           });
        //         })
        //         .catch((error) => console.log("Error updating IDs"));
        //     }
        //   }
        // })
        // .then(() => setPersons(newPerson));
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
