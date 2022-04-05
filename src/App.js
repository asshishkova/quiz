import React from "react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useKeyPressHandler } from './keypress'
import "./App.css"
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { GiFire } from 'react-icons/gi';

function Game() {
  const navigate = useNavigate();
  const location = useLocation();
  let initialName = "";
  let initialDifficulty = "medium";
  if (location.state) {
    initialName = location.state.name;
    initialDifficulty = location.state.difficulty;
  }
  const [name, setName] = useState(initialName);
  const [difficulty, setDifficulty] = useState(initialDifficulty);

  const startGame = () => {
    navigate("/question", {state: {name: name, difficulty: difficulty}});
  }

  const handler = ({ key }) => {
    if (key === "Enter") {
      startGame();
    }
  };

  useKeyPressHandler(handler);

  return (
    <div>
      <input autoFocus value={name}
        onChange={e => setName(e.target.value)}
      />
      <p>Choose the level:</p>
      <FormControl>
        <FormLabel className="levels"></FormLabel>
        <RadioGroup key={difficulty} row defaultValue={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
          <FormControlLabel value="easy" control={<Radio />} label={<span><GiFire /></span>} />
          <FormControlLabel value="medium" control={<Radio />} label={<span><GiFire /><GiFire /></span>} />
          <FormControlLabel value="hard" control={<Radio />} label={<span><GiFire /><GiFire /><GiFire /></span>} />
        </RadioGroup>
      </FormControl>
      <p><button className="orange-start-btn" onClick={() => startGame()}>START</button></p>
      <div className="rules">
          <input type="checkbox" id="rules" />
          <h2><label htmlFor="rules">Rules</label></h2>
          <ul>
            <li>Every time there are 10 different questions,
                for each question there is only one correct answer.</li>
            <li>You can either click on the answer
                or press its number on the keyboard.</li>
            <li>For each question you have 30 seconds.</li>
            <li>Every right answer increases your score
                by the amount of seconds left
                multiplied by difficulty factor.</li>
            <li>If the half of the time is already passed
                you can get a 50:50 hint, but then you receive
                only half of the poins for this answer.</li>
          </ul>
        </div>
    </div>
  );
}

function App() {
  return (
    <div className="game">
      <div className="welcome">
        <h1>Welcome to the Quiz!</h1>
        <p>
          Enter your name:
        </p>
        <Game />
      </div>
    </div>
  );
}

export default App;
