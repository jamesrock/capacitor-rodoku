import { createNode, isValidKey, timeToDisplay, makeEven } from './utils';
import { Sudoku } from './Sudoku';
import { Storage } from './Storage';
import { Rounder } from './Rounder';
import { Renderer } from './Renderer';
import Swiper from 'swiper';
import { Parallax } from 'swiper/modules';
import 'swiper/scss';

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
let start = 0;
let touch = null;
let xMovement = 0;
let yMovement = 0;
let gameOver = false;
let puzzle = null;
let renderer = null;
let renderers = null;

const solvedHandler = () => {
  gameOver = true;
  puzzle = null;
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

  console.log('startNewGame');

  solvedNode.setAttribute('data-state', 'hidden');

  removeOld();

  renderers = [
    new Renderer(puzzleSize, puzzleSize, new Sudoku('standard', solvedHandler), '#screen-standard'),
    new Renderer(puzzleSize, puzzleSize, new Sudoku('jigsaw', solvedHandler), '#screen-jigsaw'),
    new Renderer(puzzleSize, puzzleSize, new Sudoku('daily', solvedHandler), '#screen-daily'),
    new Renderer(puzzleSize, puzzleSize, new Sudoku('viral', solvedHandler), '#screen-viral')
  ];
  
  gameOver = false;

  setup();

};

const setup = () => {

  renderers.forEach((r) => {
    r.appendToTarget().render();
  });

};

const removeOld = () => {
  
  if(renderer) {
    renderer.destroy();
    renderer = null;
  };

};

const setPuzzle = (type) => {
  
  console.log(`setPuzzle(${type})`);

  renderers.filter((r) => {
    return !(r.puzzle.type===type);
  }).forEach((r) => {
    r.destroy();
  });

  const active = renderers.filter((r) => {
    return r.puzzle.type===type;
  })[0];

  renderer = active;
  puzzle = active.puzzle;

  console.log('active', active);

  start = Date.now();
  vswiper.disable();
  hswiper.disable();

};

const hswiper = new Swiper('.h-swiper', {
  initialSlide: 1,
  modules: [Parallax],
  parallax: true,
  nested: true,
  wrapperClass: 'h-swiper-wrapper'
});

const vswiper = new Swiper('.v-swiper', {
  direction: 'vertical',
  initialSlide: 1,
  modules: [Parallax],
  parallax: true,
  wrapperClass: 'v-swiper-wrapper'
});

hswiper.on('beforeTransitionStart', function(e) {
  // console.log('h-slide changed', e.activeIndex);
  if(e.activeIndex===0) {
    setPuzzle('jigsaw');
  };
  if(gameOver && e.activeIndex===1) {
    startNewGame();
  };
  if(e.activeIndex===2) {
    setPuzzle('standard');
  };
});

vswiper.on('beforeTransitionStart', function(e) {
  // console.log('v-slide changed', e.activeIndex);
  if(e.activeIndex===0) {
    setPuzzle('viral');
  };
  if(gameOver && e.activeIndex===1) {
    startNewGame();
  };
  if(e.activeIndex===2) {
    setPuzzle('daily');
  };
});

const welcome = document.querySelector('#screen-welcome');

welcome.innerHTML = `\
<div class="welcome-body">\
  <p class="swipe-up"><span>swipe up for</span> <strong>daily challenge</strong></p>\
  <p class="swipe-left"><span>swipe left for</span> <strong>standard sudoku</strong></p>\
  <p class="swipe-right"><span>swipe right for</span> <strong>jigsaw sudoku</strong></p>\
  <p class="swipe-down"><span>swipe down for</span> <strong>viral sudoku</strong></p>\
</div>`;

document.body.append(solvedNode);

startNewGame();

solvedNode.addEventListener('click', () => {
  vswiper.enable();
  vswiper.slideTo(1, 500);
  hswiper.enable();
  hswiper.slideTo(1, 500);
});

document.addEventListener('touchstart', function(e) {

  if(!puzzle) {return};
    
  touch = e.touches[0];
  xMovement = 0;
  yMovement = 0;

  e.preventDefault();

}, {passive: false});

document.addEventListener('touchmove', function(e) {

  if(!puzzle) {return};
  
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

  if(!puzzle) {return};

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
