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
  ) {
    super(width, height, lengthSpriteSheet, config, x, y, deg, speed);
    this.ballRef = ballRef;
    this.text = this.ballRef.lifes;
    this.game = game;
    this.bricks = bricks;
    this.bricksLength = Infinity;
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
      this.game.pause({ puntuation: this.ballRef.score, reason: 'LOST' });
    } else if (this.bricksLength <= this.ballRef.score / 100) {
      this.game.pause({ puntuation: this.ballRef.score, reason: 'WON' });
    }
  }
}
