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
class Ball extends GameObject {
  constructor(
    width,
    height,
    l,
    configuration,
    x,
    y,
    speed = 3,
    instanceIDPlayer1,
    instanceIDPlayer2,
  ) {
    super(width, height, l, configuration, x, y);
    this.speed = speed;
    this.signX = 1;
    this.signY = 1;
    this.puntuationPlayer1 = 0;
    this.puntuationPlayer2 = 0;
    this.instanceIDPlayer1 = instanceIDPlayer1;
    this.instanceIDPlayer2 = instanceIDPlayer2;
  }

  start() {}

  collisionBall() {
    const col = this.detectCollision();

    if (!col) return;
    if (col.conditions.bot) {
      this.signY = -1;
    } else if (col.conditions.top) {
      this.signY = 1;
    } else if (col.conditions.right) {
      this.signX = 1;
    } else this.signX = -1;
  }

  update() {
    this.collisionBall();
    this.position(
      this.speed * this.signX * this.deltaTime,
      this.speed * this.signY * this.deltaTime,
    );
  }
}
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
      reserved: true,
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
    this.beforePos = { x: 0, y: 0 };
    this.count = 0;
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
    const col = this.detectCollision();
    if (this.count < 4) console.log(col);
    this.count++;
    if (col && this.beforePos.x !== 0) {
      this.setPosition(this.beforePos.x, this.beforePos.y);
      return;
    }
    this.beforePos = { x: this.x, y: this.y };
    this.position(
      this.speed * this.faceX * this.deltaTime,
      this.speed * this.faceY * this.deltaTime,
    );
  }

  playerInput() {
    if (this.player) {
      return Input.getInputs('UP', 'RIGHT', 'DOWN', 'LEFT');
    }
    return Input.getInputs('W', 'D', 'S', 'A');
  }

  lateUpdate() {
    const [top, right, bot, left] = this.playerInput();
    this.faceX = right - left;
    this.faceY = top - bot;
  }
}

const palaFirst = new Paddle(
  30, // w
  300, // h
  0, // spriteLength none
  {
    backgroundColor: 'grey',
    reserved: true,
  },
  300,
  300,
  60, // speed
  0,
);

const palaSecond = new Paddle(
  30, // w
  300, // h
  0, // spriteLength none
  {
    backgroundColor: 'grey',
    reserved: true,
  },
  window.innerWidth - 300, // x
  window.innerHeight - 500, // y
  60, // speed
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

// Circlee
const ball = new Ball(
  16,
  16,
  0,
  {
    backgroundColor: 'red',
    borderRadius: '50%',
    reserved: true,
  },
  window.innerWidth / 2,
  window.innerHeight / 2,
  100,
  wallLeft.x + wallLeft.width,
  window.innerWidth - wallRight.width,
  wallTop.y + wallTop.height,
  window.innerHeight - wallBot.height,
  palaFirst.instanceID,
  palaSecond.instanceID,
);

const game = new Game();
game.reserve(
  palaFirst,
  palaSecond,
  wallBot,
  wallTop,
  wallLeft,
  wallRight,
  ball,
);
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
