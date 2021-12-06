import themes from './themes';
import Team from './Team';
import CompTeam from './CompTeam';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.playerTeam = new Team();
    this.compTeam = new CompTeam();
  }

  init() {
    this.playerTeam.creatChar();
    this.compTeam.genPosComp();
    this.gamePlay.drawUi(themes.prairie);
    this.gamePlay.redrawPositions([...this.playerTeam.positionChar, ...this.compTeam.positionComp]);
    // this.addListner();
  }

  addListner() {
    this.gamePlay.addCellEnterListener(this.onCellClick.bind(this));
  }

  onCellClick(index) {
    console.log(index);
    // TODO: react to click
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
  }
}
