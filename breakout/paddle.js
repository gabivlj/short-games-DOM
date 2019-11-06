/* eslint-disable no-undef */
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
      collider = true,
      optimizedColliders = [],
    },
    x = 0,
    y = 0,
    deg = 0,
    speed,
    ball,
    index,
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
        collider,
        optimizedColliders,
      },
      x,
      y,
      deg,
    );
    this.speed = speed;
    this.before = { x: this.x, y: this.y };
    this.currentVelocity = 0;
    this.speedBallCol = Math.abs(this.x - this.before.x);
    this.ball = ball;
    this.index = index;
  }

  start() {}

  collision(val) {
    const colliders = this.detectCollisionsOptimizedCollider();
    // const col = this.detectCollision();
    colliders.forEach(col => {
      const { gameObject } = col.colliderInformation.conditions;
      const goType = Utils.GetType(gameObject);
      if (goType === 'PowerUp') {
        const { type } = gameObject.type;
        if (type === 'LIFE') {
          this.ball.lifes++;
        } else if (type === 'PADDLE_BIGGER') {
          this.width += 40;
          if (this.x > 1000) this.position(-40);
        } else if (type === 'BALL_SLOW') {
          const less = this.ball.speedX / 5;
          this.ball.speedX -= less;
          this.ball.speedY -= less;
          setTimeout(() => {
            this.ball.speedX += less;
            this.ball.speedY += less;
          }, 10000);
        }
        Game.__essentialVariableToKeepTrackOfTheGreatGamesYoureCreatingMyDude.destroy(
          gameObject,
        );
      }
      this.position(-val);
    });
    // if (col.collided) {
    //   const { gameObject } = col.colliderInformation.conditions;
    //   const goType = Utils.GetType(gameObject);
    //   if (goType === 'PowerUp') {
    //     const { type } = gameObject.type;
    //     if (type === 'LIFE') {
    //       this.ball.lifes++;
    //     } else if (type === 'PADDLE_BIGGER') {
    //       this.width += 40;
    //       if (this.x > 1000) this.position(-40);
    //     } else if (type === 'BALL_SLOW') {
    //       const less = this.ball.speedX / 5;
    //       this.ball.speedX -= less;
    //       this.ball.speedY -= less;
    //       setTimeout(() => {
    //         this.ball.speedX += less;
    //         this.ball.speedY += less;
    //       }, 10000);
    //     }
    //     Game.__essentialVariableToKeepTrackOfTheGreatGamesYoureCreatingMyDude.destroy(
    //       gameObject,
    //     );
    //   }
    //   this.position(-val);
    // }
  }

  update() {
    const [l, r, x, y, e] = Input.getInputs(
      'LEFT',
      'RIGHT',
      'MOUSEX',
      'MOUSEY',
      'E',
    );
    const position = x - this.width / 2;
    if (e) {
      Game.useActions({ name: 'EXIT', data: null });
      const scores = Store.getItem('scores') || {};
      scores[this.index] = Math.max(scores[this.index] || 0, this.ball.score);
      Store.addItem('scores', scores);
      return;
    }
    setTimeout(() => {
      this.before.x = this.x;
    }, 100);
    const dir =
      Math.abs(position - this.x) > 30 ? Math.sign(position - this.x) : 0;
    // console.log(dir);
    this.currentVelocity = dir * this.speed * this.deltaTime * 10;
    this.position(this.currentVelocity, 0);

    this.collision(this.currentVelocity);
    // Todo: Implement acceleration.
    this.speedBallCol = Math.abs(this.x - this.before.x);
    // this.setPosition(x, this.y);
  }
}
