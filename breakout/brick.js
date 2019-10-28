const { GameObject, Game, Input, Utils, root } = GameEngine;

class Brick extends GameObject {
  constructor(width, height, lengthSpriteSheet, config, x = 0, y = 0, deg = 0) {
    super(width, height, lengthSpriteSheet, config, x, y, deg);
    this.destroyThis = Math.random() * 2;
  }

  collided() {
    Game.__essentialVariableToKeepTrackOfTheGreatGamesYoureCreatingMyDude.destroy(
      this,
    );
  }

  startAfterFirstRender() {
    if (this.destroyThis > 1) this.collided();
  }
}

Brick.createBrick = ({ height, width, color, x, y }) => {
  return new Brick(
    width,
    height,
    0,
    { backgroundColor: color, reserved: true, reset: true, collider: true },
    x,
    y,
  );
};
