import { createNode, isValidKey, timeToDisplay, makeEven } from './utils';
import { Sudoku } from './Sudoku';
import { Storage } from './Storage';
import { Rounder } from './Rounder';
import { Renderer } from './Renderer';

const limit = (value, max) => value > max ? max : value;
const sqareSize = makeEven(limit(Math.round(window.innerWidth / 10), 50));
const puzzleSize = sqareSize*9;
const solvedNode = createNode('div', 'solved');
const storage = new Storage('me.jamesrock.rodoku');
const rounder = new Rounder(40);
const rotateKeys = ['Space'];
const directionKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
const directionKeysMap = {
  'ArrowUp': 'up',
  'ArrowDown': 'down',
  'ArrowLeft': 'left',
  'ArrowRight': 'right'
};
const type = 'jigsaw';
const savedGame = storage.get('saved');
let best = storage.get('best') || 0;
let puzzle = null;
let start = 0;
let touch = null;
let xMovement = 0;
let yMovement = 0;
let gameOver = false;
let renderer = null;

const solvedHandler = () => {
  gameOver = true;
  const now = Date.now();
  const time = (now - start);
  if(best===0||time<best) {
    best = time;
    storage.set('best', best);
  };
  solvedNode.innerHTML = `<div class="game-over-body">\
    <h2>Solved!</h2>\
    <p class="time">Time: ${timeToDisplay(time)}</p>\
    <p class="best">Best: ${timeToDisplay(best)}</p>\
    <p class="retry">Tap to try again.</p>\
  </div>`;
  solvedNode.setAttribute('data-state', 'pre-show');
  setTimeout(() => {
    solvedNode.setAttribute('data-state', 'show');
  }, 250);
};

const saveGame = () => {

  storage.set('saved', puzzle.getValues());
  return this;

};

const startNewGame = () => {

  removeOld();

  puzzle = new Sudoku(type, solvedHandler);
  renderer = new Renderer(puzzleSize, puzzleSize, puzzle);
  gameOver = false;
  start = Date.now();
  solvedNode.setAttribute('data-state', 'hidden');

  setup();

};

const openSavedGame = () => {

  const savedObject = storage.get('saved');
  puzzle = new Sudoku(type, solvedHandler, savedObject);
  renderer = new Renderer(puzzleSize, puzzleSize, puzzle);

  setup();

};

const setup = () => {

  renderer.appendTo(document.body);
  renderer.render();
  setTimeout(() => {
    renderer.node.setAttribute('data-state', 'show');
  }, 500);

};

const removeOld = () => {
  
  if(renderer) {
    renderer.node.parentNode.removeChild(renderer.node);
  };

};

document.body.append(solvedNode);

startNewGame();

solvedNode.addEventListener('click', () => {
  startNewGame();
});

document.addEventListener('touchstart', function(e) {

  if(gameOver) {return};
    
  touch = e.touches[0];
  xMovement = 0;
  yMovement = 0;

  e.preventDefault();

}, {passive: false});

document.addEventListener('touchmove', function(e) {

  if(gameOver) {return};
  
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

document.addEventListener('touchend', function() {

  if(gameOver) {return};

  const noMovement = (xMovement===0 && yMovement===0);

  if(noMovement) {
    fill();
  };

});

document.addEventListener('drag-down', () => {
  puzzle.move('down');
});

document.addEventListener('drag-up', () => {
  puzzle.move('up');
});

document.addEventListener('drag-right', () => {
  puzzle.move('right');
});

document.addEventListener('drag-left', () => {
  puzzle.move('left');
});

document.addEventListener('keydown', (e) => {

  if(isValidKey(e.code, directionKeys)) {
    puzzle.move(directionKeysMap[e.code]);
  };

  if(isValidKey(e.code, rotateKeys)) {
    puzzle.fill();
  };

});