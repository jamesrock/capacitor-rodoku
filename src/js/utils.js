export const createNode = (type, className) => {
  const node = document.createElement(type);
  node.classList.add(className);
  return node;
};

export const shuffle = (cards) => {
  for (let i = 0; i < cards.length; i++) {
    let shuffle = Math.floor(Math.random() * (cards.length));
    [cards[i], cards[shuffle]] = [cards[shuffle], cards[i]];
  };
  return cards;
};

const timeToMinutes = (time) => Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
const timeToSeconds = (time) => Math.floor((time % (1000 * 60)) / 1000);
const pad = (time) => time.toString().padStart(2, '0');
export const timeToDisplay = (time) => `${pad(timeToMinutes(time))}:${pad(timeToSeconds(time))}`;
export const isValidKey = (key, options) => (options.includes(key));