class Ball extends GameObject {
	constructor(width, height, l, configuration, x, y, speed = 3) {
		super(width, height, l, configuration, x, y);
		this.speed = speed;
		this.signX = 1;
		this.signY = 1;
	}

	start() {}

	collisionBall() {
		const col = this.detectCollision();

		if (!col || !col.collided) return;
		const name = col.colliderInformation.conditions.gameObject.constructor.name;
		if (col.colliderInformation.conditions.bot) {
			this.signY = -1;
		} else if (col.colliderInformation.conditions.top) {
			this.signY = 1;
		} else if (col.colliderInformation.conditions.right) {
			this.signX = 1;
		} else this.signX = -1;
		if (name === 'Paddle') {
			console.log(
				'before: ',
				col.colliderInformation.conditions.gameObject.speedBallCol
			);
			this.speed = Utils.Clamp(
				(this.speed *
					col.colliderInformation.conditions.gameObject.speedBallCol) /
					3,
				75,
				300
			);
			console.log(this.speed);
		} else if (name === 'Brick') {
			this.speed = Math.max(50, this.speed - 15);
			col.colliderInformation.conditions.gameObject.collided();
		}
	}

	update() {
		this.collisionBall();
		this.position(
			this.speed * this.signX * this.deltaTime,
			this.speed * this.signY * this.deltaTime
		);
	}
}
