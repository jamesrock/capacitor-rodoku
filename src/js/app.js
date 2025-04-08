import { createNode, timeToDisplay } from './utils';
import { Sudoku } from './Sudoku';
import { Storage } from './Storage';

const getRandomIndex = (target) => Math.floor(Math.random() * target.length);
const getRandom = (target) => target[getRandomIndex(target)];
const limit = (value, max) => value > max ? max : value;
const makeEven = (value) => value % 2 === 1 ? value - 1 : value;
const root = document.querySelector(':root');
const squareSize = makeEven(limit(Math.round(window.innerWidth / 10), 50));
const border = 1;
const blockSize = (squareSize*3) + (border*6);
const puzzleSize = (blockSize*3) + (border*6);
const solvedNode = createNode('div', 'solved');
const rotations = [0, 1, 2, 3];
const storage = new Storage('me.jamesrock.rodoku');
let best = storage.get('best') || 0;
let puzzleNode = null;
let zIndex = null;
let puzzle = null;
let start = 0;

const checkForWin = () => {
  const blocks = [...document.querySelectorAll('.block')];
  const correct = blocks.filter((node) => {
    return node.getAttribute('data-rotation')==='0';
  }).length;
  const opposite = blocks.filter((node) => {
    return node.getAttribute('data-rotation')==='0.5';
  }).length;
  console.log('correct', correct);
  console.log('opposite', opposite);
  if(correct===9 || opposite===9) {
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
      document.querySelectorAll('.rotate').forEach((node) => {
        node.style.opacity = 1;
      });
      setTimeout(() => {
        solvedNode.setAttribute('data-state', 'show');
      }, 750);
    }, 300);
  };
};

const make = () => {

  if(puzzleNode) {
    puzzleNode.parentNode.removeChild(puzzleNode);
  };

  start = Date.now();
  zIndex = 0;
  puzzleNode = createNode('div', 'puzzle');
  puzzle = new Sudoku();
  solvedNode.setAttribute('data-state', 'hidden');

  puzzle.data.forEach((block) => {
    const blockNode = createNode('div', 'block');
    let rotation = getRandom(rotations);
    const rotateNodes = [];
    const eventHandler = () => {
      rotation ++;
      zIndex ++;
      blockNode.style.transform = `rotate(${90*rotation}deg)`;
      blockNode.style.zIndex = zIndex;
      rotateNodes.forEach((rotateNode) => {
        rotateNode.style.transform = `rotate(${-90*rotation}deg)`;
      });
      blockNode.setAttribute('data-rotation', (90*rotation) / 360 % 1);
      checkForWin();
    };
    block.forEach((number) => {
      const squareNode = createNode('div', 'square');
      const rotateNode = createNode('span', 'rotate');
      rotateNode.innerHTML = number[0];
      rotateNode.style.opacity = number[1];
      squareNode.append(rotateNode);
      blockNode.append(squareNode);
      rotateNodes.push(rotateNode);
    });
    puzzleNode.append(blockNode);
    blockNode.addEventListener('click', eventHandler);
    eventHandler();
  });

  document.body.append(puzzleNode);

  setTimeout(() => {
    puzzleNode.setAttribute('data-state', 'show');
  }, 500);

};

document.body.append(solvedNode);

solvedNode.addEventListener('click', () => {
  make();
});

root.style.setProperty('--puzzle-size', `${puzzleSize}px`);
root.style.setProperty('--block-size', `${blockSize}px`);
root.style.setProperty('--square-size', `${squareSize}px`);
root.style.setProperty('--square-font-size', `${squareSize - 10}px`);

setTimeout(() => {
  document.body.setAttribute('data-state', 'loaded');
  make();
}, 250);
