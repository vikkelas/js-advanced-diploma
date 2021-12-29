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
import {
  positionGenerator,
} from './generators';
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
    this.state.level = themes.prairie;
    this.starLinePlay = [0, 1];
  }

  init() {
    this.playerTeam.creatChar(1, 2, undefined);
    this.compTeam.genPosComp();
    this.arrCellHero = [...this.playerTeam.positionChar, ...this.compTeam.positionComp];
    this.gamePlay.drawUi(this.state.level);
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
    const posCharCom = [];
    for (let i = 0; i < this.arrCellHero.length; i += 1) {
      if (!this.arrTypeHero.includes(this.arrCellHero[i].character.type)) {
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
        this.discharge(index);
        this.computerLogic();
      }
      if (posCharCom.includes(index) && this.distanceAt.includes(index)) {
        const attacker = this.activeChar.character.attack;
        const numElComp = this.compTeam.positionComp.findIndex((item) => item.position === index);
        const targetDef = this.compTeam.positionComp[numElComp].character.defence;
        const damage = Math.max(attacker - targetDef, attacker * 0.1);
        const healCh = this.compTeam.positionComp[numElComp].character.health - damage;
        this.gamePlay.showDamage(index, damage).then(() => {
          this.compTeam.positionComp[numElComp].character.health = healCh;
          if (this.compTeam.positionComp[numElComp].character.health < 1) {
            this.compTeam.positionComp.splice(numElComp, 1);
          }
          this.discharge(index);
          if (this.compTeam.positionComp.length !== 0) {
            this.computerLogic();
          } else {
            this.levelUp();
            const newChar = this.playerTeam.creatChar(1, 1, this.playerTeam.allTypes);
            this.arrCellHero.push(newChar);
            this.discharge(index);
          }
        });
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
      const checkIndPlayer = posCharPlay.includes(index);
      const chaeckIndComp = posCharCom.includes(index);
      const actChar = this.activeChar !== null;
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
      if (this.activeCharPosition === null && checkIndPlayer) {
        this.gamePlay.setCursor(cursors.pointer);
      }
      if ((checkIndPlayer && index !== this.activeCharPosition) || checkIndDist) {
        this.gamePlay.setCursor(cursors.pointer);
      }
      if (!checkIndPlayer && !chaeckIndComp && checkIndDist) {
        this.gamePlay.selectCell(index, 'green');
      }
      if (chaeckIndComp && checkIndAtack) {
        this.gamePlay.setCursor(cursors.crosshair);
        this.gamePlay.selectCell(index, 'red');
      }
      if (actChar && ((chaeckIndComp && !checkIndAtack) || (!checkIndPlayer && !checkIndDist))) {
        this.gamePlay.setCursor(cursors.notallowed);
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

  discharge(index) {
    this.arrCellHero = [...this.playerTeam.positionChar, ...this.compTeam.positionComp];
    this.gamePlay.redrawPositions(this.arrCellHero);
    this.gamePlay.deselectCell(this.previousIndexChar);
    this.onCellLeave(index);
    this.distanceP = null;
    this.distanceAt = null;
    this.activeChar = null;
    this.state.activePlayer = 'comp';
  }

  dischargeComp() {
    this.arrCellHero = [...this.playerTeam.positionChar, ...this.compTeam.positionComp];
    this.gamePlay.redrawPositions(this.arrCellHero);
    this.state.activePlayer = 'player';
  }

  computerLogic() {
    const randomCharComp = Math.floor(Math.random() * this.compTeam.positionComp.length);
    const activeCompChar = this.compTeam.positionComp[randomCharComp];
    const activeCompCharPos = activeCompChar.position;
    const activeCharAttack = activeCompChar.character.attackDistance;
    const actCharDist = activeCompChar.character.distance;
    const arrAttackComp = calcAttack(activeCharAttack, this.boardSize, activeCompCharPos);
    const arrDistComp = calcDist(actCharDist, this.boardSize, activeCompCharPos);
    const arrDefHero = [];
    this.arrCellHero.forEach((item) => {
      const checkAttackInd = arrAttackComp.includes(item.position);
      const checkType = this.arrTypeHero.includes(item.character.type);
      if (checkAttackInd && checkType && item.position !== activeCompCharPos) {
        arrDefHero.push(item);
      }
    });
    // атака
    if (arrDefHero.length !== 0) {
      let indexChar;
      for (let i = 0; i < arrDefHero.length; i += 1) {
        let health = 100;
        if (arrDefHero[i].character.health < health) {
          health = arrDefHero[i].character.health;
          indexChar = i;
        } else {
          indexChar = Math.floor(Math.random() * arrDefHero.length);
        }
      }
      const attacker = activeCompChar.character.attack;
      const charAct = arrDefHero[indexChar];
      const targetDef = charAct.character.defence;
      const damage = Math.max(attacker - targetDef, attacker * 0.1);
      const arrTeam = this.playerTeam.positionChar;
      const numElPlay = arrTeam.findIndex((item) => item.position === charAct.position);
      const healthTarget = charAct.character.health - damage;
      this.gamePlay.showDamage(charAct.position, damage).then(() => {
        this.playerTeam.positionChar[numElPlay].character.health = healthTarget;
        if (this.playerTeam.positionChar[numElPlay].character.health < 1) {
          this.playerTeam.positionChar.splice(numElPlay, 1);
        }
        this.dischargeComp();
      });
    } else {
      const distGo = arrDistComp[Math.floor(Math.random() * arrDistComp.length)];
      const compTeam = this.compTeam.positionComp;
      const numEl = compTeam.findIndex((item) => item.position === activeCompCharPos);
      this.compTeam.positionComp[numEl].position = distGo;
      this.dischargeComp();
    }
  }

  levelUp() {
    for (let i = 0; i < this.playerTeam.positionChar.length; i += 1) {
      const newPosition = positionGenerator(this.starLinePlay, this.boardSize);
      const char = this.playerTeam.positionChar[i];
      const attackBe = char.character.attack;
      const defBe = char.character.defence;
      const healCh = char.character.health;
      const attackAfter = Math.max(attackBe, +(attackBe * (1.8 - (1 - healCh / 100))).toFixed());
      const defenceAfter = Math.max(defBe, +(defBe * (1.8 - (1 - healCh / 100))).toFixed());
      this.playerTeam.positionChar[i].character.attack = attackAfter;
      this.playerTeam.positionChar[i].character.defence = defenceAfter;
      this.state.scores += healCh;
      if (healCh + 80 > 100) {
        this.playerTeam.positionChar[i].character.health = 100;
      } else {
        this.playerTeam.positionChar[i].character.health += 80;
      }
      this.playerTeam.positionChar[i].character.level += 1;
      this.playerTeam.positionChar[i].position = newPosition.next().value;
    }
  }
}
