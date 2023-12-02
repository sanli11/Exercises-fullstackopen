import { useState } from "react";
/*
    Button component
*/
const Button = ({ handleClick, buttonText }) => (
  <button onClick={handleClick}>{buttonText}</button>
);

/*
    StatisticLine component - prints a row from the statistics table
*/
const StatisticLine = ({ value, text }) => {
  return (
    <tr>
      <td colSpan={2}>{text}</td>
      <td colSpan={1}>{value}</td>
    </tr>
  );
};

/*
    Statistics component - prints the statistics table
*/
const Statistics = ({ good, neutral, bad, count }) => {
  let all = good + neutral + bad;
  let average = (good - bad) / all;
  let positivePercentage = (good / all) * 100 + "%";

  if (count < 1) {
    return (
      <>
        <h1>Statistics</h1>
        <p>No Feedback Given</p>
      </>
    );
  }
  return (
    <>
      <h1>Statistics</h1>
      <table>
        <tbody>
          <StatisticLine value={good} text={"Good"} />
          <StatisticLine value={neutral} text={"Neutral"} />
          <StatisticLine value={bad} text={"Bad"} />
          <StatisticLine value={all} text={"All"} />
          <StatisticLine value={average} text={"Average"} />
          <StatisticLine value={positivePercentage} text={"Positive"} />
        </tbody>
      </table>
    </>
  );
};

/*
    App component
*/
const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);
  const [count, setCount] = useState(0);

  const handleGoodClick = () => {
    setGood(good + 1);

    let countFeedback = count + 1;
    setCount(countFeedback);
  };
  const handleNeutralClick = () => {
    setNeutral(neutral + 1);

    let countFeedback = count + 1;
    setCount(countFeedback);
  };
  const handleBadClick = () => {
    setBad(bad + 1);

    let countFeedback = count + 1;
    setCount(countFeedback);
  };

  return (
    <div>
      <h1>Give Feeback</h1>
      <>
        <Button handleClick={handleGoodClick} buttonText={"Good"} />
        <Button handleClick={handleNeutralClick} buttonText={"Neutral"} />
        <Button handleClick={handleBadClick} buttonText={"Bad"} />
      </>
      <Statistics good={good} neutral={neutral} bad={bad} count={count} />
    </div>
  );
};

export default App;
