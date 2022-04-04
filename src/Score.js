import React from "react";
// import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Score.css"

function Score() {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <div className="game">
      <div>
        <h1>Congratulations, {location.state.playerName}</h1>
        <h1>Your score is {location.state.score}</h1>
        <button className="orange-again-btn" onClick={() => navigate("/", location)}>Again?</button>
      </div>
    </div>
  );
}

export default Score;
