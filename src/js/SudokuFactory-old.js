import { getSudoku } from 'sudoku-gen';
const getRandomIndex = (target) => Math.floor(Math.random() * target.length);
const getRandom = (target, column, row, box, coord) => {

  // console.log('column', column);

  const exclude = [...column, ...box, ...row].filter((item) => {
    return item>0;
  });

  const available = target.filter((item) => {
    return !exclude.includes(item);
  });

  console.log(`exclude & available ${coord}`, column, row, box, exclude, available);

  const index = getRandomIndex(available);

  // console.log('available', available);
  // console.log(target[index], column.includes(target[index]));

  // return target.splice(target.indexOf(available[index]), 1)[0];
  return available[index];
};
const get = (bob, index) => {
  return bob && bob[index] ? bob[index] : 0;
};
const formatData = (bob) => {
  return [
    [get(bob[0], 0), get(bob[0], 3), get(bob[0], 6), get(bob[3], 0), get(bob[3], 3), get(bob[3], 6), get(bob[6], 0), get(bob[6], 3), get(bob[6], 6)], // 0
    [get(bob[0], 1), get(bob[0], 4), get(bob[0], 7), get(bob[3], 1), get(bob[3], 4), get(bob[3], 7), get(bob[6], 1), get(bob[6], 4), get(bob[6], 7)], // 1
    [get(bob[0], 2), get(bob[0], 5), get(bob[0], 8), get(bob[3], 2), get(bob[3], 5), get(bob[3], 8), get(bob[6], 2), get(bob[6], 5), get(bob[6], 8)], // 2

    [get(bob[1], 0), get(bob[1], 3), get(bob[1], 6), get(bob[4], 0), get(bob[4], 3), get(bob[4], 6), get(bob[7], 0), get(bob[7], 3), get(bob[7], 6)], // 3
    [get(bob[1], 1), get(bob[1], 4), get(bob[1], 7), get(bob[4], 1), get(bob[4], 4), get(bob[4], 7), get(bob[7], 1), get(bob[7], 4), get(bob[7], 7)], // 4
    [get(bob[1], 2), get(bob[1], 5), get(bob[1], 8), get(bob[4], 2), get(bob[4], 5), get(bob[4], 8), get(bob[7], 2), get(bob[7], 5), get(bob[7], 8)], // 5

    [get(bob[2], 0), get(bob[2], 3), get(bob[2], 6), get(bob[5], 0), get(bob[5], 3), get(bob[5], 6), get(bob[8], 0), get(bob[8], 3), get(bob[8], 6)], // 6
    [get(bob[2], 1), get(bob[2], 4), get(bob[2], 7), get(bob[5], 1), get(bob[5], 4), get(bob[5], 7), get(bob[8], 1), get(bob[8], 4), get(bob[8], 7)], // 7
    [get(bob[2], 2), get(bob[2], 5), get(bob[2], 8), get(bob[5], 2), get(bob[5], 5), get(bob[5], 8), get(bob[8], 2), get(bob[8], 5), get(bob[8], 8)], // 8

    // [get(bob[1], 0), get(bob[1], 1), get(bob[1], 2), get(bob[4], 0), get(bob[4], 1), get(bob[4], 2), get(bob[7], 0), get(bob[7], 1), get(bob[7], 2)],
    // [get(bob[3], 3), get(bob[3], 4), get(bob[3], 5), get(bob[4], 3), get(bob[4], 4), get(bob[4], 5), get(bob[5], 3), get(bob[5], 4), get(bob[5], 5)],
    // [get(bob[3], 6), get(bob[3], 7), get(bob[3], 8), get(bob[4], 6), get(bob[4], 7), get(bob[4], 8), get(bob[5], 6), get(bob[5], 7), get(bob[5], 8)],

    // [get(bob[6], 0), get(bob[6], 1), get(bob[6], 2), get(bob[7], 0), get(bob[7], 1), get(bob[7], 2), get(bob[8], 0), get(bob[8], 1), get(bob[8], 2)],
    // [get(bob[6], 3), get(bob[6], 4), get(bob[6], 5), get(bob[7], 3), get(bob[7], 4), get(bob[7], 5), get(bob[8], 3), get(bob[8], 4), get(bob[8], 5)],
    // [get(bob[6], 6), get(bob[6], 7), get(bob[6], 8), get(bob[7], 6), get(bob[7], 7), get(bob[7], 8), get(bob[8], 6), get(bob[8], 7), get(bob[8], 8)],
  ]
};
const getColumn = (data, index) => {
  return formatData(data)[index].filter((item) => {
    return item>0;
  });
};
const getRow = (data, index) => {
  return formatData(data).map((column) => {
    return column[index];
  }).filter((item) => {
    return item>0;
  });
};
const mappedLocals = {
  'x0y0': [0, 0],
  'x0y1': [1, 0],
  'x0y2': [2, 0],
  'x0y3': [0, 1],
  'x0y4': [1, 1],
  'x0y5': [2, 1],
  'x0y6': [0, 2],
  'x0y7': [1, 2],
  'x0y8': [2, 2],
  
  'x1y0': [3, 0],
  'x1y1': [4, 0],
  'x1y2': [5, 0],
  'x1y3': [3, 1],
  'x1y4': [4, 1],
  'x1y5': [5, 1],
  'x1y6': [3, 2],
  'x1y7': [4, 2],
  'x1y8': [5, 2],

  'x2y0': [6, 0],
  'x2y1': [7, 0],
  'x2y2': [8, 0],
  'x2y3': [6, 1],
  'x2y4': [7, 1],
  'x2y5': [8, 1],
  'x2y6': [6, 2],
  'x2y7': [7, 2],
  'x2y8': [8, 2],

  'x3y0': [0, 3],
  'x3y1': [1, 3],
  'x3y2': [2, 3],
  'x3y3': [0, 4],
  'x3y4': [1, 4],
  'x3y5': [2, 4],
  'x3y6': [0, 5],
  'x3y7': [1, 5],
  'x3y8': [2, 5],

  'x4y0': [3, 3],
  'x4y1': [4, 3],
  'x4y2': [5, 3],
  'x4y3': [3, 4],
  'x4y4': [4, 4],
  'x4y5': [5, 4],
  'x4y6': [3, 5],
  'x4y7': [4, 5],
  'x4y8': [5, 5],

  'x5y0': [6, 3],
  'x5y1': [7, 3],
  'x5y2': [8, 3],
  'x5y3': [6, 4],
  'x5y4': [7, 4],
  'x5y5': [8, 4],
  'x5y6': [6, 5],
  'x5y7': [7, 5],
  'x5y8': [8, 5],

  'x6y0': [0, 6],
  'x6y1': [1, 6],
  'x6y2': [2, 6],
  'x6y3': [0, 7],
  'x6y4': [1, 7],
  'x6y5': [2, 7],
  'x6y6': [0, 8],
  'x6y7': [1, 8],
  'x6y8': [2, 8],

  'x7y0': [3, 6],
  'x7y1': [4, 6],
  'x7y2': [5, 6],
  'x7y3': [3, 7],
  'x7y4': [4, 7],
  'x7y5': [5, 7],
  'x7y6': [3, 8],
  'x7y7': [4, 8],
  'x7y8': [5, 8],

  'x8y0': [6, 6],
  'x8y1': [7, 6],
  'x8y2': [8, 6],
  'x8y3': [6, 7],
  'x8y4': [7, 7],
  'x8y5': [8, 7],
  'x8y6': [6, 8],
  'x8y7': [7, 8],
  'x8y8': [8, 8],
};
const getLocalX = (coord) => mappedLocals[coord][0];
const getLocalY = (coord) => mappedLocals[coord][1];

export class SudokuFactory {
  constructor() {};
  make() {
    const bob = [];
    for(var i=0;i<9;i++) {
      const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      const box = [];
      bob.push(box);
      for(var a=0;a<9;a++) {
        bob[i].push(getRandom(numbers, getColumn(bob, getLocalX(`x${i}y${a}`)), getRow(bob, getLocalY(`x${i}y${a}`)), box, `x${i}y${a}`));
      };
    };
    console.log('raw bob', bob);
    return bob;
  };
};