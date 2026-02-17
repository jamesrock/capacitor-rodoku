import '../css/app.css';
import 'swiper/css';
import { storage } from './utils';
import { 
  createNode, 
  isValidKey, 
  formatTime, 
  makeEven, 
  getDateString, 
  getRandom, 
  limit
} from '@jamesrock/rockjs';
import { Sudoku } from './Sudoku';
import { Rounder } from './Rounder';
import { Renderer } from './Renderer';
import { Parallax } from 'swiper/modules';
import Swiper from 'swiper';

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

if(!dailies) {
  dailies = {
    'standard': {},
    'jigsaw': {}
  };
};

const getPuzzle = (difficulty) => {
  return new Sudoku(mode, difficulty, solvedHandler);
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
  console.log('startNewGame');

  solvedNode.setAttribute('data-state', 'hidden');

  removeOld();

  renderers = [
    new Renderer(puzzleSize, puzzleSize, getPuzzle('easy'), '#screen-easy'),
    new Renderer(puzzleSize, puzzleSize, getPuzzle('medium'), '#screen-medium'),
    new Renderer(puzzleSize, puzzleSize, getPuzzle('hard'), '#screen-hard'),
    new Renderer(puzzleSize, puzzleSize, getDailyPuzzle(), '#screen-daily')
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
    renderer = null;
  };

  renderers.forEach((r) => {
    r.destroy();
  });

};

const setPuzzle = (difficulty) => {
  
  console.log(`setPuzzle(${difficulty})`);
  
  const active = renderers[difficultyMap[difficulty]];

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

const restart = () => {
  vswiper.enable();
  vswiper.slideTo(1, 500);
  hswiper.enable();
  hswiper.slideTo(1, 500);
};

const move = (d) => {
  if(!puzzle) {return};
  puzzle.move(d);
  renderer.render();
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
    if(gameOver) {
      restart();
    }
    else {
      puzzle ? puzzle.fill() : toggleMode();
    };
  };

  renderer && renderer.render();

});

document.addEventListener('drag-down', () => {
  move('down');
});

document.addEventListener('drag-up', () => {
  move('up');
});

document.addEventListener('drag-right', () => {
  move('right');
});

document.addEventListener('drag-left', () => {
  move('left');
});

document.addEventListener('keydown', (e) => {

  if(puzzle && isValidKey(e.code, directionKeys)) {
    move(directionKeysMap[e.code]);
  };

  if(isValidKey(e.code, rotateKeys)) {
    if(gameOver) {
      restart();
    }
    else {
      puzzle ? puzzle.fill() : toggleMode();
    };
  };

  renderer && renderer.render();

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

const showGuide = (rotation) => {
  const guide = createNode('div', 'guide');
  guide.style.transform = `rotate(${90*rotation}deg)`;
  for(var i=0;i<81;i++) {
    const child = createNode('div', 'guide-item');
    child.innerHTML = i;
    child.style.transform = `rotate(${-90*rotation}deg)`;
    guide.append(child);
  };
  document.body.append(guide);
};

const bob = [
  [0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0], [8, 0], [9, 0],
  [0, 1], [1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1], [7, 1], [8, 1], [9, 1],
  [0, 2], [1, 2], [2, 2], [3, 2], [4, 2], [5, 2], [6, 2], [7, 2], [8, 2], [9, 2],
  [0, 3], [1, 3], [2, 3], [3, 3], [4, 3], [5, 3], [6, 3], [7, 3], [8, 3], [9, 3],
  [0, 4], [1, 4], [2, 4], [3, 4], [4, 4], [5, 4], [6, 4], [7, 4], [8, 4], [9, 4],
  [0, 5], [1, 5], [2, 5], [3, 5], [4, 5], [5, 5], [6, 5], [7, 5], [8, 5], [9, 5],
  [0, 6], [1, 6], [2, 6], [3, 6], [4, 6], [5, 6], [6, 6], [7, 6], [8, 6], [9, 6],
  [0, 7], [1, 7], [2, 7], [3, 7], [4, 7], [5, 7], [6, 7], [7, 7], [8, 7], [9, 7],
  [0, 8], [1, 8], [2, 8], [3, 8], [4, 8], [5, 8], [6, 8], [7, 8], [8, 8], [9, 8],
  [0, 9], [1, 9], [2, 9], [3, 9], [4, 9], [5, 9], [6, 9], [7, 9], [8, 9], [9, 9]
];

const showGuide2 = (rotation) => {
  const guide = createNode('div', 'guide2');
  guide.style.transform = `rotate(${90*rotation}deg)`;
  bob.forEach((coord) => {
    const child = createNode('div', 'guide-item');
    child.innerHTML = coord.join(',');
    child.style.transform = `rotate(${-90*rotation}deg)`;
    guide.append(child);
  });
  document.body.append(guide);
};

// showGuide(0);
// showGuide2(3);