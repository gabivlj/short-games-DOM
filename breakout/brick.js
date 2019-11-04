/* eslint-disable no-undef */

class Brick extends GameObject {
  constructor(
    width,
    height,
    lengthSpriteSheet,
    config,
    x = 0,
    y = 0,
    deg = 0,
    probabilityToAppear = 0.5,
  ) {
    super(width, height, lengthSpriteSheet, config, x, y, deg);
    this.probs = probabilityToAppear * 2;
    this.destroyThis = Math.random() * 2;
    this.destroyed = false;
  }

  collided(powerUpSpawn = true) {
    if (powerUpSpawn && Math.random() > 0.5) {
      const _ = new PowerUp(
        100,
        30,
        0,
        { backgroundColor: 'red' },
        this.x,
        this.y,
      );
    }
    this.destroyed = true;
    Game.__essentialVariableToKeepTrackOfTheGreatGamesYoureCreatingMyDude.destroy(
      this,
    );
  }

  start() {
    if (this.probs <= this.destroyThis) this.collided(false);
  }
}

Brick.createBrick = ({ height, width, color, x, y, probabilityToAppear }) => {
  return new Brick(
    width,
    height,
    0,
    {
      backgroundColor: color,
      reserved: true,
      reset: true,
      collider: true,
      borderRadius: '6.5%',
      useUpdate: false,
    },
    x,
    y,
    0,
    probabilityToAppear,
  );
};
