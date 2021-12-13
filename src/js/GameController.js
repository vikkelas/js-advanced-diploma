import themes from './themes';
import Team from './Team';
import CompTeam from './CompTeam';
import GameState from './GameState';
import GamePlay from './GamePlay';
import utils from './utils';
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
  }

  init() {
    this.playerTeam.creatChar();
    this.compTeam.genPosComp();
    this.gamePlay.drawUi(themes.prairie);
    this.gamePlay.redrawPositions([...this.playerTeam.positionChar, ...this.compTeam.positionComp]);
    this.addListner();
  }

  addListner() {
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
  }

  onCellClick(index) {
    const arrCellHero = [...this.playerTeam.positionChar, ...this.compTeam.positionComp];
    const arrTypeHero = ['bowman', 'swordsman', 'magician'];
    arrCellHero.forEach((item) => {
      if (item.position === index && arrTypeHero.includes(item.character.type)) {
        this.activeChar = item.character;
        if (this.previousIndexChar === null) {
          this.previousIndexChar = index;
          this.gamePlay.selectCell(index);
        } else {
          this.gamePlay.deselectCell(this.previousIndexChar);
          this.gamePlay.selectCell(index);
          this.previousIndexChar = index;
        }
      } else if (item.position === index && !arrTypeHero.includes(item.character.type)) {
        GamePlay.showError('недопустимый персонаж');
      }
    });
  }

  onCellEnter(index) {
    const arrCellHero = [...this.playerTeam.positionChar, ...this.compTeam.positionComp];
    arrCellHero.forEach((item) => {
      if (item.position === index) {
        const heroInfo = item.character;
        const messageInfo = `🎖 ${heroInfo.level} \u2694${heroInfo.attack} 🛡${heroInfo.defence} \u2764${heroInfo.health}`;
        this.gamePlay.showCellTooltip(messageInfo, index);
      }
    });
    if (this.activeChar !== null) {
      const charDist = this.activeChar.distance;

    }
  }

  onCellLeave(index) {
    this.gamePlay.hideCellTooltip(index);
  }
}
