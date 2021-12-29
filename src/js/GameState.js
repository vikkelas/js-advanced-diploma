export default class GameState {
  constructor(firstPlayer) {
    this.activePlayer = firstPlayer;
    this.scores = 0;
  }

  static from(object) {
    return null;
  }
}
