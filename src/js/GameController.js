/* eslint-disable linebreak-style */
import themes from './themes';
import Team from './Team';
import CompTeam from './CompTeam';
import GameState from './GameState';
import GamePlay from './GamePlay';
import {
  calcAttack,
  calcDist,
} from './utils';
import cursors from './cursors';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.playerTeam = new Team();
    this.compTeam = new CompTeam();
    this.state = new GameState('player');
    this.previousIndexChar = null;
    this.activeChar = null;
    this.activeCharPosition = null;
    this.index = null;
    this.boardSize = this.gamePlay.boardSize;
    this.arrTypeHero = ['bowman', 'swordsman', 'magician'];
    this.arrCellHero = null;
    this.distanceP = null;
    this.distanceAt = null;
  }

  init() {
    this.playerTeam.creatChar();
    this.compTeam.genPosComp();
    this.arrCellHero = [...this.playerTeam.positionChar, ...this.compTeam.positionComp];
    this.gamePlay.drawUi(themes.prairie);
    this.gamePlay.redrawPositions(this.arrCellHero);
    this.addListner();
  }

  addListner() {
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
  }

  onCellClick(index) {
    this.arrCellHero.forEach((item) => {
      const checkType = this.arrTypeHero.includes(item.character.type);
      if (item.position === index && checkType) {
        this.activeChar = item;
        this.activeCharPosition = item.position;
        if (this.previousIndexChar === null) {
          this.previousIndexChar = index;
          this.gamePlay.selectCell(index);
        } else {
          this.gamePlay.deselectCell(this.previousIndexChar);
          this.gamePlay.selectCell(index);
          this.previousIndexChar = index;
        }
      } else if (item.position === index && !checkType && this.activeChar === null) {
        GamePlay.showError('недопустимый персонаж');
      }
    });
    // создание массивов с расположением персонажей
    const posCharPlay = [];
    const posCharCom = [];
    for (let i = 0; i < this.arrCellHero.length; i += 1) {
      if (this.arrTypeHero.includes(this.arrCellHero[i].character.type)) {
        posCharPlay.push(this.arrCellHero[i].position);
      } else {
        posCharCom.push(this.arrCellHero[i].position);
      }
    }
    if (this.activeChar !== null) {
      const charDist = this.activeChar.character.distance;
      const charAttack = this.activeChar.character.attackDistance;
      this.distanceAt = calcAttack(charAttack, this.boardSize, this.activeCharPosition);
      this.distanceP = calcDist(charDist, this.boardSize, this.activeCharPosition);
      if (this.distanceP.includes(index) && !posCharCom.includes(index)) {
        const numElArr = this.playerTeam.positionChar.indexOf(this.activeChar);
        this.playerTeam.positionChar[numElArr].position = index;
        this.arrCellHero = [...this.playerTeam.positionChar, ...this.compTeam.positionComp];
        this.gamePlay.redrawPositions(this.arrCellHero);
        this.gamePlay.deselectCell(this.previousIndexChar);
        this.onCellLeave(index);
        this.distanceP = null;
        this.distanceAt = null;
        this.activeChar = null;
        this.state.activePlayer = 'comp';
      }
    }
  }

  onCellEnter(index) {
    const posCharPlay = [];
    const posCharCom = [];
    for (let i = 0; i < this.arrCellHero.length; i += 1) {
      if (this.arrTypeHero.includes(this.arrCellHero[i].character.type)) {
        posCharPlay.push(this.arrCellHero[i].position);
      } else {
        posCharCom.push(this.arrCellHero[i].position);
      }
    }
    this.arrCellHero.forEach((item) => {
      const checkIndexPlayer = posCharPlay.includes(index);
      const chaeckIndexComp = posCharCom.includes(index);
      let checkIndDist = null;
      if (this.distanceP !== null) {
        checkIndDist = this.distanceP.includes(index);
      }
      let checkIndAtack = null;
      if (this.distanceAt !== null) {
        checkIndAtack = this.distanceAt.includes(index);
      }
      if (item.position === index) {
        const heroInfo = item.character;
        const messageInfo = `🎖 ${heroInfo.level} \u2694${heroInfo.attack} 🛡${heroInfo.defence} \u2764${heroInfo.health}`;
        this.gamePlay.showCellTooltip(messageInfo, index);
      }
      if (this.activeCharPosition === null && checkIndexPlayer) {
        this.gamePlay.setCursor(cursors.pointer);
      }
      if ((checkIndexPlayer && index !== this.activeCharPosition) || checkIndDist) {
        this.gamePlay.setCursor(cursors.pointer);
      }
      if (!checkIndexPlayer && !chaeckIndexComp && checkIndDist) {
        this.gamePlay.selectCell(index, 'green');
      }
      if (chaeckIndexComp && checkIndAtack) {
        this.gamePlay.setCursor(cursors.crosshair);
        this.gamePlay.selectCell(index, 'red');
      }
      // if (!checkIndexPlayer && !checkIndDist && !checkIndAtack) {
      //   this.gamePlay.setCursor(cursors.notallowed);
      // }
    });
  }

  onCellLeave(index) {
    this.gamePlay.hideCellTooltip(index);
    this.gamePlay.setCursor(cursors.auto);
    if (index !== this.activeCharPosition) {
      this.gamePlay.deselectCell(index);
    }
  }
}
