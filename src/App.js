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

  return (
    <div>
      <input value={name} onChange={e => setName(e.target.value)}/>
      <button className="btn-gradient" onClick={() => startGame()}>Start</button>
    </div>
  );
}

function App() {
  return (
    <div className="game">
      <p>
        Enter your name:
      </p>
      <Game />
    </div>
  );
}

export default App;
