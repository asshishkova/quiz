import React from "react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ReactHtmlParser from 'react-html-parser';
import { GiFire } from 'react-icons/gi';
import "./Question.css"

const difficulties = {"easy": 1, "medium": 2, "hard": 3};

function Question() {
  // process.env.REACT_APP_UNSPLASH_API_KEY
  const [questions, setQuestions] = useState({results: []});
  const [questionIndex, setQuestionIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState({question: ""});
  const [answers, setAnswers] = useState([]);
  const [counter, setCounter] = useState(3);

  useEffect(() => {
    fetch("/.netlify/functions/async-getquestions")
    .then(response => response.json())
    .then(response => {
      const questions = response.results;
      const questionIndex = 0;
      const currentQuestion = questions[questionIndex];
      const answers = [currentQuestion.correct_answer].concat(currentQuestion.incorrect_answers);
      setCurrentQuestion(currentQuestion);
      setAnswers(answers);
      setQuestions(questions);
    })
  }, []);

  const navigate = useNavigate();
  const location = useLocation();
  const questionsAmount = questions.length;

  const nextQuestion = (nextQuestionIndex) => {
    if (nextQuestionIndex === questionsAmount) {
      navigate("/", location)
    } else {
      const currentQuestion = questions[nextQuestionIndex];
      const answers = [currentQuestion.correct_answer].concat(currentQuestion.incorrect_answers);
      setCurrentQuestion(currentQuestion);
      setAnswers(answers);
      setQuestionIndex(nextQuestionIndex);
    }
  }

  // useEffect(() => {
  //   if (counter > 0) {
  //     const intervalId = setInterval(() => {
  //       setCounter(counter - 1);
  //     }, 1000);

  //     return () => clearInterval(intervalId);
  //   }
  // }, [counter]);

  const onAnimationIteration = () => {
    setCounter(counter - 1);
  };

  return (
    <div className="game">
      {(() => {
        if (counter === 0) {
          return (
            <div className="question">
              <p>Good luck {location.state.name}</p>
              <h1>
                Question {questionIndex + 1}/{questionsAmount}
              </h1>
              <h1>{[...Array(difficulties[currentQuestion.difficulty])].map((e, i) =>
                  <span className="fire"><GiFire /></span>)}</h1>
              <h1>{ReactHtmlParser(currentQuestion.question)}</h1>
              <ol>
                {answers.map((answer, i) => (
                  <li key={i}>
                    <button
                      className="card-btn" onClick={() => nextQuestion(questionIndex + 1)}>
                        <span className="small-numbers">{ i + 1 }.</span> {ReactHtmlParser(answer)}
                    </button>
                  </li>
                ))}
              </ol>
              <button onClick={() => navigate("/", location)}>back</button>
            </div>
          )
        } else {
          return (
            <p onAnimationIteration={onAnimationIteration} className="growing">{counter}</p>
          )
        }
      })()}
    </div>
  )
}

export default Question;
