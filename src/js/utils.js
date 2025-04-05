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