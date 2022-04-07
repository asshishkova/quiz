import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ReactHtmlParser from "react-html-parser";
import ReactCanvasConfetti from "react-canvas-confetti";
import { FaUndo } from "react-icons/fa";
import axios from "axios";
import _ from "underscore";
import keyword_extractor from "keyword-extractor";
import { useKeyPressHandler } from "../common/keypress";
import { useOneShotConfettiAnimation, canvasStyles } from "../common/confetti"
import "./Game.css";

const difficulties = {"easy": 1, "medium": 2, "hard": 3};
const defaultTimerClassName = "blinking-text-animation" ;
const defaultAnswerClassName = "answer-card-btn regular-card";
const amount = 10;
const secondsForAnswer = 30;

async function getQuestions(amount, difficulty) {
  return axios.get(
    "https://opentdb.com/api.php?"
    + "amount=" + amount
    + "&difficulty=" + difficulty,
    { headers: { Accept: "application/json" } })
  .then((response) => {
    return response.data.results;
  }).catch((err) => {
    return [];
  })
}

function buildAnswers(currentQuestion) {
  const correctAnswer = {
    text: currentQuestion.correct_answer,
    correct: true,
    class: defaultAnswerClassName,
    disabled: false
  };
  let answers = [];
  if (currentQuestion.type === "boolean") {
    answers = [{text: "Right", correct: correctAnswer.text === "True", class: defaultAnswerClassName},
               {text: "Wrong", correct: correctAnswer.text === "False", class: defaultAnswerClassName}];
    } else {
      currentQuestion.incorrect_answers.forEach(incorrectAnswer => {
        answers.push({
          text: incorrectAnswer,
          correct: false,
          class: defaultAnswerClassName
        });
      });
      const correctAnswerIndex = Math.floor(Math.random() * answers.length)
      answers.splice(correctAnswerIndex, 0, correctAnswer);
    }

  answers.forEach((answer, i) => {
    answer.index = i;
  });
  return answers;
}

function Question() {
  // useIsMounted()
  const isMounted = useRef(false)
  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false }
  }, []);

  const navigate = useNavigate();
  const location = useLocation();
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
  const [imageSource, setImageSource] = useState("");
  const [timeUnfocused, setTimeUnfocused] = useState(null);
  const oneShotConfettiAnimation = useOneShotConfettiAnimation()

  // initGameState()
  useEffect(() => {
    getQuestions(amount, location.state.difficulty)
    .then(questions => {
      if (questions.length === 0 || amount !== questions.length) {
        console.log("There are not enough questions in response");
        navigate("/", location);
        return;
      }
      const questionIndex = 0;
      const currentQuestion = questions[questionIndex];
      const answers = buildAnswers(currentQuestion);
      setCurrentQuestion(currentQuestion);
      nextImage(currentQuestion, function (imageData) {
        setImageSource(imageData);
        setAnswers(answers);
        setQuestions(questions);
      });
    })
  }, [location, navigate]);
  let displayedPlayerName = "Guest";
  const inputPlayerName = location.state.inputPlayerName.trim();
  if (inputPlayerName.length > 0) {
    displayedPlayerName = inputPlayerName;
  }

  const answerClicked = (answer) => {
    setDisabledButton(true);
    let updatedAnswers = answers.slice();
    setTimerClassName("");
    let newScore = score;
    if (answer.correct) {
      oneShotConfettiAnimation.start();
      let addPoints = timer * difficulties[currentQuestion.difficulty];
      if (hintUsed) {
        addPoints = Math.ceil(addPoints / 2);
      }
      newScore = newScore + addPoints;
      setScore(newScore);
      updatedAnswers[answer.index].class = "answer-card-btn correct-card";
    } else if (answer.index >= 0) {
      updatedAnswers[answer.index].class = "answer-card-btn incorrect-card";
    }
    setAnswers(updatedAnswers);
    const nextQuestionIndex = questionIndex + 1;

    const callNextQuestionWithDelay = (imageData) => {
      setTimeout(() => {
        if (isMounted.current) {
          if (answer.correct) {
            oneShotConfettiAnimation.stop()
          }
          nextQuestion(newScore, imageData);
        }
      }, 2000);
    };

    if (nextQuestionIndex < amount) {
      nextImage(currentQuestion, callNextQuestionWithDelay)
    } else {
      callNextQuestionWithDelay(null);
    }
  }

  const defaultImg = "defaultImg.jpeg";

  const nextImage = async (question, callback) => {
    if (question.question) {
      const keywords =
      keyword_extractor.extract(ReactHtmlParser(question.question)[0],{
          language:"english",
          remove_digits: true,
          return_changed_case: true,
          remove_duplicates: true
      });
      const startKeyword = Math.ceil(keywords.length / 2);
      const unsplashUrl = "https://api.unsplash.com/search/photos?query="
                      + encodeURI(keywords.slice(startKeyword - 1, startKeyword + 2).join(" "))
                      + "&client_id=" + process.env.REACT_APP_UNSPLASH_API_KEY
                      + "&per_page=1&orientation=landscape";

      return axios.get(
        unsplashUrl,
        { headers: { Accept: "application/json" } }
      )
      .then((response) => {
        if (response.data.results.length > 0) {
          axios.get(response.data.results[0].urls.small, {
            responseType: 'arraybuffer'
          })
          .then(response => Buffer.from(response.data, 'binary').toString('base64'))
          .then(imageData => {
            callback("data:image/png;base64, " + imageData)
          })
        } else {
          callback(defaultImg);
        }
      }).catch((err) => {
        console.log("Unsplash API has reached its rate limit. Replacing with the default image.")
        callback(defaultImg);
      })
    }
  }

  const nextQuestion = (score, imageData) => {
    setDisabledButton(false);
    setHintUsed(false);
    setTimer(secondsForAnswer);
    setTimerClassName(defaultTimerClassName);
    const nextQuestionIndex = questionIndex + 1;
    if (nextQuestionIndex === amount) {
      navigate("/score",
      {state: {
        ...location.state,
        score: score,
        displayedPlayerName: displayedPlayerName,
        amount: amount,
        secondsForAnswer: secondsForAnswer
      }});
    } else {
      const currentQuestion = questions[nextQuestionIndex];
      const answers = buildAnswers(currentQuestion);
      setCurrentQuestion(currentQuestion);
      setImageSource(imageData);
      setAnswers(answers);
      setQuestionIndex(nextQuestionIndex);
    }
  }

  const hint5050 = () => {
    setHintUsed(true);
    let updatedAnswers = answers.slice();
    const indexes = [...Array(answers.length).keys()];
    const halfIndexes = _.sample(indexes, answers.length  / 2);
    const restIndexes = indexes.filter(i => !halfIndexes.includes(i));
    let isCorrectHalfIndexes = []
    halfIndexes.forEach(index => {
      isCorrectHalfIndexes.push(updatedAnswers[index].correct);
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
      answers[index].class = "answer-card-btn disabled-card";
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
    if (timer <= 1) {
      answerClicked({text: "", correct: false, index: -1});
    }
  };

  const handleVisibilityChange = () => {
    if (isMounted.current) {
      if (document.visibilityState === "hidden") {
        setTimeUnfocused(new Date())
      } else if (timeUnfocused) {
        let newTimerValue = Math.max (
          timer - Math.round(((new Date()).getTime() - timeUnfocused.getTime()) / 1000)
          , 0)
        setTimer(newTimerValue);
      }
    }
  }

  useEffect(() => {
    document.addEventListener("visibilitychange", handleVisibilityChange, false);
  });

  const handler = ({ key }) => {
    if (!disabledButton) {
      const parsedKey = parseInt(key) - 1;
      const keys = [...Array(answers.length).keys()];
      if (keys.includes(parsedKey) && !answers[parsedKey].disabled) {
        answerClicked(answers[parsedKey]);
      }
    }
  };

  useKeyPressHandler(handler);

  return (
    <div className="app">
      {(() => {
        if (startGameCounter === 0) {
          return (
            <div className="game">
              <div className="game-info">
                <div className="left">
                  <p>Player: {displayedPlayerName}</p>
                  <p> Question {questionIndex + 1}/{amount}</p>
                </div>
                <div className="center">
                  <p>Score: {score}</p>
                  <p onAnimationIteration={onTimerAnimationIteration} className={timerClassName}>{timer}</p>
                  <ReactCanvasConfetti refConfetti={oneShotConfettiAnimation.instance} style={canvasStyles} />
                </div>
                <div className="right">
                  <p>
                    <FaUndo className="start-over-sign" title="Start over" onClick={() => navigate("/", location)}/>
                  </p>
                  <p>
                    {timer === 0 &&
                      <p className="blinking-text-animation" >Time's up</p>
                    }
                    {answers.length > 2 && !disabledButton && !hintUsed && timer <= secondsForAnswer / 2 && timer > 0 &&
                      <p className="blinking-text-animation hint" onClick={() => hint5050()}>50:50 hint</p>
                    }
                  </p>
                </div>
              </div>

              <h1>{ReactHtmlParser(currentQuestion.question)}</h1>

              <ol className="answers-cards">
                {answers.map((answer, i) => (
                  <li key={i} className="answer-card">
                    <button disabled={disabledButton || answer.disabled}
                      className={answer.class} onClick={() => answerClicked(answer)}>
                        <span className="small-numbers">{ i + 1 }.</span> {ReactHtmlParser(answer.text)}
                    </button>
                  </li>
                ))}
              </ol>

              <img key={questionIndex} src={imageSource} alt=""/>
            </div>
          )
        } else {
          return (
            <p onAnimationIteration={onAnimationIteration}
              className="growing-digits-animation">{startGameCounter}
            </p>
          )
        }
      })()}
    </div>
  )
}

export default Question;
