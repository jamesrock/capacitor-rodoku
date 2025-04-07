import { getSudoku } from 'sudoku-gen';
import { shuffle } from './utils';

const mapper = (puzzle, solution) => {
  const targets = shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8]).splice(0, 4);
  return (item, index) => {
    return targets.includes(index) ? [solution[item], 0] : [solution[item], 1];
    // return [solution[item], puzzle[item]==='-' ? 0 : 1];
  };
};

const indexes = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8],
  [6, 3, 0, 7, 4, 1, 8, 5, 2],
  [8, 7, 6, 5, 4, 3, 2, 1, 0],
  [2, 5, 8, 1, 4, 7, 0, 3, 6]
];

const fake = [
  1, 2, 3, 1, 2, 3, 1, 2, 3,
  4, 5, 6, 4, 5, 6, 4, 5, 6,
  7, 8, 9, 7, 8, 9, 7, 8, 9,
  1, 2, 3, 1, 2, 3, 1, 2, 3,
  4, 5, 6, 4, 5, 6, 4, 5, 6,
  7, 8, 9, 7, 8, 9, 7, 8, 9,
  1, 2, 3, 1, 2, 3, 1, 2, 3,
  4, 5, 6, 4, 5, 6, 4, 5, 6,
  7, 8, 9, 7, 8, 9, 7, 8, 9,
];

export class Sudoku {
  constructor() {
    const sudoku = this.sudoku = getSudoku('easy');
    const puzzle = sudoku.puzzle.split('');
    const solution = sudoku.solution.split('');
    this.data = [
      [0, 1, 2, 9, 10, 11, 18, 19, 20].map(mapper(puzzle, solution)),
      [3, 4, 5, 12, 13, 14, 21, 22, 23].map(mapper(puzzle, solution)),
      [6, 7, 8, 15, 16, 17, 24, 25, 26].map(mapper(puzzle, solution)),
      [27, 28, 29, 36, 37, 38, 45, 46, 47].map(mapper(puzzle, solution)),
      [30, 31, 32, 39, 40, 41, 48, 49, 50].map(mapper(puzzle, solution)),
      [33, 34, 35, 42, 43, 44, 51, 52, 53].map(mapper(puzzle, solution)),
      [54, 55, 56, 63, 64, 65, 72, 73, 74].map(mapper(puzzle, solution)),
      [57, 58, 59, 66, 67, 68, 75, 76, 77].map(mapper(puzzle, solution)),
      [60, 61, 62, 69, 70, 71, 78, 79, 80].map(mapper(puzzle, solution))
    ];
    console.log(this);
  };
};


