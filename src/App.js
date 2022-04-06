import React from "react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useKeyPressHandler } from './keypress'
import "./App.css"
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
      <div className="radio-button">
        <input type="radio" id="radio1" name="radios" value="easy"
          onChange={(e) => setDifficulty(e.target.value)} checked = {difficulty === "easy"}/>
        <label htmlFor="radio1"><span className="fire"><GiFire/></span></label>
        <input type="radio" id="radio2" name="radios" value="medium"
          onChange={(e) => setDifficulty(e.target.value)} checked = {difficulty === "medium"}/>
        <label htmlFor="radio2"><span className="fire"><GiFire /><GiFire /></span></label>
        <input type="radio" id="radio3" name="radios" value="hard"
          onChange={(e) => setDifficulty(e.target.value)} checked = {difficulty === "hard"}/>
        <label htmlFor="radio3"><span className="fire"><GiFire /><GiFire /><GiFire /></span></label>
      </div>
      <p><button className="orange-start-btn" onClick={() => startGame()}>START</button></p>
      <div className="rules">
          <input type="checkbox" id="rules" />
          <h2><label htmlFor="rules">Rules</label></h2>
          <ul>
            <li>Every time there are 10 different questions,
                for<span>&nbsp;</span>each question
                there is<span>&nbsp;</span>only one correct answer.</li>
            <li>You can either click on<span>&nbsp;</span>the<span>&nbsp;</span>answer
                or press its number on<span>&nbsp;</span>the<span>&nbsp;</span>keyboard.</li>
            <li>For each question you have 30 seconds.</li>
            <li>Every right answer increases your score
                by<span>&nbsp;</span>the<span>&nbsp;</span>amount of<span>&nbsp;</span>seconds left
                multiplied by<span>&nbsp;</span>a<span>&nbsp;</span>difficulty factor.</li>
            <li>If the half of<span>&nbsp;</span>the<span>&nbsp;</span>time is already passed
                you can get a<span>&nbsp;</span>50:50<span>&nbsp;</span>hint, but then you receive
                only half of<span>&nbsp;</span>the<span>&nbsp;</span>poins for<span>&nbsp;</span>this answer.</li>
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
