/* eslint-disable linebreak-style */
import Character from './Character';

export default class Daemon extends Character {
  constructor(level) {
    super(level, 'daemon');
    this.level = level;
    this.attack = 10;
    this.defence = 40;
    this.attackDistance = 4;
    this.distance = 1;
  }
}
