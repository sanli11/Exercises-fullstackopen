import { useState } from "react";

/*
    Anecdote component
*/
const Anecdote = ({ heading, anecdote, votes }) => {
  return (
    <>
      <h1>{heading}</h1>
      <p>{anecdote}</p>
      <p>- has {votes} votes</p>
    </>
  );
};

/*
    Button component
*/
const Button = ({ handleClick, buttonText }) => {
  return <button onClick={handleClick}>{buttonText}</button>;
};

/*
    App component
*/
const App = () => {
  const anecdotes = [
    "If it hurts, do it more often.",
    "Adding manpower to a late software project makes it later!",
    "The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    "Premature optimization is the root of all evil.",
    "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
    "Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.",
    "The only way to go fast, is to go well.",
  ];

  let randomIndex = (Math.random() * anecdotes.length) | 0;

  const [selected, setSelected] = useState(randomIndex);
  const [points, setPoints] = useState(Array(anecdotes.length).fill(0));

  // Probably not the best way to do this
  // let highestVotes = points.reduce((prev, curr) => (curr > prev ? curr : prev), points[0]);
  // let mostVoted = points.indexOf(highestVotes);

  let mostVoted = points.indexOf(Math.max(...points));

  const handleVote = () => {
    const newPoints = [...points];
    newPoints[selected] += 1;

    setPoints(newPoints);
  };

  const handleNext = () => {
    // To not show same anecdote twice in a row
    while (randomIndex === selected) {
      randomIndex = (Math.random() * anecdotes.length) | 0;
    }

    setSelected(randomIndex);
  };

  return (
    <div>
      <Anecdote
        heading="Anecdote of the Day"
        anecdote={anecdotes[selected]}
        votes={[points[selected]]}
      />

      <Button handleClick={handleVote} buttonText={"Vote"} />
      <Button handleClick={handleNext} buttonText={"Next Anecdote"} />

      <Anecdote
        heading="Anecdote with Most Votes"
        anecdote={anecdotes[mostVoted]}
        votes={[points[mostVoted]]}
      />
    </div>
  );
};

export default App;
