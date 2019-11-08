/* eslint-disable no-param-reassign */
/* eslint-disable no-undef */
const TYPES_POWER_UPS = [
  { type: 'BALL_SLOW', color: 'red' },
  { type: 'PADDLE_BIGGER', color: 'blue' },
  { type: 'LIFE', color: 'green' },
];

const links = [
  { link: './breakout/img/peer.png', w: 47.5, h: 80 },
  { link: './breakout/img/melon.png', w: 68.5, h: 66 },
  { link: './breakout/img/orange.png', w: 68.5, h: 66 },
  { link: './breakout/img/platano.png', w: 68.5, h: 66 },
];

const { GameObject, Game, Input, Utils, root, Store, Sound } = GameEngine;
class PowerUp extends GameObject {
  constructor(width, height, lengthSpriteSheet, config, x = 0, y = 0, deg = 0) {
    const typePower = Math.floor(Math.random() * 3);
    const type = TYPES_POWER_UPS[typePower];
    config.backgroundColor = '';
    config.spriteSource = links[typePower].link;
    width = links[typePower].w;
    height = links[typePower].h;
    config.collider = true;
    super(width, height, 0, config, x, y, deg);
    this.type = type;
  }

  update() {
    this.position(0, -40 * this.deltaTime);
    if (this.y > window.innerHeight) {
      this.destroy();
    }
  }
}
