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
  ) {
    super(width, height, lengthSpriteSheet, config, x, y, deg, speed);
    this.ballRef = ballRef;
    this.text = this.ballRef.lifes;
  }

  lateUpdate() {
    this.text = `Current lifes: ${this.ballRef.lifes}`;
  }
}
