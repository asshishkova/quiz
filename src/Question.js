import React from "react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from 'axios';
import ReactHtmlParser from 'react-html-parser';
import { GiFire } from 'react-icons/gi';
import "./Question.css"


function Question() {
  const [questions, setQuestions] = useState({results: []});
  const [questionIndex, setQuestionIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState({question: ""});
  const [answers, setAnswers] = useState([]);

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

  const nextQuestion = (nextQuestionIndex) => {
    if (nextQuestionIndex === questions.length) {
      navigate("/", location)
    } else {
      const currentQuestion = questions[nextQuestionIndex];
      const answers = [currentQuestion.correct_answer].concat(currentQuestion.incorrect_answers);
      setCurrentQuestion(currentQuestion);
      setAnswers(answers);
      setQuestionIndex(nextQuestionIndex);
    }
  }

  return (
    <div className="game">
      <div className="question">
        <p>Good luck {location.state.name}</p>
        <p>
          Question {questionIndex + 1}/{questions.length} <span className="fire"><GiFire Frame/></span>
        </p>
        <p>{ReactHtmlParser(currentQuestion.question)}</p>
        <ol>
          {answers.map(answer => (
            <li><button className="card-btn" onClick={() => nextQuestion(questionIndex + 1)}>{ReactHtmlParser(answer)}</button></li>
          ))}
        </ol>
        <button onClick={() => navigate("/", location)}>back</button>
      </div>
    </div>
  )
}

export default Question;
