/* eslint-disable linebreak-style */
import Character from './Character';

export default class Magician extends Character {
  constructor(level) {
    super(level, 'magician');
    this.level = level;
    this.attack = 10;
    this.defence = 40;
    this.attackDistance = 4;
    this.distance = 1;
  }
}
