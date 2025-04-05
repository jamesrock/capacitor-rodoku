import { shuffle } from './utils';

const getRandomIndex = (target) => Math.floor(Math.random() * target.length);
const getRandom = (target, exclude) => {
  
  console.log('exclude', exclude);

  const available = target.filter((item) => {
    return !exclude.includes(item);
  });

  const index = getRandomIndex(available);

  console.log('available', available);
  console.log(target[index], exclude.includes(target[index]));

  return target.splice(target.indexOf(available[index]), 1)[0];
};
const getColumn = (data, index) => data.map((row) => {return row[index]})

export class SudokuFactory {
  constructor() {};
  make() {
    const bob = [];
    for(var i=0;i<9;i++) {
      const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      bob.push([
        getRandom(numbers, getColumn(bob, 0)), 
        getRandom(numbers, getColumn(bob, 1)), 
        getRandom(numbers, getColumn(bob, 2)), 
        getRandom(numbers, getColumn(bob, 3)), 
        getRandom(numbers, getColumn(bob, 4)), 
        getRandom(numbers, getColumn(bob, 5)), 
        getRandom(numbers, getColumn(bob, 6)), 
        getRandom(numbers, getColumn(bob, 7)), 
        getRandom(numbers, getColumn(bob, 8))
      ]);
    };
    return bob;
  };
};