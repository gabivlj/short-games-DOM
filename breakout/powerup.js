/* eslint-disable no-param-reassign */
/* eslint-disable no-undef */
const TYPES_POWER_UPS = [
  { type: 'BALL_SLOW', color: 'red' },
  { type: 'PADDLE_BIGGER', color: 'blue' },
  { type: 'LIFE', color: 'green' },
];
const { GameObject, Game, Input, Utils, root, Store } = GameEngine;
class PowerUp extends GameObject {
  constructor(width, height, lengthSpriteSheet, config, x = 0, y = 0, deg = 0) {
    const type = TYPES_POWER_UPS[Math.floor(Math.random() * 3)];
    config.backgroundColor = type.color;
    config.collider = true;
    super(width, height, 1, config, x, y, deg);
    this.type = type;
  }

  update() {
    this.position(0, -40 * this.deltaTime);
  }
}
