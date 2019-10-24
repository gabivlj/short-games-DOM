/* eslint-disable no-undef */
const SCREEN_RESOLUTION = {
	x: 1900,
	y: 1080
};
const ratio = 1920 / (window.innerHeight + window.innerWidth);

const rX = n => (window.innerWidth / 1000) * n;
const rY = n => (window.innerHeight / 1000) * n;

const r = n => n / ratio;

const configMap = {
	0: {
		brickWidth: 90,
		brickHeight: 20.5,
		nBricksX: 10,
		nBricksY: 6,
		offsetX: 150,
		offsetY: 90,
		marginTop: 50,
		marginLeft: 200,
		getColor: () => 'red'
	},
	1: {
		brickWidth: 50,
		brickHeight: 23.5,
		nBricksX: 13,
		nBricksY: 6,
		offsetX: 75,
		offsetY: 50,
		marginLeft: 45,
		marginTop: 50,
		getColor: () => 'blue'
	}
};

const paddle = new Paddle(
	300,
	20,
	0,
	{
		backgroundColor: 'grey',
		borderRadius: '2%',
		reset: true,
		reserved: true
	},
	880,
	900,
	0,
	100
);

const ball = new Ball(
	16,
	16,
	0,
	{
		backgroundColor: 'red',
		borderRadius: '50%',
		reserved: true,
		reset: true
	},
	800,
	900,
	130
);

function createMap(configurations, paddle) {
	const game0 = new Game(SCREEN_RESOLUTION);
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
		getColor
	} = configurations;
	for (let i = 0; i < nBricksX; i++) {
		for (let j = 0; j < nBricksY; j++) {
			bricks.push(
				Brick.createBrick({
					y: offsetY * j + 10 + marginTop,
					x: offsetX * i + 10 + marginLeft,
					height: brickHeight,
					width: brickWidth,
					color: getColor()
				})
			);
		}
	}
	game0.reserve(
		...bricks,
		...Wall.generate(SCREEN_RESOLUTION.x, SCREEN_RESOLUTION.y),
		ball,
		paddle
	);
	return game0;
}

const game0 = createMap(configMap[0], paddle);
const game1 = createMap(configMap[1], paddle);
game0.start();