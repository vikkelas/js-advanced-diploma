/* eslint-disable linebreak-style */
import Character from './Character';

export default class Vampire extends Character {
  constructor(level) {
    super(level, 'vampire');
    this.level = level;
    this.attack = 25;
    this.defence = 25;
    this.attackDistance = 2;
    this.distance = 2;
  }
}
