/* eslint-disable max-classes-per-file */
export default class Character {
  constructor(level, type = 'generic') {
    if (new.target && new.target.name === 'Character') {
      throw new Error('no use call Characters');
    }
    this.level = level;
    this.attack = 0;
    this.defence = 0;
    this.health = 100;
    this.type = type;
  }
}
