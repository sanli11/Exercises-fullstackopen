import Part from "./Part.jsx";

const Content = ({ course }) => {
  let parts = course.parts;
  console.log("Content Parts:", parts);

  let total = parts.reduce((prev, curr) => prev + curr.exercises, 0);

  return (
    <>
      {parts.map((p) => (
        <Part key={p.id} part={p} />
      ))}
      <p><b>Total of {total} Exercises</b></p>
    </>
  );
};

export default Content;
