/* eslint-disable linebreak-style */
import themes from './themes';
import Team from './Team';
import CompTeam from './CompTeam';
import GameState from './GameState';
import GamePlay from './GamePlay';
import {
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
      if (item.position === index && this.arrTypeHero.includes(item.character.type)) {
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
      } else if (item.position === index && !this.arrTypeHero.includes(item.character.type)) {
        GamePlay.showError('недопустимый персонаж');
      }
    });
    this.distanceP = calcDist(this.activeChar.character.distance, this.boardSize, this.activeCharPosition);
    if (this.distanceP.includes(index)) {
      const numElArr = this.playerTeam.positionChar.indexOf(this.activeChar);
      this.playerTeam.positionChar[numElArr].position = index;
      this.arrCellHero = [...this.playerTeam.positionChar, ...this.compTeam.positionComp];
      this.gamePlay.redrawPositions(this.arrCellHero);
      this.gamePlay.deselectCell(this.previousIndexChar);
      this.distanceP = null;
      this.state.activePlayer = 'comp';
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
      const checkIndDist = this.distanceP.includes(index);
      if (item.position === index) {
        const heroInfo = item.character;
        const messageInfo = `🎖 ${heroInfo.level} \u2694${heroInfo.attack} 🛡${heroInfo.defence} \u2764${heroInfo.health}`;
        this.gamePlay.showCellTooltip(messageInfo, index);
      }
      if ((checkIndexPlayer && index !== this.activeCharPosition) || checkIndDist) {
        this.gamePlay.setCursor(cursors.pointer);
      }
      if (!checkIndexPlayer && checkIndDist) {
        this.gamePlay.selectCell(index, 'green');
      }
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
