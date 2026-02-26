import '/css/app.css';
import 'swiper/css';
import { storage } from './utils';
import { 
  Rounder,
  createNode,
  createContainer,
  createButton,
  createInput,
  isValidKey,
  formatTime,
  makeEven,
  limit
} from '@jamesrock/rockjs';
import { Sudoku } from './Sudoku';
import { Renderer } from './Renderer';

const app = document.querySelector('#app');
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
let gameOver = true;
let puzzle = null;
let renderer = null;
let mode = 'standard';
let difficulty = 'easy';

app.append(board);
app.append(solvedNode);
app.append(eventsNode);

if(!times) {
  times = {
    'standard': {
      'easy': 0,
      'medium': 0,
      'hard': 0
    },
    'jigsaw': {
      'easy': 0,
      'medium': 0,
      'hard': 0
    }
  };
};

const getPuzzle = (difficulty) => {
  return new Sudoku(mode, difficulty, solvedHandler);
};

const solvedHandler = () => {
  const time = (Date.now() - start);
  if(times[puzzle.type][puzzle.difficulty]===0||time<times[puzzle.type][puzzle.difficulty]) {
    times[puzzle.type][puzzle.difficulty] = time;
    storage.set('times', times);
  };
  solvedNode.innerHTML = `<div class="game-over-body">\
    <h2>Solved!</h2>\
    <p class="time">Time: ${formatTime(time)}</p>\
    <p class="best">Best: ${formatTime(times[puzzle.difficulty])}</p>\
    <p class="retry">Tap to try again.</p>\
  </div>`;
  solvedNode.setAttribute('data-state', 'pre-show');
  setTimeout(() => {
    solvedNode.setAttribute('data-state', 'show');
  }, 250);
  gameOver = true;
  puzzle = null;
};

const startNewGame = (force = false) => {
  
  if(!force&&!gameOver) {return};

  solvedNode.setAttribute('data-state', 'hidden');

  if(renderer) {
    renderer.destroy();
  };

  renderer = new Renderer(puzzleSize, puzzleSize, getPuzzle(difficulty));
  puzzle = renderer.puzzle;
  start = Date.now();
  
  gameOver = false;

  setup();

};

const setup = () => {

  renderer.appendTo(board).render();

};

const move = (d) => {
  if(!puzzle) {return};
  puzzle.move(d);
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
  move('down');
});

eventsNode.addEventListener('drag-up', () => {
  move('up');
});

eventsNode.addEventListener('drag-right', () => {
  move('right');
});

eventsNode.addEventListener('drag-left', () => {
  move('left');
});

document.addEventListener('keydown', (e) => {

  if(puzzle && isValidKey(e.code, directionKeys)) {
    move(directionKeysMap[e.code]);
  };

  if(puzzle && isValidKey(e.code, rotateKeys)) {
    puzzle.fill();
  };

});

startNewGame();

const createRadio = (value = 0, name = '{name}', id = '{id}', checked = false) => {
  const node = createInput(value, 'radio');
  node.name = name;
  node.id = id;
  node.checked = checked;
  return node;
};

const createLabel = (label = '{label}', id = '{id}') => {
  const node = createNode('label');
  node.innerHTML = label;
  node.setAttribute('for', id);
  return node;
};

const createToggle = (options, id, defaultValue) => {
  const node = createNode('div', 'toggle');
  options.forEach((option) => {
    const optionNode = createNode('div', 'toggle-item');
    const radio = createRadio(option, id, `${option}-${id}`, option===defaultValue);
    const label = createLabel(option, radio.id);
    optionNode.append(radio);
    optionNode.append(label);
    node.append(optionNode);
  });
  return node;
};

const footer = createNode('form', 'footer');
const toggleContainer = createContainer();
const difficultToggle = createToggle(['easy', 'medium', 'hard'], 'difficulty', 'easy');
const typeToggle = createToggle(['standard', 'jigsaw'], 'mode', 'standard');
const newGameButton = createButton('new');

toggleContainer.append(difficultToggle);
toggleContainer.append(typeToggle);
footer.append(toggleContainer);
footer.append(newGameButton);
app.append(footer);

footer.addEventListener('input', () => {

  const data = new FormData(footer);
	difficulty = data.get('difficulty');
	mode = data.get('mode');

  startNewGame(true);

});

newGameButton.addEventListener('click', () => {
  
  startNewGame(true);

});
