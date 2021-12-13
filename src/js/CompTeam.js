/* eslint-disable linebreak-style */
import {
  generateTeam,
  positionGenerator,
} from './generators';
import GamePlay from './GamePlay';
import Deamon from './Deamon';
import Vampire from './Vampire';
import Undead from './Undead';
import PositionedCharacter from './PositionedCharacter';

export default class CompTeam {
  constructor() {
    this.positionComp = [];
    this.startLine = [6, 7];
    this.allTypes = [Vampire, Deamon, Undead];
    this.boardSize = new GamePlay();
  }

  genPosComp() {
    const randomChar = generateTeam(this.allTypes, 1, 2);
    const randomPosition = positionGenerator(this.startLine, this.boardSize.boardSize);
    for (const item of randomChar) {
      this.positionComp.push(new PositionedCharacter(item, randomPosition.next().value));
    }
  }
}
