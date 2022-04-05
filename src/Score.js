import React, { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Score.css"
import ReactCanvasConfetti from "react-canvas-confetti";
import { useKeyPressHandler } from './keypress'
import { StartAnimation } from './animation'

const canvasStyles = {
  position: "fixed",
  pointerEvents: "none",
  width: "100%",
  height: "100%",
  top: 0,
  left: 0
};

function Score() {
  const navigate = useNavigate();
  const location = useLocation();
  let animation;
  const difficulties = {"easy": 1, "medium": 2, "hard": 3};

  const maximumPoints = location.state.amount
                        * location.state.secondsForAnswer
                        * difficulties[location.state.difficulty];

  const goodFrom = maximumPoints / 3;
  const excellentFrom = maximumPoints - goodFrom;

  let congratulations = "";
  if (location.state.score >= excellentFrom) {
    animation = StartAnimation()
    congratulations = "WOW! You are on top!";
    if (location.state.difficulty === "easy" || location.state.difficulty === "medium") {
      congratulations += " Try a harder level! ;)";
    }
  } else if (location.state.score >= goodFrom) {
    animation = StartAnimation()
    congratulations = "It's a good result, well done!";
  } else {
    congratulations = "It's not a lot, but don't worry!";
    if (location.state.difficulty === "hard" || location.state.difficulty === "medium") {
      congratulations += " Try an easier level!";
    }
  }

  const startOver = useCallback(() => {
    if (animation) {
      animation.stopAnimation()
    }
    navigate("/", location);
  }, [animation, navigate, location]);

  const handler = ({ key }) => {
    if (key === "Enter") {
      startOver();
    }
  };

  useKeyPressHandler(handler);

  return (
    <div className="game">
      <div>
        <h2>Hey {location.state.playerName}</h2>
        <h1>Your score is {location.state.score}</h1>
        <p>{congratulations}</p>
        <button className="orange-again-btn" onClick={() => startOver()}>Play again</button>
      </div>
      {animation &&
      <ReactCanvasConfetti refConfetti={animation.getInstance} style={canvasStyles} />
      }
    </div>
  );
}

export default Score;
