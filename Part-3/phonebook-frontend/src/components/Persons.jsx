const Persons = ({ personsList, handleDelete }) => {
  return (
    <div>
      {personsList.map((person) => (
        <div key={person.id}>
          <button onClick={() => handleDelete(person.id)}>Delete</button>
          {"  "}
          <span>
            {person.name} {person.number}
          </span>
        </div>
      ))}
    </div>
  );
};

export default Persons;
