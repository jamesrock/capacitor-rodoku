import { getSudoku } from 'sudoku-gen';
import { puzzles } from './puzzles';
import { scaler } from './utils';
import { DisplayObject, getRandom, makeNode, isDarkMode } from '@jamesrock/rockjs';

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
		'input': 'magenta'
	}
};

const getColor = (key) => colors[isDarkMode() ? 'dark' : 'light'][key];

const mode = 'play'; // 'allbutone', 'answers', 'play'
const target = 'random'; // 'last', 'random'

export class Sudoku extends DisplayObject {
	constructor(size, type, difficulty, solvedHandler, updateHandler, saved) {

	  super();

		let sudoku = null;

		this.offset = scaler.inflate(3/2);
    this.size = scaler.inflate(size);
    this.width = this.height = (size*9);

    this.node = makeNode('canvas');
    this.ctx = this.node.getContext('2d');

    this.node.width = scaler.inflate(this.width + this.offset);
    this.node.height = scaler.inflate(this.height + this.offset);

    this.node.style.width = `${scaler.deflate(this.node.width)}px`;
    this.node.style.height = `${scaler.deflate(this.node.height)}px`;

		switch(type) {
			case 'standard':

				sudoku = saved ? saved[0] : getSudoku(difficulty);

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
					sudoku = saved ? saved[0] : puzzles[difficulty][puzzles[difficulty].length-4];
				}
				else {
					sudoku = saved ? saved[0] : getRandom(puzzles[difficulty]);
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
		this.values = saved ? saved[1] : this.numbers.map((value, index) => !!this.clues[index] ? value : 0);
    this.tiles = tileMap.map(([x, y, index]) => new PuzzleTile(this, x, y, this.numbers[index], !!this.clues[index], this.values[index], index));
    this.type = type;
    this.solvedHandler = solvedHandler;
		this.updateHandler = updateHandler;

		this.highlight();

	};
	render() {

	  this.node.width = scaler.inflate(this.width + this.offset);
    this.node.height = scaler.inflate(this.height + this.offset);

		this.ctx.fillStyle = 'grey';
		this.ctx.fillRect(
			0 + this.offset,
			0 + this.offset,
			(this.size * 9),
			(this.size * 9)
		);

		this.tiles.forEach((tile) => {

			this.ctx.fillStyle = tile.highlight ? getColor('highlight') : getColor('background');

			this.ctx.fillRect(
				(tile.x * this.size) + this.offset,
				(tile.y * this.size) + this.offset,
				this.size,
				this.size
			);

			this.ctx.font = `900 ${this.size-10}px Poppins`;
			this.ctx.textAlign = 'center';
			this.ctx.textBaseline = 'middle';
			this.ctx.fillStyle = tile.clue ? getColor('foreground') : getColor('input');

			this.ctx.fillText(
				tile.display===0?'':tile.display,
				(tile.x * this.size) + (this.size/2) + this.offset,
				(tile.y * this.size) + ((this.size/2)+scaler.inflate(1)) + this.offset
			);

		});

		this.overlay.forEach((coords) => {
			coords.forEach((bob, index) => {
				this.ctx.lineWidth = scaler.inflate(3);
				this.ctx.lineCap = 'square';
				this.ctx.strokeStyle = getColor('stroke');
				this.ctx.moveTo(
					(bob[0]*this.size) + this.offset,
					(bob[1]*this.size) + this.offset
				);
				if(coords[index+1]) {
					this.ctx.lineTo(
						(coords[index+1][0]*this.size) + this.offset,
						(coords[index+1][1]*this.size) + this.offset
					);
				}
				else {
					this.ctx.stroke();
				};
			});
		});

		[1, 2, 3, 4, 5, 6, 7, 8].forEach((x) => {
			this.ctx.lineWidth = scaler.inflate(1);
			this.ctx.lineCap = 'square';
			this.ctx.moveTo(
				(x*this.size) + this.offset,
				this.offset
			);
			this.ctx.lineTo(
				(x*this.size) + this.offset,
				(9*this.size) + this.offset
			);
			this.ctx.stroke();
		});

		[1, 2, 3, 4, 5, 6, 7, 8].forEach((y) => {
			this.ctx.lineWidth = scaler.inflate(1);
			this.ctx.lineCap = 'square';
			this.ctx.moveTo(
				this.offset,
				(y*this.size) + this.offset
			);
			this.ctx.lineTo(
				(9*this.size) + this.offset,
				(y*this.size) + this.offset
			);
			this.ctx.stroke();
		});

		this.frame = requestAnimationFrame(() => {
      this.render();
    });

	};
	getValues() {

		return this.data;

	};
	move(direction) {

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

		return this;

	};
	highlight() {

		const active = this.getActive();
		this.tiles.forEach((tile) => {
			tile.highlight = false;
		});
		active.highlight = true;
		return this;

	};
	fill() {

		const active = this.getActive();
		active.increment();
		this.checkForWin();
		return this;

	};
	checkForWin() {

		const correct = this.tiles.filter((tile) => {
			return tile.display===tile.value;
		}).length;
		console.log('correct', correct);
		this.updateHandler();
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

		return [this.data, this.values, this.type, this.difficulty];

	};
	stop() {

    cancelAnimationFrame(this.frame);
    return this;

  };
  destroy() {

    this.stop();
    this.node.parentNode.removeChild(this.node);
    return this;

  };
	activeX = 0;
	activeY = 0;
	frame = 0;
};

class PuzzleTile {
	constructor(puzzle, x, y, value = 0, clue = false, display = 0, id) {

		this.puzzle = puzzle;
		this.value = value;
		this.clue = clue;
		this.display = display;
		this.x = x;
		this.y = y;
		this.id = id;
		this.name = `x${x}y${y}`;

	};
	increment() {

		if(this.clue) {return};
		if(this.display===9) {
			this.display = 0;
		}
		else {
			this.display ++;
		};

		this.puzzle.values[this.id] = this.display;
		return this;

	};
	highlight = false;
};
