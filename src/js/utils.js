import { Storage } from './Storage';
export const createNode = (type, className) => {
  const node = document.createElement(type);
  node.classList.add(className);
  return node;
};
const timeToMinutes = (time) => Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
const timeToSeconds = (time) => Math.floor((time % (1000 * 60)) / 1000);
const pad = (time) => time.toString().padStart(2, '0');
export const timeToDisplay = (time) => `${pad(timeToMinutes(time))}:${pad(timeToSeconds(time))}`;
export const isValidKey = (key, options) => (options.includes(key));
const pixelRatio = window.devicePixelRatio||1;
export const inflate = (value) => {
	return value*pixelRatio;
};
export const deflate = (value) => {
	return value/pixelRatio;
};
export const makeEven = (value) => value % 2 === 1 ? value - 1 : value;
export const getRandomIndex = (target) => Math.floor(Math.random() * target.length);
export const getRandom = (target) => target[getRandomIndex(target)];
export const getDateString = () => new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'numeric', day: 'numeric'});
export const isDarkMode = () => window.matchMedia('(prefers-color-scheme: dark)').matches;
export const storage = new Storage('me.jamesrock.rodoku');