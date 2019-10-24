const { GameObject, Game, Input, Utils } = GameEngine;

class Brick extends GameObject {
	collided() {
		console.log('haha');
		Game.__essentialVariableToKeepTrackOfTheGreatGamesYoureCreatingMyDude.destroy(
			this
		);
	}
	awake() {
		const a = Math.random() * 2;
		if (a > 1) this.collided();
	}
}

Brick.createBrick = ({ height, width, color, x, y }) => {
	return new Brick(
		width,
		height,
		0,
		{ backgroundColor: color, reserved: true, reset: true, collider: true },
		x,
		y
	);
};
