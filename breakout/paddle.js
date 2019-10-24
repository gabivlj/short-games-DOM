class Paddle extends GameObject {
	constructor(
		width,
		height,
		lengthSpriteSheet,
		{
			backgroundColor = '',
			color = '',
			borderRadius = '0%',
			spriteSource = '',
			offsetSpriteX = 0,
			offsetSpriteY = 0,
			typeOfMetrics = 'px',
			reserved = false,
			reset = false,
			collider = true
		},
		x = 0,
		y = 0,
		deg = 0,
		speed
	) {
		super(
			width,
			height,
			lengthSpriteSheet,
			{
				backgroundColor,
				color,
				borderRadius,
				spriteSource,
				offsetSpriteX,
				offsetSpriteY,
				typeOfMetrics,
				reserved,
				reset,
				collider
			},
			x,
			y,
			deg
		);
		this.speed = speed;
		this.before = { x: this.x, y: this.y };
		this.currentVelocity = 0;
		this.speedBallCol = Math.abs(this.x - this.before.x);
	}

	collision(val) {
		const col = this.detectCollision();
		if (col.collided) {
			if (col.colliderInformation.conditions.right) {
				this.position(-val);
			} else if (col.colliderInformation.conditions.left) {
				this.position(-val);
			}
		}
	}

	update() {
		const [l, r, x, y] = Input.getInputs('LEFT', 'RIGHT', 'MOUSEX', 'MOUSEY');

		const dir = Math.abs(x - this.x) > 30 ? Math.sign(x - this.x) : 0;
		// console.log(dir);
		this.currentVelocity = dir * this.speed * this.deltaTime * 10;
		this.position(this.currentVelocity, 0);

		this.collision(this.currentVelocity);
		// Todo: Implement acceleration.
		this.speedBallCol = Math.abs(this.x - this.before.x);
		// this.setPosition(x, this.y);
		this.before.x = this.x;
		this.before.y = this.y;
	}
}