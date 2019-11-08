/* eslint-disable no-undef */
/* eslint-disable no-param-reassign */
// eslint-disable-next-line no-undef
class Score extends GameObject {
  constructor(
    width,
    height,
    lengthSpriteSheet,
    config,
    x = 0,
    y = 0,
    deg = 0,
    speed,
    ballRef,
    game,
    bricks,
    index,
  ) {
    super(width, height, lengthSpriteSheet, config, x, y, deg, speed);
    this.ballRef = ballRef;
    this.text = this.ballRef.lifes;
    this.game = game;
    this.bricks = bricks;
    this.bricksLength = Infinity;
    this.index = index;
  }

  startAfterFirstRender() {
    this.bricksLength = this.bricks.reduce(
      (prev, now) => (now.destroyed ? prev : prev + 1),
      0,
    );
  }

  lateUpdate() {
    this.text = `Lifes: ${this.ballRef.lifes}\n Score: ${this.ballRef.score}`;
    if (!this.ballRef.lifes && this.game.running) {
      const scores = Store.getItem('scores') || {};
      scores[this.index] = Math.max(
        scores[this.index] || 0,
        this.ballRef.score,
      );
      Store.addItem('scores', scores);
      this.game.pause({ puntuation: this.ballRef.score, reason: 'LOST' });
    } else if (this.bricksLength <= this.ballRef.score / 100) {
      this.game.pause({ puntuation: this.ballRef.score, reason: 'WON' });
      const scores = Store.getItem('scores') || {};
      scores[this.index] = Math.max(
        scores[this.index] || 0,
        this.ballRef.score,
      );
      Store.addItem('scores', scores);
    }
  }
}
