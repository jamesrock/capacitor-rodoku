import { createNode, isValidKey, timeToDisplay } from './utils';
import { Sudoku } from './Sudoku';
import { Storage } from './Storage';
import { Rounder } from './Rounder';

const limit = (value, max) => value > max ? max : value;
const makeEven = (value) => value % 2 === 1 ? value - 1 : value;
const root = document.querySelector(':root');
const sqareSize = makeEven(limit(Math.round(window.innerWidth / 10), 50));
const border = 1;
const blockSize = (sqareSize*3) + (border*6);
const puzzleSize = (blockSize*3) + (border*6);
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
let best = storage.get('best') || 0;
let puzzleNode = null;
let puzzle = null;
let start = 0;
let touch = null;
let xMovement = 0;
let yMovement = 0;
let activeX = 0;
let activeY = 0;
let squares;
let number = 1;
let gameOver = false;

const checkForWin = () => {
  const blocks = [...document.querySelectorAll('.square')];
  const correct = blocks.filter((node) => {
    return node.getAttribute('data-value')===puzzle.solution[node.getAttribute('data-id')];
  }).length;
  console.log('correct', correct);
  if(correct===81) {
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
};

const make = () => {

  if(puzzleNode) {
    puzzleNode.parentNode.removeChild(puzzleNode);
  };

  gameOver = true;
  start = Date.now();
  puzzleNode = createNode('div', 'puzzle');
  puzzle = new Sudoku();
  solvedNode.setAttribute('data-state', 'hidden');

  puzzle.data.forEach((block) => {
    const blockNode = createNode('div', 'block');
    block.forEach((number) => {
      console.log(number);
      const squareNode = createNode('div', 'square');
      squareNode.setAttribute('data-coord', number[2]);
      squareNode.setAttribute('data-id', number[3]);
      squareNode.setAttribute('data-locked', number[1]);
      squareNode.setAttribute('data-value', number[1] ? number[0] : '0');
      squareNode.innerHTML = number[1] ? number[0] : '';
      blockNode.append(squareNode);
    });
    puzzleNode.append(blockNode);
  });

  document.body.append(puzzleNode);

  setTimeout(() => {
    puzzleNode.setAttribute('data-state', 'show');
  }, 500);

  squares = document.querySelectorAll(`.square`);
  highlight();

};

const move = (direction) => {

  console.log(`move(${direction})`);

  switch(direction) {
    case 'up':
      if(activeY===0) {return};
      activeY -= 1;
    break;
    case 'down':
      if(activeY===8) {return};
      activeY += 1;
    break;
    case 'left':
      if(activeX===0) {return};
      activeX -= 1;
    break;
    case 'right':
      if(activeX===8) {return};
      activeX += 1;
    break;
  };

  highlight();

};

const highlight = () => {
  squares.forEach((node) => {
    node.classList.remove('active');
  });
  const active = document.querySelector(`.square[data-coord="x${activeX}y${activeY}"]`);
  active.classList.add('active');
  number = parseFloat(active.getAttribute('data-value'));
  increment();
};

const fill = () => {
  console.log(`fill(${number})`);
  const active = document.querySelector(`.square.active`);
  if(active.getAttribute('data-locked')==='1') {
    return;
  };
  active.innerHTML = number === 0 ? '' : number;
  active.setAttribute('data-value', number);
  increment();
  checkForWin();
};

const increment = () => {
  if(number===9) {
    number = 0;
  }
  else {
    number ++;
  };
};

document.body.append(solvedNode);

solvedNode.addEventListener('click', () => {
  make();
});

root.style.setProperty('--puzzle-size', `${puzzleSize}px`);
root.style.setProperty('--block-size', `${blockSize}px`);
root.style.setProperty('--square-size', `${sqareSize}px`);
root.style.setProperty('--square-font-size', `${sqareSize - 10}px`);

setTimeout(() => {
  document.body.setAttribute('data-state', 'loaded');
  make();
}, 250);

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

document.addEventListener('keydown', function(e) {

  if(isValidKey(e.code, directionKeys)) {
    move(directionKeysMap[e.code]);
  };

  if(isValidKey(e.code, rotateKeys)) {
    fill();
  };

});