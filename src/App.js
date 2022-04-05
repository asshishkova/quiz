import React from "react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useKeyPressHandler } from './keypress'
import "./App.css"

function Game() {
  const navigate = useNavigate();
  const location = useLocation();
  let initialName = "";
  if (location.state) {
    initialName = location.state.name
  }
  const [name, setName] = useState(initialName);

  const startGame = () => {
    navigate("/question", {state: {name: name}});
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
      <p><button className="orange-start-btn" onClick={() => startGame()}>START</button></p>
    </div>
  );
}

function App() {
  return (
    <div className="game">
      <div>
        <h1>Welcome to the Quiz!</h1>
        <div className="rules-div">
          <input type="checkbox" id="rules"></input>
          <h2 className="show-rules">Rules</h2>
          <p className="rules">She said for $300 she'll do it.</p>
        </div>
        <p>
          Enter your name:
        </p>
        <Game />
      </div>
    </div>
  );
}

export default App;
