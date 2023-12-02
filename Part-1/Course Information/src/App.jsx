const Header = (props) => {
  console.log("Header component props:", props);
  return <h1>{props.course.name}</h1>;
};

const Content = (props) => {
  console.log("Content component props:", props);

  let parts = props.course.parts;

  return (
    <>
      {parts.map((p) => (
        <Part key={p.name} part={p.name} exercise={p.exercises} />
      ))}
    </>
  );
};

const Part = (props) => {
  console.log("Part component props:", props);

  return (
    <p>
      {props.part} {props.exercise}
    </p>
  );
};

const Total = (props) => {
  console.log("Total component props:", props);

  let parts = props.course.parts;
  
  let result = 0;
  parts.forEach((part) => (result += part.exercises));

  return <p>Number of exercises {result}</p>;
};

const App = () => {
  const course = {
    name: "Half Stack application development",
    parts: [
      {
        name: "Fundamentals of React",
        exercises: 10,
      },
      {
        name: "Using props to pass data",
        exercises: 7,
      },
      {
        name: "State of a component",
        exercises: 14,
      },
    ],
  };

  return (
    <div>
      <Header course={course} />
      <Content course={course} />
      <Total course={course} />
    </div>
  );
};

export default App;
