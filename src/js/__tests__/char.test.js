/* eslint-disable linebreak-style */
import {
  Bowman,
  Swordsman,
} from '../Character';

const rightObj = {
  level: 1,
  attack: 25,
  defence: 25,
  health: 50,
  type: 'bowman',
};
test('test err call char', () => {
  expect(() => new Character()).toThrowError();
});

test('test call extends class Character', () => {
  const result = new Bowman(1);
  expect(result).toEqual(rightObj);
});
