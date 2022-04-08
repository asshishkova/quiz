import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter, Route, Routes } from "react-router-dom";
import * as serviceWorker from './serviceWorker';
import Start from './start/Start.js';
import Game from './game/Game';
import Score from './score/Score';

ReactDOM.render(
  <React.StrictMode>
    <MemoryRouter>
      <Routes>
        <Route exact path="/" element={<Start />} />
        <Route path="/game" element={<Game />} />
        <Route path="/score" element={<Score />} />
      </Routes>
    </MemoryRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

serviceWorker.unregister();
