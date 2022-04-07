import React, { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ReactHtmlParser from 'react-html-parser';
import "./Score.css"
import ReactCanvasConfetti from "react-canvas-confetti";
import { useKeyPressHandler } from './common/keypress'
import { StartAnimation } from './animation'
import { GiFire } from 'react-icons/gi';

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
      congratulations += "<br/>Try a harder level!";
    }
  } else if (location.state.score >= goodFrom) {
    animation = StartAnimation()
    congratulations = "It's a good result, well done!";
  } else {
    congratulations = "It's not a lot, but don't worry!";
    if (location.state.difficulty === "hard" || location.state.difficulty === "medium") {
      congratulations += "<br/>Maybe you want to<span>&nbsp;</span>try an<span>&nbsp;</span>easier level?";
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
    <div className="app">
      <div className="congratulations">
        <p>Hey, {location.state.playerName}!</p>
        <h1><GiFire />Your score is {location.state.score}<GiFire /></h1>
        <p>{ReactHtmlParser(congratulations)}</p>
        <button className="orange-again-btn" onClick={() => startOver()}>Play again</button>
      </div>
      {animation &&
      <ReactCanvasConfetti refConfetti={animation.getInstance} style={canvasStyles} />
      }
    </div>
  );
}

export default Score;
