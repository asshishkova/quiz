import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useKeyPressHandler } from '../common/keypress'
import { GiFire } from 'react-icons/gi';
import * as common from '../common/common';
import "./Start.css"

const defaultDifficulty = "medium";

function Start() {
  const navigate = useNavigate();
  const location = useLocation();

  let currentPlayerName = "";
  let currentDifficulty = defaultDifficulty;

  if (location.state) {
    currentPlayerName = location.state.inputPlayerName;
    currentDifficulty = location.state.difficulty;
  }

  const [inputPlayerName, setInputPlayerName] = useState(currentPlayerName);
  const [difficulty, setDifficulty] = useState(currentDifficulty);

  const startGame = () => {
    navigate("/game",{ state: {
      inputPlayerName: inputPlayerName,
      difficulty: difficulty}
    });
  }

  const keyPressHandler = ({ key }) => {
    if (key === "Enter") {
      startGame();
    }
  };

  useKeyPressHandler(keyPressHandler);

  return (
    <div className="app">
      <div className="welcome">
        <h1>Welcome to the Quiz!</h1>

        <p>Enter your name:</p>
        <input autoFocus value={inputPlayerName} maxLength="14"
          onChange={e => setInputPlayerName(e.target.value)} />

        <p>Choose the difficulty level:</p>
        <div className="radio-button">
          <input type="radio" id="easy" name="radios" value="easy"
            onChange={(e) => setDifficulty(e.target.value)} checked = {difficulty === "easy"}/>
          <label htmlFor="easy"><span><GiFire/></span></label>
          <input type="radio" id="medium" name="radios" value="medium"
            onChange={(e) => setDifficulty(e.target.value)} checked = {difficulty === "medium"}/>
          <label htmlFor="medium"><span><GiFire /><GiFire /></span></label>
          <input type="radio" id="hard" name="radios" value="hard"
            onChange={(e) => setDifficulty(e.target.value)} checked = {difficulty === "hard"}/>
          <label htmlFor="hard"><span><GiFire /><GiFire /><GiFire /></span></label>
        </div>
        <p><button className="orange-start-btn" onClick={() => startGame()}>START</button></p>

        <div className="dropdown-rules">
          <input type="checkbox" id="rules" />
          <h2><label htmlFor="rules">Rules</label></h2>
          <ul>
            <li>Every game there are {common.amountOfQuestions} different questions,
                for<span>&nbsp;</span>each question
                there is<span>&nbsp;</span>only one correct answer.</li>
            <li>You can either click on<span>&nbsp;</span>the<span>&nbsp;</span>answer
                or press its number on<span>&nbsp;</span>the<span>&nbsp;</span>keyboard.</li>
            <li>For each question you have {common.secondsForAnswer} seconds.</li>
            <li>Every right answer increases your score
                by<span>&nbsp;</span>the<span>&nbsp;</span>amount of<span>&nbsp;</span>seconds left
                multiplied by<span>&nbsp;</span>a<span>&nbsp;</span>difficulty factor.</li>
            <li>After the first<span>&nbsp;</span>{common.secondsBeforeHint} seconds passed
                you can get a<span>&nbsp;</span>50:50<span>&nbsp;</span>hint, but then you get
                only half poins for<span>&nbsp;</span>this answer.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Start;
