import { createNode, createInput } from '@jamesrock/rockjs';
import { Storage, Scaler } from '@jamesrock/rockjs';

export const scaler = new Scaler(window.devicePixelRatio||1);
export const storage = new Storage('me.jamesrock.rodoku');

export const createRadio = (value = 0, name = '{name}', id = '{id}', checked = false) => {
  const node = createInput(value, 'radio');
  node.name = name;
  node.id = id;
  node.checked = checked;
  return node;
};

export const createLabel = (label = '{label}', id = '{id}') => {
  const node = createNode('label');
  node.innerHTML = label;
  node.setAttribute('for', id);
  return node;
};

export const createToggle = (options, id, defaultValue) => {
  const node = createNode('div', 'toggle');
  options.forEach((option) => {
    const optionNode = createNode('div', 'toggle-item');
    const radio = createRadio(option, id, `${option}-${id}`, option===defaultValue);
    const label = createLabel(option, radio.id);
    optionNode.append(radio);
    optionNode.append(label);
    node.append(optionNode);
  });
  return node;
};
