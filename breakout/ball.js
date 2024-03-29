/* eslint-disable no-undef */
class Ball extends GameObject {
  constructor(width, height, l, configuration, x, y, speed = 3, lastBrickY) {
    super(width, height, l, configuration, x, y);
    this.colorOriginal = configuration.backgroundColor;
    this.startingPos = { x, y: y - 40 };
    this.speed = speed;
    this.signX = 1;
    this.speedX = speed;
    this.speedY = speed;
    this.signY = 1;
    this.lifes = 3;
    this.score = 0;
    this.slowed = false;
    this.soundPaddle = null;
    this.lastBrickY = lastBrickY;
  }

  start() {
    this.soundPaddle = new Sound('./sound/paddleBall.mp3');
  }

  play() {
    this.soundPaddle.play();
  }

  collideLogic() {
    if (this.y > this.lastBrickY + 100) {
      const colliders = this.detectCollisionsOptimizedCollider({ x: 0 });
      colliders.forEach(col => {
        this.collisionBall(col);
      });
    } else {
      this.collisionBall(this.detectCollision());
    }
  }

  collisionBall(col) {
    // Tries to detect collision with every object. Not optimal but in ball's case

    if (!col || !col.collided) return;
    const { name } = col.colliderInformation.conditions.gameObject.constructor;
    if (name !== 'PowerUp') {
      const { gameObject } = col.colliderInformation.conditions;
      if (col.colliderInformation.conditions.bot) {
        this.signY = -1;
      } else if (col.colliderInformation.conditions.top) {
        this.signY = 1;
        if (gameObject.x + gameObject.width / 2 < this.x) {
          this.signX = 1;
        } else {
          this.signX = -1;
        }
      } else if (col.colliderInformation.conditions.right) {
        this.signX = 1;
      } else this.signX = -1;
    }
    if (name === 'Paddle') {
      this.play();
      this.speedX = Utils.Clamp(
        (this.speedX *
          col.colliderInformation.conditions.gameObject.speedBallCol) /
          3,
        200,
        this.speed,
      );
    } else if (name === 'Brick') {
      this.score += 100;
      if (this.score % 1000 === 0) {
        this.speedX *= 1.3;
        this.speedY *= 1.3;
      }
      this.speedX = Math.max(50, this.speed - 15);
      this.speedX = Math.min(this.speedX, 500);
      this.speedY = Math.min(this.speedY, 500);
      col.colliderInformation.conditions.gameObject.collided();
    } else if (col.colliderInformation.conditions.top && name !== 'PowerUp') {
      this.lifes--;
      this.setPosition(window.innerWidth / 2, window.innerHeight / 1.25);
      this.signY = 1;
    }
  }

  update() {
    if (this.slowed) {
      this.backgroundColor = 'green';
    } else {
      this.backgroundColor = this.colorOriginal;
    }
    this.collideLogic();
    this.position(
      this.speedX * this.signX * this.deltaTime,
      this.speedY * this.signY * this.deltaTime,
    );
  }
}
