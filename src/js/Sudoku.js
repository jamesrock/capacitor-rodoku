import { getSudoku } from 'sudoku-gen';

const mapper = (puzzle, solution) => {
  return (item) => {
    return [`${solution[item]}`, puzzle[item]==='-' ? 0 : 1, brown[item], item];
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
  7, 8, 9, 7, 8, 9, 7, 8, 9
];

const brown = [
  'x0y0', 'x1y0', 'x2y0', 'x3y0', 'x4y0', 'x5y0', 'x6y0', 'x7y0', 'x8y0',
  'x0y1', 'x1y1', 'x2y1', 'x3y1', 'x4y1', 'x5y1', 'x6y1', 'x7y1', 'x8y1',
  'x0y2', 'x1y2', 'x2y2', 'x3y2', 'x4y2', 'x5y2', 'x6y2', 'x7y2', 'x8y2',
  'x0y3', 'x1y3', 'x2y3', 'x3y3', 'x4y3', 'x5y3', 'x6y3', 'x7y3', 'x8y3',
  'x0y4', 'x1y4', 'x2y4', 'x3y4', 'x4y4', 'x5y4', 'x6y4', 'x7y4', 'x8y4',
  'x0y5', 'x1y5', 'x2y5', 'x3y5', 'x4y5', 'x5y5', 'x6y5', 'x7y5', 'x8y5',
  'x0y6', 'x1y6', 'x2y6', 'x3y6', 'x4y6', 'x5y6', 'x6y6', 'x7y6', 'x8y6',
  'x0y7', 'x1y7', 'x2y7', 'x3y7', 'x4y7', 'x5y7', 'x6y7', 'x7y7', 'x8y7',
  'x0y8', 'x1y8', 'x2y8', 'x3y8', 'x4y8', 'x5y8', 'x6y8', 'x7y8', 'x8y8'
];

export class Sudoku {
  constructor() {
    const sudoku = getSudoku('easy');
    const puzzle = this.puzzle = sudoku.puzzle.split('');
    const solution = this.solution = sudoku.solution.split('');
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


