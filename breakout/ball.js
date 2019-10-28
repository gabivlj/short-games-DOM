/* eslint-disable no-undef */
class Ball extends GameObject {
  constructor(width, height, l, configuration, x, y, speed = 3) {
    super(width, height, l, configuration, x, y);
    this.speed = speed;
    this.signX = 1;
    this.speedX = speed;
    this.speedY = speed;
    this.signY = 1;
    this.lifes = 3;
  }

  start() {}

  collisionBall() {
    const col = this.detectCollision();

    if (!col || !col.collided) return;
    const { name } = col.colliderInformation.conditions.gameObject.constructor;
    if (col.colliderInformation.conditions.bot) {
      this.signY = -1;
    } else if (col.colliderInformation.conditions.top) {
      this.signY = 1;
    } else if (col.colliderInformation.conditions.right) {
      this.signX = 1;
    } else this.signX = -1;
    if (name === 'Paddle') {
      this.speedX = Utils.Clamp(
        (this.speedX *
          col.colliderInformation.conditions.gameObject.speedBallCol) /
          3,
        75,
        300,
      );
      console.log(this.speed);
    } else if (name === 'Brick') {
      this.speedX = Math.max(50, this.speed - 15);
      col.colliderInformation.conditions.gameObject.collided();
    } else if (col.colliderInformation.conditions.top) {
      this.lifes--;
    }
  }

  update() {
    this.collisionBall();
    this.position(
      this.speedX * this.signX * this.deltaTime,
      this.speedY * this.signY * this.deltaTime,
    );
  }
}
