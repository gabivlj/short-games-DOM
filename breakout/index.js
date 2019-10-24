/* eslint-disable no-undef */
const { GameObject, Game, Input } = GameEngine;

class Brick extends GameObject {}

const ratio = window.innerHeight / window.innerWidth;

const configMap = {
  0: {
    brickWidth: 50 / ratio,
    brickHeight: 20 / ratio,
    nBricksX: 10,
    nBricksY: 6,
    offsetX: 100 / ratio,
    offsetY: 50 / ratio,
    marginTop: 50 / ratio,
    marginLeft: 50 / ratio,
    getColor: () => 'red',
  },
  1: {
    brickWidth: 50 / ratio,
    brickHeight: 20 / ratio,
    nBricksX: 13,
    nBricksY: 6,
    offsetX: 80 / ratio,
    offsetY: 50 / ratio,
    marginTop: 50 / ratio,
    marginLeft: 50 / ratio,
    getColor: () => 'blue',
  },
};

function createMap(configurations) {
  const game0 = new Game();
  const bricks = [];
  const {
    nBricksX,
    nBricksY,
    offsetX,
    offsetY,
    brickHeight,
    brickWidth,
    marginTop,
    marginLeft,
    getColor,
  } = configurations;
  for (let i = 0; i < nBricksX; i++) {
    for (let j = 0; j < nBricksY; j++) {
      bricks.push(
        Brick.createBrick({
          y: offsetY * j + 10 + marginTop,
          x: offsetX * i + 10 + marginLeft,
          height: brickHeight,
          width: brickWidth,
          color: getColor(),
        }),
      );
    }
  }
  game0.reserve(...bricks);
  return game0;
}

Brick.createBrick = ({ height, width, color, x, y }) => {
  return new Brick(
    width,
    height,
    0,
    { backgroundColor: color, reserved: true, reset: true },
    x,
    y,
  );
};

const game0 = createMap(configMap[0]);
const game1 = createMap(configMap[1]);
game0.start();
setInterval(() => {
  if (game0.running) {
    game0.stop();
    game1.start();
  } else {
    game1.stop();
    game0.start();
  }
}, 1000);

const maps = [];
