/* eslint-disable linebreak-style */
import Character from './Character';

export default class Undead extends Character {
  constructor(level) {
    super(level, 'undead');
    this.level = level;
    this.attack = 40;
    this.defence = 10;
  }
}
