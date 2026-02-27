import '/css/app.css';
import {
  storage,
  getDefaultTime
} from './utils';
import {
  Rounder,
  setDocumentHeight,
  makeNode,
  makeButton,
  makeToggle,
  isValidKey,
  formatTime,
  makeEven,
  limit
} from '@jamesrock/rockjs';
import { Sudoku } from './Sudoku';
import { Renderer } from './Renderer';

setDocumentHeight();

const app = document.querySelector('#app');
const footer = makeNode('div', 'footer');
const toggleContainer = makeNode('form');
const newGameButton = makeButton('new');
const sqareSize = makeEven(limit(Math.round(window.innerWidth / 10), 50));
const puzzleSize = sqareSize*9;
const solvedNode = makeNode('div', 'solved');
const eventsNode = makeNode('div', 'events');
const rounder = new Rounder(40);
const rotateKeys = ['Space'];
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
let touch = null;
let xMovement = 0;
let yMovement = 0;
let movement = 0;
let puzzle = null;
let renderer = null;
let mode = 'standard';
let difficulty = 'easy';

if(savedGame) {
  mode = savedGame[2];
  difficulty = savedGame[3];
};

const modeToggle = makeToggle(['standard', 'jigsaw'].map((value) => [value, value]), 'mode', mode);
const difficultToggle = makeToggle(['easy', 'medium', 'hard'].map((value) => [value, value]), 'difficulty', difficulty);

app.append(board);
app.append(solvedNode);
app.append(eventsNode);

toggleContainer.append(difficultToggle);
toggleContainer.append(modeToggle);
footer.append(toggleContainer);
footer.append(newGameButton);
app.append(footer);

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

const getPuzzle = () => new Sudoku(mode, difficulty, solvedHandler, updateHandler, savedGame);

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
  puzzle = null;
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

  if(renderer) {
    renderer.destroy();
  };

  app.setAttribute('data-game-over', false);

  renderer = new Renderer(puzzleSize, puzzleSize, getPuzzle());
  puzzle = renderer.puzzle;
  start = Date.now();

  renderer.appendTo(board).render();

};

eventsNode.addEventListener('touchstart', (e) => {

  touch = e.touches[0];
  movement = 0;
  xMovement = 0;
  yMovement = 0;

  e.preventDefault();

}, {passive: false});

eventsNode.addEventListener('touchmove', (e) => {

  const {clientX: originalClientX, clientY: originalClientY} = touch;
  const {clientX, clientY} = e.touches[0];
  const x = rounder.round(clientX - originalClientX);
  const y = rounder.round(clientY - originalClientY);

  if(x !== xMovement) {
    eventsNode.dispatchEvent(new Event(x > xMovement ? 'drag-right' : 'drag-left'));
  };

  if(y !== yMovement) {
    eventsNode.dispatchEvent(new Event(y > yMovement ? 'drag-down' : 'drag-up'));
  };

  xMovement = x;
  yMovement = y;
  movement += (xMovement + yMovement);

});

eventsNode.addEventListener('touchend', () => {

  if(movement === 0) {
    puzzle ? puzzle.fill() : startNewGame();
  };

});

eventsNode.addEventListener('drag-down', () => {
  puzzle.move('down');
});

eventsNode.addEventListener('drag-up', () => {
  puzzle.move('up');
});

eventsNode.addEventListener('drag-right', () => {
  puzzle.move('right');
});

eventsNode.addEventListener('drag-left', () => {
  puzzle.move('left');
});

document.addEventListener('keydown', (e) => {

  if(isValidKey(e.code, directionKeys)) {
    puzzle.move(directionKeysMap[e.code]);
  };

  if(isValidKey(e.code, rotateKeys)) {
    puzzle ? puzzle.fill() : startNewGame();
  };

});

toggleContainer.addEventListener('input', () => {

  const data = new FormData(toggleContainer);
	difficulty = data.get('difficulty');
	mode = data.get('mode');

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
