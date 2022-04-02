import React from "react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from 'axios';
import ReactHtmlParser from 'react-html-parser';

function Question() {
  const [questions, loadQuestions] = useState({results: []});

  useEffect(() => {
    axios.get("https://opentdb.com/api.php?amount=10").then((response) => {
      loadQuestions(response.data);
    });
  }, []);

  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="game">
      <p>Good luck {location.state.name}</p>
      <ol>
        {questions.results.map(question => (
          <li>{ReactHtmlParser(question.question)}</li>
        ))}
      </ol>
      <button className="btn-gradient" onClick={() => navigate("/", location)}>back</button>
    </div>
  )
}

export default Question;
