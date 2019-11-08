/* eslint-disable no-param-reassign */
/* eslint-disable no-use-before-define */
/* eslint-disable prefer-const */
/* eslint-disable no-undef */

const SCREEN_RESOLUTION = {
  x: 1900,
  y: 1000,
};
const ratio = 1920 / (window.innerHeight + window.innerWidth);

const rX = n => (window.innerWidth / 1000) * n;
const rY = n => (window.innerHeight / 1000) * n;

const r = n => n / ratio;

function createMap(configurations, callback, index) {
  const game0 = new Game(
    SCREEN_RESOLUTION,
    { EXIT: callback },
    { backgroundColor: '#2f215c' },
  );
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
    ballColor,
    paddleColor,
    brickColor,
    wallsColor,
    probabilityToAppear,
    randomnessY = [1, 1],
  } = configurations;
  for (let i = 0; i < nBricksX; i += 1) {
    for (let j = 0; j < nBricksY; j += 1) {
      bricks.push(
        Brick.createBrick({
          y:
            offsetY * j +
            Utils.Clamp(Math.random() * 10, randomnessY[0], randomnessY[1]) +
            10 +
            marginTop,
          x: offsetX * i + 10 + marginLeft,
          height: brickHeight,
          width: brickWidth,
          color: brickColor(),
          probabilityToAppear,
        }),
      );
    }
  }

  const ball = new Ball(
    16,
    16,
    0,
    {
      backgroundColor: '#89BD9E',
      borderRadius: '50%',
      reserved: true,
      reset: true,
    },
    800,
    900,
    130,
  );

  const paddle = new Paddle(
    300, // width
    20, // height
    0, // lengthOfSpriteSheet (0 because there is not a spritesheet).
    // Config object.
    {
      backgroundColor: '#442B48',
      borderRadius: '2%',
      // Reserve the game in the scene.
      reserved: true,
      // Reset the object when there is a scene change.
      reset: true,
      // OptimizedColliders so the engine does not check all of the bricks every tick
      optimizedColliders: [Ball, Wall, PowerUp],
    },
    // X Position
    880,
    // Y Position
    900,
    // Degrees.
    0,
    // Speed
    100,
    // Ball reference.
    ball,
    // Index
    index,
  );

  ball.backgroundColor = ballColor;
  paddle.backgroundColor = paddleColor;

  game0.reserve(
    ...bricks,
    ...Wall.generate(SCREEN_RESOLUTION.x, SCREEN_RESOLUTION.y, wallsColor),
    ball,
    paddle,
    new Score(
      10000,
      100,
      0,
      {
        text: '',
        color: 'white',
        backgroundColor: '',
        fontSize: '20',
        reserved: true,
        reset: true,
      },
      70,
      10,
      0,
      0,
      ball,
      game0,
      bricks,
      index,
    ),
  );
  return game0;
}

const GAME_STATES = {
  PLAYING: 0,
  PAUSE: 1,
  MENU: 2,
  EXIT_GAME: 3,
};

let CURRENT_GAME = 0;
let CURRENT_GAME_STATE = GAME_STATES.MENU;

let games = [];

function initGame() {
  Object.keys(configMap).forEach((key, index) => {
    games.push(
      createMap(
        configMap[key],
        // OnPress E.
        () => {
          CURRENT_GAME_STATE = GAME_STATES.EXIT_GAME;
          process();
        },
        index,
      ),
    );
  });

  // Show on lose
  games.forEach(game => {
    game.onPause = pauseInformation => {
      showModal(pauseInformation.puntuation, () => {
        CURRENT_GAME_STATE = GAME_STATES.EXIT_GAME;
        process();
      });
    };
  });
}

function reset(resetMaps = false) {
  games = [];
  if (resetMaps) {
    Store.addItem('maps', []);
    Store.addItem('scores', {});
    updateConfigMaps();
  }
  console.log(configMap);
  initGame();
  display();
}

initGame();

function process() {
  switch (CURRENT_GAME_STATE) {
    case GAME_STATES.MENU:
      break;
    case GAME_STATES.PAUSE:
      break;
    case GAME_STATES.PLAYING:
      games[CURRENT_GAME].start();

      break;
    case GAME_STATES.EXIT_GAME:
      games[CURRENT_GAME].stop();
      CURRENT_GAME_STATE = GAME_STATES.MENU;
      process();
      break;
    default:
      throw new Error('Not implemented');
  }
}
