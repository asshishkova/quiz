import React, { useEffect, useState, useCallback, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ReactHtmlParser from 'react-html-parser';
import { FaUndo } from "react-icons/fa";
import { useKeyPressHandler } from './keypress'
import "./Question.css";
import ReactCanvasConfetti from "react-canvas-confetti";
import _ from "underscore";

const difficulties = {"easy": 1, "medium": 2, "hard": 3};
const secondsForAnswer = 20;
const defaultTimerClassName = "blinking" ;
const defaultAnswerClassName = "card-btn regular-card";

const canvasStyles = {
  position: "fixed",
  pointerEvents: "none",
  width: "100%",
  height: "100%",
  top: 0,
  left: 0
};

function buildAnswers(currentQuestion) {
  const correctAnswer = {
    text: currentQuestion.correct_answer,
    correct: true,
    class: defaultAnswerClassName,
    disabled: false
  };
  const answers = [];
  currentQuestion.incorrect_answers.forEach(incorrectAnswer => {
    answers.push({
      text: incorrectAnswer,
      correct: false,
      class: defaultAnswerClassName
    });
  });
  if (currentQuestion.type === "boolean") {
    if (correctAnswer.text === "True"){
      answers.splice(0, 0, correctAnswer);
    } else {
      answers.splice(1, 0, correctAnswer);
    }
  } else  {
    const randomIndex = Math.floor(Math.random() * answers.length)
    answers.splice(randomIndex, 0, correctAnswer);
  }
  answers.forEach((answer, i) => {
    answer.index = i;
  });
  return answers;
}

function Question() {
  const refAnimationInstance = useRef(null);

  const getInstance = useCallback((instance) => {
    refAnimationInstance.current = instance;
  }, []);

  const makeShot = useCallback((particleRatio, opts) => {
    refAnimationInstance.current &&
      refAnimationInstance.current({
        ...opts,
        origin: { y: 0.7 },
        particleCount: Math.floor(200 * particleRatio)
      });
  }, []);

  const fire = useCallback(() => {
    makeShot(0.25, {
      spread: 26,
      startVelocity: 55
    });

    makeShot(0.2, {
      spread: 60
    });

    makeShot(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8
    });

    makeShot(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2
    });

    makeShot(0.1, {
      spread: 120,
      startVelocity: 45
    });
  }, [makeShot]);

  // process.env.REACT_APP_UNSPLASH_API_KEY
  const [questions, setQuestions] = useState({results: []});
  const [questionIndex, setQuestionIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState({question: ""});
  const [answers, setAnswers] = useState([]);
  const [startGameCounter, setStartGameCounter] = useState(3);
  const [timer, setTimer] = useState(secondsForAnswer);
  const [timerClassName, setTimerClassName] = useState(defaultTimerClassName);
  const [disabledButton, setDisabledButton] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    fetch("/.netlify/functions/async-getquestions")
    .then(response => response.json())
    .then(response => {
      const questions = response.results;
      const questionIndex = 0;
      const currentQuestion = questions[questionIndex];
      const answers = buildAnswers(currentQuestion);
      setCurrentQuestion(currentQuestion);
      setAnswers(answers);
      setQuestions(questions);
    })
  }, []);

  const navigate = useNavigate();
  const location = useLocation();
  const questionsAmount = questions.length;
  let playerName = "Guest";
  const stateName = location.state.name.trim();
  if (stateName.length > 0) {
    playerName = stateName;
  }

  const answerClicked = (answer) => {
    setDisabledButton(true);
    let updatedAnswers = answers.slice();
    setTimerClassName("");
    if (answer.correct) {
      fire()
      setScore(score + timer * difficulties[currentQuestion.difficulty]);
      updatedAnswers[answer.index].class = "card-btn correct-card";
    } else if (answer.index >= 0) {
      updatedAnswers[answer.index].class = "card-btn incorrect-card";
    }
    setAnswers(updatedAnswers);
    setTimeout(() => {
      if (refAnimationInstance.current) {
        if (answer.correct) {
          refAnimationInstance.current.reset();
        }
        nextQuestion();
      }
    }, 2000);
  }

  const nextQuestion = () => {
    setDisabledButton(false);
    setHintUsed(false);
    setTimer(secondsForAnswer);
    setTimerClassName(defaultTimerClassName);
    const nextQuestionIndex = questionIndex + 1;
    if (nextQuestionIndex === questionsAmount) {
      navigate("/score", {state: {score: score, playerName: playerName, name: location.state.name}});
    } else {
      const currentQuestion = questions[nextQuestionIndex];
      const answers = buildAnswers(currentQuestion);
      setCurrentQuestion(currentQuestion);
      setAnswers(answers);
      setQuestionIndex(nextQuestionIndex);
    }
  }

  const startOver = () => {
    navigate("/", location)
  }

  const hint5050 = () => {
    setHintUsed(true);
    let updatedAnswers = answers.slice();
    const indexes = [...Array(answers.length).keys()];
    const halfIndexes = _.sample(indexes, answers.length  / 2);
    const restIndexes = indexes.filter(i => !halfIndexes.includes(i));
    let isCorrectHalfIndexes = []
    halfIndexes.forEach(index => {
      isCorrectHalfIndexes.push(updatedAnswers[index]);
    });
    if (isCorrectHalfIndexes.includes(true)) {
      updatedAnswers = disableAnswers(updatedAnswers, restIndexes);
    } else {
      updatedAnswers = disableAnswers(updatedAnswers, halfIndexes);
    }
    setAnswers(updatedAnswers);
  }

  const disableAnswers = (answers, indexes) => {
    indexes.forEach(index => {
      answers[index].disabled = true;
      answers[index].class = "card-btn disabled-card";
    });
    return answers;
  }

  const onAnimationIteration = () => {
    setStartGameCounter(startGameCounter - 1);
  };

  const onTimerAnimationIteration = () => {
    if (timer > 0) {
      setTimer(timer - 1);
    }
    if (timer === 1) {
      answerClicked({text: "", correct: false, index: -1});
    }
  };

  const handler = ({ key }) => {
    if (!disabledButton) {
      const parsedKey = parseInt(key) - 1;
      const keys = [...Array(answers.length).keys()];
      if (keys.includes(parsedKey)) {
        answerClicked(answers[parsedKey]);
      }
    }
  };

  useKeyPressHandler(handler);

  return (
    <div className="game">
      {(() => {
        if (startGameCounter > 0) {
          return (
            <div className="question">
              <div className="game-info">
                <div className="left-info">
                  <p>Player: {playerName}</p>
                  <p>
                    Question {questionIndex + 1}/{questionsAmount}
                  </p>
                </div>
                <div className="center-info">
                  <p>Score: {score}</p>
                  <p onAnimationIteration={onTimerAnimationIteration} className={timerClassName}>{timer}</p>
                  <ReactCanvasConfetti refConfetti={getInstance} style={canvasStyles} />
                </div>
                <div className="right-info">
                  <p>
                    <FaUndo className="start-over" title="Start over" onClick={() => startOver()}/>
                  </p>
                  {timer === 0 &&
                    <p className="blinking" >Time's up</p>
                  }
                  {answers.length > 2 && !disabledButton && !hintUsed && timer <= secondsForAnswer / 2 && timer > 0 &&
                    <p className="blinking hint" onClick={() => hint5050()}>50:50 hint</p>
                  }
                </div>
              </div>
              <h1>{ReactHtmlParser(currentQuestion.question)}</h1>
              <ol>
                {answers.map((answer, i) => (
                  <li key={i}>
                    <button disabled={disabledButton || answer.disabled}
                      className={answer.class} onClick={() => answerClicked(answer)}>
                        <span className="small-numbers">{ i + 1 }.</span> {ReactHtmlParser(answer.text)}
                    </button>
                  </li>
                ))}
              </ol>
            </div>
          )
        } else {
          return (
            <p onAnimationIteration={onAnimationIteration} className="growing">{startGameCounter}</p>
          )
        }
      })()}
    </div>
  )
}

export default Question;
