import React from "react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from 'axios';
import ReactHtmlParser from 'react-html-parser';

function Question() {
  const [questions, setQuestions] = useState({results: []});
  const [questionIndex, setQuestionIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState({question: ""});
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    axios.get("https://opentdb.com/api.php?amount=10").then((response) => {
      const questions = response.data.results;
      const questionIndex = 0;
      const currentQuestion = questions[questionIndex];
      const answers = [currentQuestion.correct_answer].concat(currentQuestion.incorrect_answers);
      setCurrentQuestion(currentQuestion);
      setAnswers(answers);
      setQuestions(questions);
    });
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
      <p>Good luck {location.state.name}</p>
      <h3>{ReactHtmlParser(currentQuestion.question)}</h3>
      <ol>
        {answers.map(answer => (
          <li><button onClick={() => nextQuestion(questionIndex + 1)}>{ReactHtmlParser(answer)}</button></li>
        ))}
      </ol>
      <button onClick={() => navigate("/", location)}>back</button>
    </div>
  )
}

export default Question;
