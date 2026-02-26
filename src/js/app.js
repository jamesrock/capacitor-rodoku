import '/css/app.css';
import 'swiper/css';
import { 
  storage, 
  createToggle,
  getDefaultTime
} from './utils';
import { 
  Rounder,
  createNode,
  createButton,
  isValidKey,
  formatTime,
  makeEven,
  limit
} from '@jamesrock/rockjs';
import { Sudoku } from './Sudoku';
import { Renderer } from './Renderer';

const app = document.querySelector('#app');
const footer = createNode('div', 'footer');
const toggleContainer = createNode('form');
const difficultToggle = createToggle(['easy', 'medium', 'hard'], 'difficulty', 'easy');
const typeToggle = createToggle(['standard', 'jigsaw'], 'mode', 'standard');
const newGameButton = createButton('new');
const sqareSize = makeEven(limit(Math.round(window.innerWidth / 10), 50));
const puzzleSize = sqareSize*9;
const solvedNode = createNode('div', 'solved');
const eventsNode = createNode('div', 'events');
const rounder = new Rounder(40);
const rotateKeys = ['Space'];
const directionKeysMap = {
  'ArrowUp': 'up',
  'ArrowDown': 'down',
  'ArrowLeft': 'left',
  'ArrowRight': 'right'
};
const directionKeys = Object.keys(directionKeysMap);
const savedGame = storage.get('saved');
const board = createNode('div', 'board');
let times = storage.get('times');
let start = 0;
let touch = null;
let xMovement = 0;
let yMovement = 0;
let puzzle = null;
let renderer = null;
let mode = 'standard';
let difficulty = 'easy';

app.append(board);
app.append(solvedNode);
app.append(eventsNode);

toggleContainer.append(difficultToggle);
toggleContainer.append(typeToggle);
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

const getPuzzle = (difficulty) => {
  return new Sudoku(mode, difficulty, solvedHandler);
};

const solvedHandler = () => {
  const time = (Date.now() - start);
  if(time < times[puzzle.type][puzzle.difficulty]) {
    times[puzzle.type][puzzle.difficulty] = time;
    storage.set('times', times);
  };
  solvedNode.innerHTML = `<div class="game-over-body">\
    <h2>Solved!</h2>\
    <p class="time">Time: ${formatTime(time)}</p>\
    <p class="best">Best: ${formatTime(times[puzzle.type][puzzle.difficulty])}</p>\
    <p class="retry">Tap to try again.</p>\
  </div>`;
  solvedNode.setAttribute('data-state', 'pre-show');
  setTimeout(() => {
    solvedNode.setAttribute('data-state', 'show');
  }, 250);
  puzzle = null;
};

const startNewGame = () => {

  solvedNode.setAttribute('data-state', 'hidden');

  if(renderer) {
    renderer.destroy();
  };

  renderer = new Renderer(puzzleSize, puzzleSize, getPuzzle(difficulty));
  puzzle = renderer.puzzle;
  start = Date.now();

  renderer.appendTo(board).render();

};

eventsNode.addEventListener('touchstart', (e) => {

  touch = e.touches[0];
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
    this.dispatchEvent(new Event(x > xMovement ? 'drag-right' : 'drag-left'));
  };

  if(y !== yMovement) {
    this.dispatchEvent(new Event(y > yMovement ? 'drag-down' : 'drag-up'));
  };

  xMovement = x;
  yMovement = y;

});

eventsNode.addEventListener('touchend', () => {

  if(puzzle && xMovement===0 && yMovement===0) {
    puzzle.fill();
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

  if(puzzle && isValidKey(e.code, directionKeys)) {
    puzzle.move(directionKeysMap[e.code]);
  };

  if(puzzle && isValidKey(e.code, rotateKeys)) {
    puzzle.fill();
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

startNewGame();
