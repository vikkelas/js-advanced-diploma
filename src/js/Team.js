/* eslint-disable linebreak-style */
import {
  generateTeam,
  positionGenerator,
} from './generators';
import Bowman from './Bowman';
import Swordsman from './Swordsman';
import Magician from './Magician';
// import Magician from "./Magician"
import GamePlay from './GamePlay';
import PositionedCharacter from './PositionedCharacter';

export default class Team {
  constructor() {
    this.positionChar = [];
    this.startLine = [0, 1];
    this.firstTypes = [Bowman, Swordsman];
    this.allTypes = [Bowman, Swordsman, Magician];
    this.bordsize = new GamePlay();
  }

  // создание массива для отрисовки персонажей(игрок: человек)
  creatChar(maxLevel, amt, type = this.firstTypes) {
    const arrGenTeam = generateTeam(type, maxLevel, amt);
    const positionLine = positionGenerator(this.startLine, this.bordsize.boardSize);
    for (const item of arrGenTeam) {
      this.positionChar.push(new PositionedCharacter(item, positionLine.next().value));
    }
    return this.positionChar;
  }
}
