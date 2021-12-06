import {
  generateTeam,
  positionGenerator,
} from './generators';
import Bowman from './Bowman';
import Swordsman from './Swordsman';
// import Magician from "./Magician"
import GamePlay from './GamePlay';
import PositionedCharacter from './PositionedCharacter';

export default class Team {
  constructor() {
    this.positionChar = [];
    this.startLine = [0, 1];
    this.allowedTypes = [Bowman, Swordsman];
    this.bordsize = new GamePlay();
  }

  // создание массива для отрисовки персонажей(игрок: человек)
  creatChar() {
    const arrGenTeam = generateTeam(this.allowedTypes, 1, 2);
    const positionLine = positionGenerator(this.startLine, this.bordsize.boardSize);
    for (const item of arrGenTeam) {
      this.positionChar.push(new PositionedCharacter(item, positionLine.next().value));
    }
    console.log(this.positionChar);
    return this.positionChar;
  }
}
