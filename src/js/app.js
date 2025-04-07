import { createNode } from './utils';
import { SudokuFactory } from './SudokuFactory';

const getRandomIndex = (target) => Math.floor(Math.random() * target.length);
const getRandom = (target) => target[getRandomIndex(target)];
const limit = (value, max) => value > max ? max : value;
const makeEven = (value) => value % 2 === 1 ? value - 1 : value;
const factory = new SudokuFactory();
const root = document.querySelector(':root');
const sqareSize = makeEven(limit(Math.round(window.innerWidth / 10), 50));
const border = 1;
const blockSize = (sqareSize*3) + (border*6);
const puzzleSize = (blockSize*3) + (border*6);
const solvedNode = createNode('div', 'solved');
const rotations = [0, 1, 2, 3];
let puzzleNode = null;
let zIndex = null;
let puzzle = null;

const checkForWin = () => {
  let count = 0;
  let first = 0;
  document.querySelectorAll('.block').forEach((node, index) => {
    first = index===0 ? node.getAttribute('data-rotation') : first;
    if(node.getAttribute('data-rotation')===first) {
      count ++;
    };
  });
  console.log(count);
  if(count===9) {
    solvedNode.innerHTML = `<div><h2>Solved!</h2><p>Tap to try again.</p></div>`;
    solvedNode.setAttribute('data-state', 'pre-show');
    document.querySelectorAll('.rotate').forEach((node) => {
      node.style.opacity = 1;
    });
    setTimeout(() => {
      solvedNode.setAttribute('data-state', 'show');
    }, 1000);
  };
};

const make = () => {

  if(puzzleNode) {
    puzzleNode.parentNode.removeChild(puzzleNode);
  };

  zIndex = 0;
  puzzleNode = createNode('div', 'puzzle');
  puzzle = factory.make();
  solvedNode.setAttribute('data-state', 'hidden');

  puzzle.forEach((block) => {
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
root.style.setProperty('--square-size', `${sqareSize}px`);
root.style.setProperty('--square-font-size', `${sqareSize - 10}px`);

setTimeout(() => {
  document.body.setAttribute('data-state', 'loaded');
  make();
}, 250);
