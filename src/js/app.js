import { puzzles } from './puzzles';
import { createNode } from './utils';

const getRandomIndex = (target) => Math.floor(Math.random() * target.length);
const getRandom = (target) => target[getRandomIndex(target)];

const puzzle = getRandom(puzzles);
const root = document.querySelector(':root');
const sqareSize = 50;
const border = 1;
const blockSize = (sqareSize*3) + (border*6);
const puzzleSize = (blockSize*3) + (border*6);
const puzzleNode = createNode('div', 'puzzle');
const rotations = [0, 1, 2, 3];

puzzle.forEach((block) => {
  const blockNode = createNode('div', 'block');
  let rotation = getRandom(rotations);
  const rotateNodes = [];
  const eventHandler = () => {
    rotation ++;
    blockNode.style.transform = `rotate(${90*rotation}deg)`;
    rotateNodes.forEach((rotateNode) => {
      rotateNode.style.transform = `rotate(${-90*rotation}deg)`;
    });
    blockNode.setAttribute('data-rotation', (90*rotation) / 360 % 1);
  };
  block.forEach((number) => {
    const squareNode = createNode('div', 'square');
    const rotateNode = createNode('span', 'rotate');
    rotateNode.innerHTML = number;
    squareNode.append(rotateNode);
    blockNode.append(squareNode);
    rotateNodes.push(rotateNode);
  });
  puzzleNode.append(blockNode);
  blockNode.addEventListener('click', eventHandler);
  eventHandler();
});

document.body.append(puzzleNode);

root.style.setProperty('--puzzle-size', `${puzzleSize}px`);
root.style.setProperty('--block-size', `${blockSize}px`);
root.style.setProperty('--square-size', `${sqareSize}px`);
root.style.setProperty('--square-font-size', `${sqareSize - 16}px`);
