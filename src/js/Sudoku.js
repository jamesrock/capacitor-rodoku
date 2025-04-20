import { getSudoku } from 'sudoku-gen';
import { puzzles } from './puzzles';
import { inflate, getRandom, isDarkMode } from './utils';

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

const colors = {
	'dark': {
		'background': 'black',
		'foreground': 'snow',
		'stroke': 'snow',
		'highlight': 'rgb(69,69,21)',
		'input': 'rgb(232,163,60)'
	},
	'light': {
		'background': 'white',
		'foreground': 'black',
		'stroke': 'black',
		'highlight': 'rgb(255,255,0)',
		'input': 'rgb(148,0,211)'
	}
};

const getColor = (key) => colors[isDarkMode() ? 'dark' : 'light'][key];

const mode = 'play'; // 'allbutone', 'answers', 'play'
const target = 'last'; // 'last', 'random'

export class Sudoku {
	constructor(type, difficulty, solvedHandler, saved) {

		let sudoku = null;

		switch(type) {
			case 'standard':
				
				sudoku = saved ? saved : getSudoku(difficulty);

				this.overlay = standardOverlay;
				this.numbers = sudoku.solution.split('').map((item) => {
					return parseFloat(item);
				});
				this.clues = sudoku.puzzle.split('').map((item) => {
					return item==='-' ? 0 : parseFloat(item);
				});
				this.difficulty = sudoku.difficulty;

			break;
			case 'jigsaw':

				if(target==='last') {
					sudoku = saved ? saved : puzzles[difficulty][puzzles[difficulty].length-1];
				}
				else {
					sudoku = saved ? saved : getRandom(puzzles[difficulty]);
				};

				this.overlay = sudoku[0];
				this.numbers = sudoku[1];
				this.clues = sudoku[2];
				this.difficulty = sudoku[3];

			break;
		};

		switch(mode) {
			case 'allbutone':
				this.clues = [0];
			break;
			case 'answers':
				this.clues = [];
			break;
		};

		this.data = sudoku;
    this.tiles = tileMap.map((data) => {
      return new PuzzleTile(data[0], data[1], this.numbers[data[2]], this.clues[data[2]]);
    });
    this.type = type;
		
    this.solvedHandler = solvedHandler;

    // console.log(this);

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

			ctx.fillStyle = tile.highlight ? getColor('highlight') : getColor('background');
			
			ctx.fillRect(
				(tile.x * size) + offset, 
				(tile.y * size) + offset, 
				size, 
				size
			);

			ctx.font = `900 ${size-10}px Poppins`;
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			ctx.fillStyle = tile.clue ? getColor('foreground') : getColor('input');
			
			ctx.fillText(
				tile.display===0?'':tile.display, 
				(tile.x * size) + (size/2) + offset, 
				(tile.y * size) + ((size/2)+inflate(1)) + offset
			);

		});

		this.overlay.forEach((coords) => {
			coords.forEach((bob, index) => {
				ctx.lineWidth = inflate(3);
				ctx.lineCap = 'square';
				ctx.strokeStyle = getColor('stroke');
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
			ctx.lineWidth = inflate(1);
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
			ctx.lineWidth = inflate(1);
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
	getSaveObject() {
		return this.data;
	};
	activeX = 0;
	activeY = 0;
};

class PuzzleTile {
	constructor(x, y, value = 0, clue = 1) {

		this.name = `x${x}y${y}`;
		this.value = value;
		this.clue = clue;
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
};
