import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ReactHtmlParser from 'react-html-parser';
import ReactCanvasConfetti from "react-canvas-confetti";
import { GiFire } from 'react-icons/gi';
import { useKeyPressHandler } from '../common/keypress';
import * as common from '../common/common';
import { CreateOneShotConfettiAnimation } from "../common/confetti/oneShotConfetti";
import { CreateEndlessConfettiAnimation } from '../common/confetti/endlessConfetti';
import { canvasStyles } from "../common/confetti/canvasStyle";

import "./Score.css";


function Score() {
  const navigate = useNavigate();
  const location = useLocation();

  const maximumPoints = location.state.amount
                        * location.state.secondsForAnswer
                        * common.difficulties[location.state.difficulty];

  const goodFrom = maximumPoints / 4;
  const excellentFrom = maximumPoints - goodFrom;

  let confettiAnimation = CreateOneShotConfettiAnimation()

  let congratulations = "";
  if (location.state.score >= excellentFrom) {
    confettiAnimation = CreateEndlessConfettiAnimation();
    congratulations = "WOW! You are on top!";
    if (location.state.difficulty === "easy" || location.state.difficulty === "medium") {
      congratulations += "<br/>Try a harder level!";
    }
  } else if (location.state.score >= goodFrom) {
    confettiAnimation = CreateEndlessConfettiAnimation();
    congratulations = "It's a good result, well done!";
  } else {
    congratulations = "It's not a lot, but don't worry!";
    if (location.state.difficulty === "hard" || location.state.difficulty === "medium") {
      congratulations += "<br/>Maybe you want to<span>&nbsp;</span>try an<span>&nbsp;</span>easier level?";
    }
  }

  useEffect(() => {
    confettiAnimation.startAnimation();
  }, [confettiAnimation]);

  const startOver = () => {
    confettiAnimation.stopAnimation()
    navigate("/", location);
  };

  const handler = ({ key }) => {
    if (key === "Enter") {
      startOver();
    }
  };

  useKeyPressHandler(handler);

  return (
    <div className="app">
      <div className="congratulations">
        <div>
          <p>Hey, {location.state.displayedPlayerName}!</p>
          <h1><GiFire />Your score is {location.state.score}<GiFire /></h1>
          <p>{ReactHtmlParser(congratulations)}</p>
          <button className="orange-play-again-btn" onClick={() => startOver()}>Play again</button>
        </div>
      </div>
      <ReactCanvasConfetti refConfetti={confettiAnimation.getInstance} style={canvasStyles} />
    </div>
  );
}

export default Score;
