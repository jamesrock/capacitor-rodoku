import { getSudoku } from 'sudoku-gen';
import { puzzles } from './puzzles';
import { inflate, makeEven } from './utils';

const getRandomIndex = (target) => Math.floor(Math.random() * target.length);
const getRandom = (target) => target[getRandomIndex(target)];

const colours = [
	[199, 217, 140], [229, 205, 239], [192, 230, 250], [188, 223, 199], [212, 208, 241], [250, 216, 234], [247, 214, 193], [255, 251, 196], [197, 210, 244]
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

const standardOverlay = [
  [[0, 0], [3, 0], [3, 3], [0, 3], [0, 0]],
  [[3, 0], [6, 0], [6, 3], [3, 3], [3, 0]],
  [[6, 0], [9, 0], [9, 3], [6, 3], [6, 0]],
  [[0, 3], [3, 3], [3, 6], [0, 6], [0, 3]],
  [[3, 3], [6, 3], [6, 6], [3, 6], [3, 3]],
  [[6, 3], [9, 3], [9, 6], [6, 6], [6, 3]],
  [[0, 6], [3, 6], [3, 9], [0, 9], [0, 6]],
  [[3, 6], [6, 6], [6, 9], [3, 9], [3, 6]],
  [[6, 6], [9, 6], [9, 9], [6, 9], [6, 6]]
];

const tileMap = [
  [0, 0, 0], [1, 0, 1], [2, 0, 2], [0, 1, 9], [1, 1, 10], [2, 1, 11], [0, 2, 18], [1, 2, 19], [2, 2, 20],
  [3, 0, 3], [4, 0, 4], [5, 0, 5], [3, 1, 12], [4, 1, 13], [5, 1, 14], [3, 2, 21], [4, 2, 22], [5, 2, 23],
  [6, 0, 6], [7, 0, 7], [8, 0, 8], [6, 1, 15], [7, 1, 16], [8, 1, 17], [6, 2, 24], [7, 2, 25], [8, 2, 26],
  [0, 3, 27], [1, 3, 28], [2, 3, 29], [0, 4, 36], [1, 4, 37], [2, 4, 38], [0, 5, 45], [1, 5, 46], [2, 5, 47],
  [3, 3, 30], [4, 3, 31], [5, 3, 32], [3, 4, 39], [4, 4, 40], [5, 4, 41], [3, 5, 48], [4, 5, 49], [5, 5, 50],
  [6, 3, 33], [7, 3, 34], [8, 3, 35], [6, 4, 42], [7, 4, 43], [8, 4, 44], [6, 5, 51], [7, 5, 52], [8, 5, 53],
  [0, 6, 54], [1, 6, 55], [2, 6, 56], [0, 7, 63], [1, 7, 64], [2, 7, 65], [0, 8, 72], [1, 8, 73], [2, 8, 74],
  [3, 6, 57], [4, 6, 58], [5, 6, 59], [3, 7, 66], [4, 7, 67], [5, 7, 68], [3, 8, 75], [4, 8, 76], [5, 8, 77],
  [6, 6, 60], [7, 6, 61], [8, 6, 62], [6, 7, 69], [7, 7, 70], [8, 7, 71], [6, 8, 78], [7, 8, 79], [8, 8, 80]
];

export class Sudoku {
	constructor(type = 'standard', solvedHandler, saved) {

    if(type==='standard') {
      
      const sudoku = saved ? saved : getSudoku('medium');
      const puzzle = sudoku.puzzle.split('').map((item) => {
        return item==='-' ? 0 : parseFloat(item);
      });
      const solution = sudoku.solution.split('').map((item) => {
        return parseFloat(item);
      });

      this.numbers = solution;
      this.clues = puzzle;
      this.overlay = standardOverlay;
      this.data = sudoku;

    }
    else if(type==='jigsaw') {

      // const puzzle = saved ? saved : getRandom(puzzles);
      const puzzle = puzzles[puzzles.length-1];

      this.overlay = puzzle[0];
      this.numbers = puzzle[1];
      this.clues = puzzle[2];
      this.data = puzzle;

    };

    this.tiles = tileMap.map((data) => {
      return new PuzzleTile(this, data[0], data[1], brown[data[2]], data[2]);
    });
    this.type = type;
    this.solvedHandler = solvedHandler;

    console.log(this);

		this.highlight();

	};
	render(ctx, renderer) {
    
		const size = inflate(renderer.width/9);
		const offset = renderer.offset;

    // console.log(size);

		ctx.fillStyle = 'grey';
		ctx.fillRect(
			0 + offset, 
			0 + offset, 
			(size * 9), 
			(size * 9)
		);

		this.tiles.forEach((tile) => {

			ctx.fillStyle = tile.highlight ? `rgb(255,255,0)` : `rgb(255,255,255)`;
			
			ctx.fillRect(
				(tile.x * size) + offset, 
				(tile.y * size) + offset, 
				size, 
				size
			);

			ctx.font = `900 ${size-10}px Poppins`;
			ctx.textAlign = 'center';
			ctx.fillStyle = tile.clue ? 'rgb(0,0,0)' : 'rgb(148,0,211)';
			
			ctx.fillText(
				tile.display===0?'':tile.display, 
				(tile.x * size) + (size/2) + offset, 
				(tile.y * size) + (size-17) + offset
			);

		});

		this.overlay.forEach((coords) => {
			coords.forEach((bob, index) => {
				ctx.lineWidth = 8;
				ctx.lineCap = 'square';
				ctx.strokeStyle = `rgb(0,0,0)`;
				ctx.moveTo(
					(bob[0]*size) + offset, 
					(bob[1]*size) + offset
				);
				if(coords[index+1]) {
					ctx.lineTo(
						(coords[index+1][0]*size) + offset, 
						(coords[index+1][1]*size) + offset
					);
				}
				else {
					ctx.stroke();
				};
			});
		});

		[1, 2, 3, 4, 5, 6, 7, 8].forEach((x) => {
			ctx.lineWidth = 2;
			ctx.lineCap = 'square';
			ctx.moveTo(
				(x*size) + offset,
				offset
			);
			ctx.lineTo(
				(x*size) + offset,
				(9*size) + offset
			);
			ctx.stroke();
		});

		[1, 2, 3, 4, 5, 6, 7, 8].forEach((y) => {
			ctx.lineWidth = 2;
			ctx.lineCap = 'square';
			ctx.moveTo(
				offset,
				(y*size) + offset
			);
			ctx.lineTo(
				(9*size) + offset,
				(y*size) + offset
			);
			ctx.stroke();
		});

	};
	getValues() {

		return this.data;

	};
	move(direction) {

		console.log(`move(${direction})`);

		switch(direction) {
			case 'up':
				if(this.activeY===0) {return};
				this.activeY -= 1;
			break;
			case 'down':
				if(this.activeY===8) {return};
				this.activeY += 1;
			break;
			case 'left':
				if(this.activeX===0) {return};
				this.activeX -= 1;
			break;
			case 'right':
				if(this.activeX===8) {return};
				this.activeX += 1;
			break;
		};

		this.highlight();

	};
	highlight() {
		const active = this.getActive();
		this.tiles.forEach((tile) => {
			tile.highlight = false;
		});
		active.highlight = true;
	};
	fill() {
		const active = this.getActive();
		active.increment();
		this.checkForWin();
	};
	checkForWin() {
		const correct = this.tiles.filter((tile) => {
			return tile.display===tile.value;
		}).length;
		console.log('correct', correct);
		if(correct===81) {
			this.solvedHandler();
		};
	};
	getActive() {
		return this.tiles.filter((tile) => {
			return tile.name === `x${this.activeX}y${this.activeY}`;
		})[0];
	};
	activeX = 0;
	activeY = 0;
};

class PuzzleTile {
	constructor(puzzle, x, y, name, index) {

		this.puzzle = puzzle;
		this.name = name;
		this.value = this.puzzle.numbers[index];
		this.clue = this.puzzle.clues[index];
		this.display = this.clue ? this.value : 0;
		this.x = x;
		this.y = y;

	};
	increment() {
		if(this.clue) {return};
		if(this.display===9) {
			this.display = 0;
		}
		else {
			this.display ++;
		};
		return this;
	};
	highlight = false;
	value = 0;
	maxValue = 9;
	hint = false;
	logic = 0;
};
