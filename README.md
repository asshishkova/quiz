# Quiz game

Live URL: quizgame-asshishkova.netlify.app

This web application manages the quiz game using the [Open Trivia Database API](https://opentdb.com/). In every game there are 10 different questions with 2 or 4 possible answers. For each question there is only one correct answer. The time to answer is limited to 30 seconds. The player’s goal is to answer all the questions as quickly and accurately as possible.

## Technical details

The project uses react hooks and functional components. Each page in the game is a component, and routing between pages is done by a MemoryRouter.

### Project structure

```
src/
  index.js - memory router
  start/ - start page logic and style
  game/ - game page logic and style
  score/ - score page logic and style
  common/ - common functions, variables and styles
    confetti/ - confetti animations
public/ - public assets
```

### Local Development

```bash
## prep steps for first time users
npm i -g netlify-cli # Make sure you have the [Netlify CLI](https://github.com/netlify/cli) installed
git clone https://github.com/asshishkova/quiz ## clone this repo
cd quiz ## change into this repo
yarn # install all dependencies

## done every time you start up this project
ntl dev ## nice shortcut for `netlify dev`, starts up quiz AND a local Node.js server for your Netlify functions
```

This fires up [Netlify Dev](https://www.netlify.com/docs/cli/?utm_source=github&utm_medium=swyx-CRAL&utm_campaign=devex#netlify-dev-beta), which detects that you are running a `quiz` project and runs the npm script that contains `react-scripts start`, which in this project is the `start` script

You can view the project locally via Netlify Dev, via `localhost:8888`.

To use the [Unsplash API](unsplash.com/developers) for picture search you need to create a new application and get an API key on their website. Save it in the .env file as `REACT_APP_UNSPLASH_API_KEY={your_api_key}` for development. Otherwize only a default picture will be shown.

### Deployment

During deployment, this project is configured, inside `netlify.toml` to run the build `command`: `yarn build`.

`yarn build` corresponds to the npm script `build`, which uses `npm-run-all` (aka `run-p`) to concurrently run `"build:app"` (aka `react-scripts build`).

To use the [Unsplash API](unsplash.com/developers) you need to add an enviroment variable called `REACT_APP_UNSPLASH_API_KEY` with its value to Netlify (`/settings/deploys#environment`).

## Game details

The application has a responsive theme and can be played both on a computer and on mobile devices.

### Start

The game begins with a start page, where the player is welcomed to the quiz and is able to enter their name, choose the difficulty level and read the rules. By default, the displayed name is *Guest* and the level is *medium*. The levels correspond to *easy*, *medium* and *hard* difficulties of the questions from the Trivia API.

The player can either click on the *Start* button or press *Enter*.
After that a *3-2-1 countdown* animation is shown and the game starts.

### Game

On the **top of the screen** these are displayed:
- The player's name
- The current question number and the total amount of questions
- The player's score
- The time left (in seconds) to answer the question
- A start-over sign
- A button to use the 50:50 hint (for 4-answer questions only, if 5 seconds already passed, the hint was not used and the time is not up yet)
- A corresponding notification when the time is up

On the **bottom of the screen** a picture found by the question's keywords using [Unsplash API](unsplash.com/developers) is displayed. This API has a rate limit of 50 requests per hour. If the rate limit is reached or just no picture is found, a default picture is shown.

On the **main part of the screen** these are displayed:
- The question
- 2 or 4 answer cards

To select the answer, the player can either click on the answer or press its number on the keyboard.

After selecting the answer, all the answer cards become disabled and the selected answer card changes the color according to its correctness. If the answer is correct, a confetti animation appears as well.

#### Score calculation

Every right answer increases the score by the amount of seconds left, which is multiplied by a difficulty factor: 1 for *easy*, 2 for *medium*, 3 for *hard*. For example, if the level is *medium* and the player answered right when the time left is 20 seconds, they will get <img src="https://render.githubusercontent.com/render/math?math=20 \times 2 = 40"> points. So, the maximum score a player can get is:
- <img src="https://render.githubusercontent.com/render/math?math=30 \times 10 = 300"> for *easy* level
- <img src="https://render.githubusercontent.com/render/math?math=30 \times 2 \times 10 = 600"> for *medium*
- <img src="https://render.githubusercontent.com/render/math?math=30 \times 3 \times 10 = 900"> for *hard*

#### 50:50 hint

After the first 5 seconds passed, the player can get a 50:50 hint. If the player presses the *50:50 hint* button, two randomly chosen wrong answer cards change their color and become disabled. After that, the player can get only half of the points for the correct answer. For example, if the level is *hard* and the player answeres right after using the 50:50 hint when the time left is 10 seconds, they will get <img src="https://render.githubusercontent.com/render/math?math=\frac{10 \times 3}{2} = 15"> points.

#### Countdown timer features

If during countdown the player switches the tab or window and then comes back, the timer counts also the time the player was not active. For example, if the time left was 25 seconds when the player switched, and then they switch back in 10 seconds, the timer will show 15 seconds left and continue counting down. If the player comes back only in 60 seconds, the time left will be 0 seconds and the "time is up" notification will be shown.

In any case, when the time is up, the correcponding notification is shown and the answer cards become disabled.

The next question appears in 2 seconds after the answer (or after the time is up).

### Final score

After answering the last question, the player’s score page is presented with a celebration depending on the score:

- Below <img src="https://render.githubusercontent.com/render/math?math=\frac{1}{4}"> from maximum for this level: a small confetti animation, a "do not worry" message and a suggestion to try an easier level (if it exists).

- From <img src="https://render.githubusercontent.com/render/math?math=\frac{1}{4}"> and below <img src="https://render.githubusercontent.com/render/math?math=\frac{3}{4}">: a fireworks confetti animation and a "well done" message.

- From <img src="https://render.githubusercontent.com/render/math?math=\frac{3}{4}"> and above: a fireworks confetti animation, a "wow" message and a suggestion to try a harder level (if it exists).

In the score page there is a button to play again. The player can either click on it or just press *Enter*. Then the start page appears again with the chosen name and level saved.
