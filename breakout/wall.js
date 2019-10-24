class Wall extends GameObject {
	constructor(width, height, lengthSpriteSheet, config, x = 0, y = 0, deg = 0) {
		super(width, height, lengthSpriteSheet, config, x, y, deg);
	}
}

Wall.generate = (screenX, screenY) => {
	const topWall = new Wall(
		screenX,
		10,
		0,
		{
			backgroundColor: 'blue',
			reserved: true,
			collider: true
		},
		0,
		0,
		0
	);
	const botWall = new Wall(
		screenX + 20,
		40,
		0,
		{
			backgroundColor: 'blue',
			reserved: true,
			collider: true
		},
		0,
		screenY - 30,
		0
	);

	const leftWall = new Wall(
		40,
		screenY + 300,
		0,
		{
			backgroundColor: 'blue',
			reserved: true,
			collider: true
		},
		0,
		0,
		0
	);

	const rightWall = new Wall(
		40,
		screenY + 300,
		0,
		{
			backgroundColor: 'blue',
			reserved: true,
			collider: true
		},
		screenX - 30,
		0,
		0
	);

	return [topWall, botWall, leftWall, rightWall];
};
