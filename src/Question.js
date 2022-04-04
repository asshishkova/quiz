import React from "react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ReactHtmlParser from 'react-html-parser';
import { FaUndo } from 'react-icons/fa';
import "./Question.css"

const difficulties = {"easy": 1, "medium": 2, "hard": 3};
const secondsForAnswer = 15;
const defaultTimerClassName = "seconds";
const defaultAnswerClassName = "card-btn regular-card";

function buildAnswers(currentQuestion) {
  const correctAnswer = {
    text: currentQuestion.correct_answer,
    correct: true,
    class: defaultAnswerClassName
  };
  const answers = [];
  currentQuestion.incorrect_answers.forEach(incorrectAnswer => {
    answers.push({
      text: incorrectAnswer,
      correct: false,
      class: defaultAnswerClassName
    });
  });
  const randomIndex = Math.floor(Math.random() * answers.length)
  // console.log(randomIndex + 1);
  answers.splice(randomIndex, 0, correctAnswer);
  answers.forEach((answer, i) => {
    answer.index = i;
  });
  return answers;
}

function Question() {
  // process.env.REACT_APP_UNSPLASH_API_KEY
  const [questions, setQuestions] = useState({results: []});
  const [questionIndex, setQuestionIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState({question: ""});
  const [answers, setAnswers] = useState([]);
  const [startGameCounter, setStartGameCounter] = useState(3);
  const [timer, setTimer] = useState(secondsForAnswer);
  const [timerClassName, setTimerClassName] = useState(defaultTimerClassName);
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
    let updatedAnswers = answers;
    setTimerClassName("");
    if (answer.correct) {
      setScore(score + timer * difficulties[currentQuestion.difficulty]);
      updatedAnswers[answer.index].class = "card-btn correct-card";
    } else if (answer.index >= 0) {
      updatedAnswers[answer.index].class = "card-btn incorrect-card";
    }
    setAnswers(updatedAnswers)
    setTimeout(() => {
      nextQuestion();
    }, 2000);
  }

  const nextQuestion = () => {
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

  const onAnimationIteration = () => {
    setStartGameCounter(startGameCounter - 1);
  };

  const onTimerAnimationIteration = () => {
    if (timer === 0) {
      answerClicked({text: "", correct: false, index: -1});
    } else {
      setTimer(timer - 1);
    }
  };

  return (
    <div className="game">
      {(() => {
        if (startGameCounter === 0) {
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
                </div>
                <div className="right-info">
                  <p>
                    <FaUndo className="start-over" title="Start over" onClick={() => navigate("/", location)}/>
                  </p>
                </div>
              </div>
              <h1>{ReactHtmlParser(currentQuestion.question)}</h1>
              <ol>
                {answers.map((answer, i) => (
                  <li key={i}>
                    <button
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
