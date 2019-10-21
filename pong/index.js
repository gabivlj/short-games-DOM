// ESLINT MUTING
/* eslint-disable no-new */
/* eslint-disable no-undef */

/**
 * @author Gabriel Villalonga Simón
 * @project Pong Game
 * @dependencies ../engine/index.js
 * @definitions GameObject and Game
 */

const { Game, Input, GameObject } = GameEngine;

const STATE_MACHINE = {
  WALKING: 0,
};

class Wall extends GameObject {
  start() {
    console.log('Mmmm');
  }
}
// NOT IMPLEMENTED.
class Ball extends GameObject {}
/**
 * @param {{ w: Number, h: Number, x: Number, y: Number}} configuration,
 * @description Creates a new wall.
 */
const createWall = ({ w, h, x, y }) => {
  return new Wall(
    w,
    h,
    1,
    {
      backgroundColor: 'red',
    },
    x,
    y,
  );
};

class Paddle extends GameObject {
  constructor(
    width,
    height,
    lengthSpriteSheet,
    configuration = {},
    x = 0,
    y = 0,
    speed,
    player = 0,
  ) {
    super(width, height, lengthSpriteSheet, configuration, x, y);
    this.speed = speed;
    this.faceX = 0;
    this.STATE = STATE_MACHINE.WALKING;
    this.faceY = 0;
    this.player = player;
  }

  changeSpriteWalking() {
    const { currentSpriteIndex } = this;
    const y = 1;
    // if idle.
    if (this.faceX === 0 && this.faceY === 0) {
      return;
    }
    // Reset X index
    if (currentSpriteIndex[0] >= this.lengthSpriteSheet - 1) {
      currentSpriteIndex[0] = 0;
    }
    // if moving right
    if (this.faceX >= 1) {
      currentSpriteIndex[y] = 3;
      // if moving left
    } else if (this.faceX < 0) {
      currentSpriteIndex[y] = 1;
      // if moving top
    } else if (this.faceY > 0) {
      currentSpriteIndex[y] = 0;
      // if moving down
    } else {
      currentSpriteIndex[y] = 2;
    }
  }

  start() {
    // this.sprite.style.backgroundColor = 'red';
  }

  changeSprite() {
    switch (this.STATE) {
      case STATE_MACHINE.WALKING:
        this.changeSpriteWalking();
        break;
      default:
        return;
    }
    this.setSpriteIndex(
      this.currentSpriteIndex[0] + 1,
      this.currentSpriteIndex[1],
    );
  }

  update() {
    this.position(
      this.speed * this.faceX * this.deltaTime,
      this.speed * this.faceY * this.deltaTime,
    );
  }

  playerInput() {
    if (this.player) {
      return Input.getInputs('UP', 'RIGHT', 'DOWN', 'LEFT', 'E');
    }
    return Input.getInputs('W', 'D', 'S', 'A', 'E');
  }

  lateUpdate() {
    const [top, right, bot, left, rotate] = this.playerInput();
    this.faceX = right - left;
    this.faceY = top - bot;
    this.degrees += rotate;
  }
}

// Circlee
const ball = new Ball(
  16,
  16,
  0,
  {
    backgroundColor: 'red',
    borderRadius: '50%',
  },
  window.innerWidth / 2,
  window.innerHeight / 2,
);

const palaFirst = new Paddle(
  30, // w
  300, // h
  0, // spriteLength none
  {
    backgroundColor: 'grey',
  },
  300,
  300,
  30, // speed
  0,
);

const palaSecond = new Paddle(
  30, // w
  300, // h
  0, // spriteLength none
  {
    backgroundColor: 'grey',
  },
  window.innerWidth - 300, // x
  window.innerHeight - 500, // y
  30, // speed
  1,
);

const wallTop = createWall({ w: window.innerWidth + 30, h: 100, x: 1, y: 1 });
const wallLeft = createWall({ w: 100, h: window.innerHeight + 30, x: 1, y: 1 });
const wallRight = createWall({
  w: 100,
  h: window.innerHeight,
  x: window.innerWidth - 100,
  y: 1,
});
const wallBot = createWall({
  w: window.innerWidth,
  h: 100,
  x: 0,
  y: window.innerHeight - 100,
});

const game = new Game();
game.start();
/**
 * SHOWING OFF THAT YOU CAN RESET THE GAME.
 */
// setInterval(() => {
//   game.stop();
//   new Paddle(
//     30, // w
//     300, // h
//     0, // spriteLength none
//     {
//       backgroundColor: 'grey',
//     },
//     window.innerWidth - 300, // x
//     window.innerHeight - 500, // y
//     30, // speed
//     1,
//   );
//   console.log(Game.__GAME_OBJECTS);
//   game.start();
// }, 1000);
