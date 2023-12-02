import { Fragment } from "react";
import Header from "./Header";
import Content from "./Content";

const Course = ({ course }) => {
  console.log("Course", course);

  return (
    <>
      <h1>Web Development Curriculum</h1>
      {course.map((c) => {
        return (
          <Fragment key={c.id}>
            <Header course={c} />
            <Content course={c} />
          </Fragment>
        );
      })}
    </>
  );
};

export default Course;
