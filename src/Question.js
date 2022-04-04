import React from "react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ReactHtmlParser from 'react-html-parser';
import { GiFire } from 'react-icons/gi';
import "./Question.css"

const difficulties = {"easy": 1, "medium": 2, "hard": 3};

function buildAnswers(currentQuestion) {
  const correctAnswer = {
    text: currentQuestion.correct_answer,
    correct: true
  };
  const answers = [];
  currentQuestion.incorrect_answers.forEach(incorrectAnswer => {
    answers.push({
      text: incorrectAnswer,
      correct: false
    });
  });
  const randomIndex = Math.floor(Math.random() * answers.length)
  answers.splice(randomIndex, 0, correctAnswer);
  // console.log(randomIndex);
  return answers;
}

function Question() {
  // process.env.REACT_APP_UNSPLASH_API_KEY
  const [questions, setQuestions] = useState({results: []});
  const [questionIndex, setQuestionIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState({question: ""});
  const [answers, setAnswers] = useState([]);
  const [counter, setCounter] = useState(3);
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

  const nextQuestion = (answer) => {
    const nextQuestionIndex = questionIndex + 1;
    if (answer.correct) {
      setScore(score + 1);
    }
    if (nextQuestionIndex === questionsAmount) {
      navigate("/score", {state: {score: score}});
    } else {
      const currentQuestion = questions[nextQuestionIndex];
      const answers = buildAnswers(currentQuestion);
      setCurrentQuestion(currentQuestion);
      setAnswers(answers);
      setQuestionIndex(nextQuestionIndex);
    }
  }

  const onAnimationIteration = () => {
    setCounter(counter - 1);
  };

  return (
    <div className="game">
      {(() => {
        if (counter === 0) {
          return (
            <div className="question">
              <p>Good luck, {location.state.name}</p>
              <p>Score: {score}</p>
              <h1>
                Question {questionIndex + 1}/{questionsAmount}
              </h1>
              <h1>{[...Array(difficulties[currentQuestion.difficulty])].map((e, i) =>
                  <span key={i} className="fire"><GiFire /></span>)}</h1>
              <h1>{ReactHtmlParser(currentQuestion.question)}</h1>
              <ol>
                {answers.map((answer, i) => (
                  <li key={i}>
                    <button
                      className="card-btn" onClick={() => nextQuestion(answer)}>
                        <span className="small-numbers">{ i + 1 }.</span> {ReactHtmlParser(answer.text)}
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
