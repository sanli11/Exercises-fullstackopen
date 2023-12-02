const Header = ({ course }) => {
  let courseName = course.name;
  console.log("Course Name:", courseName);

  return <h2>{courseName}</h2>;
};

export default Header;
