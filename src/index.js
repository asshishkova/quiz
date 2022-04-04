import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Question from './Question';
import Score from './Score';
import * as serviceWorker from './serviceWorker';
import { MemoryRouter, Route, Routes } from "react-router-dom";

ReactDOM.render(
  <React.StrictMode>
    <MemoryRouter>
      <Routes>
        <Route exact path="/" element={<App />} />
        <Route path="/question" element={<Question />} />
        <Route path="/score" element={<Score />} />
      </Routes>
    </MemoryRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
