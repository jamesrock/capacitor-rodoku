import { createNode, isValidKey, timeToDisplay, makeEven, getDateString, storage, getRandom } from './utils';
import { Sudoku } from './Sudoku';
import { Rounder } from './Rounder';
import { Renderer } from './Renderer';
import Swiper from 'swiper';
import { Parallax } from 'swiper/modules';
import 'swiper/scss';

const limit = (value, max) => value > max ? max : value;
const sqareSize = makeEven(limit(Math.round(window.innerWidth / 10), 50));
const puzzleSize = sqareSize*9;
const solvedNode = createNode('div', 'solved');
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
const modeToggle = document.querySelector('#mode-toggle');
const difficulties = ['easy', 'easy', 'medium', 'medium', 'medium', 'hard', 'hard'];
const difficultyMap = {
  'easy': 0,
  'medium': 1,
  'hard': 2,
  'daily': 3
};
const date = getDateString();
let times = storage.get('times');
let dailies = storage.get('dailies');
let start = 0;
let touch = null;
let xMovement = 0;
let yMovement = 0;
let gameOver = true;
let puzzle = null;
let renderer = null;
let renderers = [];
let mode = 'standard';

if(!times) {
  times = {
    'easy': 0,
    'medium': 0,
    'hard': 0,
    'expert': 0
  };
};

if(!dailies) {
  dailies = {
    'standard': {},
    'jigsaw': {}
  };
};

const getDailyPuzzle = () => {

  if(dailies && dailies[mode][date]) {
    console.log('has saved daily!', dailies[mode][date]);
    return new Sudoku(mode, null, solvedHandler, dailies[mode][date]);
  }
  else {
    return new Sudoku(mode, getRandom(difficulties), solvedHandler);
  };
  
};

const solvedHandler = () => {
  const time = (Date.now() - start);
  if(times[puzzle.difficulty]===0||time<times[puzzle.difficulty]) {
    times[puzzle.difficulty] = time;
    storage.set('times', times);
  };
  solvedNode.innerHTML = `<div class="game-over-body">\
    <h2>Solved!</h2>\
    <p class="time">Time: ${timeToDisplay(time)}</p>\
    <p class="best">Best: ${timeToDisplay(times[puzzle.difficulty])}</p>\
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
  console.log('startNewGame');

  solvedNode.setAttribute('data-state', 'hidden');

  removeOld();

  renderers = [
    new Renderer(puzzleSize, puzzleSize, new Sudoku(mode, 'easy', solvedHandler), '#screen-easy'),
    new Renderer(puzzleSize, puzzleSize, new Sudoku(mode, 'medium', solvedHandler), '#screen-medium'),
    new Renderer(puzzleSize, puzzleSize, new Sudoku(mode, 'hard', solvedHandler), '#screen-hard'),
    new Renderer(puzzleSize, puzzleSize, getDailyPuzzle(), '#screen-daily')
  ];
  
  gameOver = false;

  setup();

};

const setup = () => {

  renderers.forEach((r) => {
    r.appendToTarget();
    r.render();
    r.stop();
  });

};

const removeOld = () => {
  
  if(renderer) {
    renderer = null;
  };

  renderers.forEach((r) => {
    r.destroy();
  });

};

const setPuzzle = (difficulty) => {
  
  console.log(`setPuzzle(${difficulty})`);
  
  const active = renderers[difficultyMap[difficulty]].render();

  renderer = active;
  puzzle = active.puzzle;

  console.log('active', active);

  start = Date.now();
  vswiper.disable();
  hswiper.disable();

  if(difficulty==='daily') {
    storage.set('dailies', {
      ...dailies,
      [mode]: {...dailies[mode], [date]: puzzle.getSaveObject()}
    });
  };

};

const toggleMode = () => {
  console.log('toggleMode');
  if(hswiper.activeIndex===1 && vswiper.activeIndex===1) {
    mode = mode==='standard' ? 'jigsaw' : 'standard';
    modeToggle.innerHTML = `${mode==='standard' ? 'jigsaw' : 'standard'} mode`;
    startNewGame(true);
  };
};

const initHandler = (swiper) => {
  setTimeout(() => {
    swiper.el.setAttribute('data-state', 'show');
  }, 500);
};

const hswiper = new Swiper('.h-swiper', {
  initialSlide: 1,
  modules: [Parallax],
  parallax: true,
  nested: true,
  wrapperClass: 'h-swiper-wrapper',
  on: {
    init: initHandler
  }
});

const vswiper = new Swiper('.v-swiper', {
  direction: 'vertical',
  initialSlide: 1,
  modules: [Parallax],
  parallax: true,
  wrapperClass: 'v-swiper-wrapper',
  on: {
    init: initHandler
  }
});

hswiper.on('beforeTransitionStart', (e) => {
  console.log('h-slide changed', e.activeIndex);
  if(e.activeIndex===0) {
    setPuzzle('hard');
  };
  if(e.activeIndex===1) {
    startNewGame();
  };
  if(e.activeIndex===2) {
    setPuzzle('medium');
  };
});

vswiper.on('beforeTransitionStart', (e) => {
  console.log('v-slide changed', e.activeIndex);
  if(e.activeIndex===0) {
    setPuzzle('daily');
  };
  if(e.activeIndex===1) {
    startNewGame();
  };
  if(e.activeIndex===2) {
    setPuzzle('easy');
  };
});

document.body.append(solvedNode);

solvedNode.addEventListener('click', () => {
  vswiper.enable();
  vswiper.slideTo(1, 500);
  hswiper.enable();
  hswiper.slideTo(1, 500);
});

document.addEventListener('touchstart', function(e) {

  touch = e.touches[0];
  xMovement = 0;
  yMovement = 0;

  e.preventDefault();

}, {passive: false});

document.addEventListener('touchmove', function(e) {
  
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

  if(xMovement===0 && yMovement===0) {
    puzzle ? puzzle.fill() : toggleMode();
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

  if(puzzle && isValidKey(e.code, directionKeys)) {
    puzzle.move(directionKeysMap[e.code]);
  };

  if(isValidKey(e.code, rotateKeys)) {
    puzzle ? puzzle.fill() : toggleMode();
  };

});

async function loadFont(fontFamily = '', url = '', props = {}) {
  const font = new FontFace(`${fontFamily}`, `url(${url})`, props);
  await font.load();
  document.fonts.add(font);
};

(async() => {
  await loadFont('Poppins', '/fonts/Poppins-ExtraBold.ttf', {
    style: 'normal',
    weight: '800'
  });
  document.body.setAttribute('data-state', 'loaded');
  startNewGame();
})();
