const Persons = ({personsList}) => {
  return (
    <div>
      {personsList.map((person) => (
        <p key={person.id}>
          {person.name} {person.number}
        </p>
      ))}
    </div>
  );
};

export default Persons;