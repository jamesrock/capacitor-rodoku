import { inflate } from './utils';

export class Renderer {
  constructor(width, height, puzzle, target) {

    // console.log('new Renderer()', this);

    this.offset = inflate(3/2);
    this.width = width;
    this.height = height;
    this.puzzle = puzzle;
    this.target = target;

    this.node = document.createElement('canvas');
    this.context = this.node.getContext(this.type);

    this.node.style.width = `${this.width + this.offset}px`;
    this.node.style.height = `${this.height + this.offset}px`;

  };
  render() {

    this.node.width = inflate(this.width + this.offset);
    this.node.height = inflate(this.height + this.offset);

    this.puzzle.render(this.context, this);

    this.frame = requestAnimationFrame(() => {
      this.render();
    });
    return this;

  };
  appendTo(target) {

    target.append(this.node);
    return this;

  };
  appendToTarget() {
    
    document.querySelector(this.target).append(this.node);
    return this;

  };
  stop() {

    cancelAnimationFrame(this.frame);
    return this;

  };
  pause() {

    this.paused = !this.paused;
    return this;

  };
  destroy() {

    this.stop();
    this.node.parentNode.removeChild(this.node);
    return this;

  };
  type = '2d';
  frame = 0;
  paused = false;
};
