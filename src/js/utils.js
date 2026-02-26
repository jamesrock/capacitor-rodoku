import { Storage, Scaler } from '@jamesrock/rockjs';

export const scaler = new Scaler(window.devicePixelRatio||1);
export const storage = new Storage('me.jamesrock.rodoku');

export const getDefaultTime = () => (1000 * 60 * 60);
