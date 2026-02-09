import { Storage } from '@jamesrock/rockjs';
const pixelRatio = window.devicePixelRatio||1;
export const inflate = (value) => {
	return value*pixelRatio;
};
export const deflate = (value) => {
	return value/pixelRatio;
};
export const storage = new Storage('me.jamesrock.rodoku');