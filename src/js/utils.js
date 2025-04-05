export const createNode = (type, className) => {
  const node = document.createElement(type);
  node.classList.add(className);
  return node;
};