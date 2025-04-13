import { createNode, isValidKey, timeToDisplay, makeEven } from './utils';
import { Sudoku } from './Sudoku';
import { Storage } from './Storage';
import { Rounder } from './Rounder';
import { Renderer } from './Renderer';
import Swiper from 'swiper';
import { Parallax } from 'swiper/modules';
import 'swiper/scss';
import 'swiper/css/parallax';

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
const savedGame = storage.get('saved');
let best = storage.get('best') || 0;
let standardPuzzle = null;
let jigsawPuzzle = null;
let puzzle = null;
let start = 0;
let touch = null;
let xMovement = 0;
let yMovement = 0;
let gameOver = false;
let standardRenderer = null;
let jigsawRenderer = null;
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

const startNewGame = () => {

  removeOld();

  standardPuzzle = new Sudoku('standard', solvedHandler);
  standardRenderer = new Renderer(puzzleSize, puzzleSize, standardPuzzle);

  jigsawPuzzle = new Sudoku('jigsaw', solvedHandler);
  jigsawRenderer = new Renderer(puzzleSize, puzzleSize, jigsawPuzzle);

  puzzle = null;
  gameOver = false;
  
  solvedNode.setAttribute('data-state', 'hidden');

  swiper.enable();

  setup();

};

const setup = () => {

  standardRenderer.appendTo(standardSudoku);
  jigsawRenderer.appendTo(jigsawSudoku);

  standardRenderer.render();
  jigsawRenderer.render();

};

const removeOld = () => {
  
  if(standardRenderer) {
    standardRenderer.destroy();
  };

  if(jigsawRenderer) {
    jigsawRenderer.destroy();
  };

};

const setPuzzle = (type) => {
  
  console.log(`setPuzzle(${type})`);
  
  switch(type) {
    case 'jigsaw':
      puzzle = jigsawPuzzle;
      renderer = jigsawRenderer;
      standardRenderer.stop();
    break;
    case 'standard':
      puzzle = standardPuzzle;
      renderer = standardRenderer;
      jigsawRenderer.stop();
    break;
  };

  renderer.render();

  start = Date.now();
  swiper.disable();

};

const swiper = new Swiper('.swiper', {
  initialSlide: 1,
  modules: [Parallax],
  parallax: true
});

swiper.on('beforeTransitionStart', function(e) {
  // console.log('slide changed', e.activeIndex);
  if(e.activeIndex===0) {
    setPuzzle('jigsaw');
  };
  if(e.activeIndex===2) {
    setPuzzle('standard');
  };
});

const standardSudoku = document.querySelector('#screen-standard');
const welcome = document.querySelector('#screen-welcome');
const jigsawSudoku = document.querySelector('#screen-jigsaw');

welcome.innerHTML = `\
<div class="welcome-body">\
  <p class="swipe-left"><span>swipe left for</span> <strong>standard sudoku</strong></p>\
  <p class="swipe-right"><span>swipe right for</span> <strong>jigsaw sudoku</strong></p>\
</div>`;

document.body.append(solvedNode);

startNewGame();

solvedNode.addEventListener('click', () => {
  startNewGame();
  swiper.slideTo(1);
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
    puzzle.fill();
  };

});

document.addEventListener('drag-down', () => {
  if(!puzzle) {return};
  puzzle.move('down');
});

document.addEventListener('drag-up', () => {
  if(!puzzle) {return};
  puzzle.move('up');
});

document.addEventListener('drag-right', () => {
  if(!puzzle) {return};
  puzzle.move('right');
});

document.addEventListener('drag-left', () => {
  if(!puzzle) {return};
  puzzle.move('left');
});

document.addEventListener('keydown', (e) => {
  
  if(!puzzle) {return};

  if(isValidKey(e.code, directionKeys)) {
    puzzle.move(directionKeysMap[e.code]);
  };

  if(isValidKey(e.code, rotateKeys)) {
    puzzle.fill();
  };

});
