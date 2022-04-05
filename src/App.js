import React from "react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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

  const handleKeypress = e => {
    if (e.key === "Enter") {
      startGame();
    }
  };

  return (
    <div>
      <input autoFocus value={name}
        onChange={e => setName(e.target.value)}
        onKeyPress={handleKeypress}
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
        <p>
          Enter your name:
        </p>
        <Game />
      </div>
    </div>
  );
}

export default App;
