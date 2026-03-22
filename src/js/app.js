import '/css/app.css';
import {
  storage,
  getDefaultTime
} from './utils';
import {
  Toggle,
  setDocumentHeight,
  addDragListeners,
  makeNode,
  makeButton,
  isValidKey,
  formatTime,
  makeEven,
  limit,
  append,
  appendTo
} from '@jamesrock/rockjs';
import { Sudoku } from './Sudoku';

setDocumentHeight();

const app = document.querySelector('#app');
const footer = makeNode('div', 'footer');
const toggleContainer = makeNode('div');
const newGameButton = makeButton('new');
const sqareSize = makeEven(limit(Math.round(window.innerWidth / 10), 50));
const solvedNode = makeNode('div', 'solved');
const eventsNode = makeNode('div', 'events');
const fillKeys = ['Space'];
const directionKeysMap = {
  'ArrowUp': 'up',
  'ArrowDown': 'down',
  'ArrowLeft': 'left',
  'ArrowRight': 'right'
};
const directionKeys = Object.keys(directionKeysMap);
const board = makeNode('div', 'board');
let savedGame = storage.get('saved');
let times = storage.get('times');
let start = 0;
let puzzle = null;
let mode = 'standard';
let difficulty = 'easy';
let moved = false;
let gameOver = false;

if(savedGame) {
  mode = savedGame[2];
  difficulty = savedGame[3];
};

const modeToggle = new Toggle(['standard', 'jigsaw'].map((value) => [value, value]), 'mode', mode);
const difficultToggle = new Toggle(['easy', 'medium', 'hard'].map((value) => [value, value]), 'difficulty', difficulty);

append(app)(board)(solvedNode)(eventsNode);
appendTo(toggleContainer)(difficultToggle)(modeToggle);
append(footer)(toggleContainer)(newGameButton);
append(app)(footer);

if(!times) {
  times = {
    'standard': {
      'easy': getDefaultTime(),
      'medium': getDefaultTime(),
      'hard': getDefaultTime()
    },
    'jigsaw': {
      'easy': getDefaultTime(),
      'medium': getDefaultTime(),
      'hard': getDefaultTime()
    }
  };
};

const getPuzzle = () => new Sudoku(sqareSize, modeToggle.getValue(), difficultToggle.getValue(), solvedHandler, updateHandler, savedGame);

const solvedHandler = () => {
  const time = (Date.now() - start);
  if(time < times[puzzle.type][puzzle.difficulty]) {
    times[puzzle.type][puzzle.difficulty] = time;
    storage.set('times', times);
  };
  solvedNode.innerHTML = `<div class="game-over-body">\
    <h2>Solved!</h2>\
    <p class="time">${formatTime(time)}</p>\
    <p class="best">Best: ${formatTime(times[puzzle.type][puzzle.difficulty])}</p>\
    <p class="continue">Tap to continue</p>\
  </div>`;
  solvedNode.setAttribute('data-state', 'pre-show');
  setTimeout(() => {
    solvedNode.setAttribute('data-state', 'show');
    app.setAttribute('data-game-over', true);
  }, 250);
  gameOver = true;
};

const updateHandler = () => {

  storage.set('saved', puzzle.getSaveObject());

};

const startNewGame = () => {

  savedGame = null;
  storage.set('saved', savedGame);
  init();

};

const openSaved = () => {

  init();

};

const init = () => {

  solvedNode.setAttribute('data-state', 'hidden');

  if(puzzle) {
    puzzle.destroy();
  };

  app.setAttribute('data-game-over', false);

  puzzle = getPuzzle();
  start = Date.now();
  gameOver = false;

  puzzle.appendTo(board).render();

};

addDragListeners(eventsNode, 40);

eventsNode.addEventListener('touchend', () => {

  if(!moved) {
    gameOver ? startNewGame() : puzzle.fill();
  };

  moved = false;

});

eventsNode.addEventListener('drag-down', () => {
  moved = true;
  puzzle.move('down');
});

eventsNode.addEventListener('drag-up', () => {
  moved = true;
  puzzle.move('up');
});

eventsNode.addEventListener('drag-right', () => {
  moved = true;
  puzzle.move('right');
});

eventsNode.addEventListener('drag-left', () => {
  moved = true;
  puzzle.move('left');
});

document.addEventListener('keydown', (e) => {

  if(isValidKey(e.code, directionKeys)) {
    puzzle.move(directionKeysMap[e.code]);
  };

  if(isValidKey(e.code, fillKeys)) {
    gameOver ? startNewGame() : puzzle.fill();
  };

});

toggleContainer.addEventListener('input', () => {
  startNewGame();
});

newGameButton.addEventListener('click', () => {
  startNewGame();
});

if(savedGame) {
  openSaved();
}
else {
  startNewGame();
};
