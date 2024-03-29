/* eslint-disable no-plusplus */
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
    this.sound = new Sound('./sound/powerup.mp3');
  }

  start() {}

  collision(val, original) {
    const colliders = this.detectCollisionsOptimizedCollider({ x: 0 });
    // const col = this.detectCollision();
    colliders.forEach(col => {
      const { gameObject, left, right } = col.colliderInformation.conditions;
      const goType = Utils.GetType(gameObject);
      if (goType === 'PowerUp') {
        this.sound.play();
        const { type } = gameObject.type;
        if (type === 'LIFE') {
          this.ball.lifes++;
        } else if (type === 'PADDLE_BIGGER') {
          if (this.width < window.innerWidth / 3) this.width += 40;
          if (this.x + this.width / 2 > window.innerWidth / 2)
            this.position(-40);
        } else if (type === 'BALL_SLOW' && !this.ball.slowed) {
          this.ball.slowed = true;
          const less = this.ball.speedX / 3;
          this.ball.speedX -= less;
          this.ball.speedY -= less;
          setTimeout(() => {
            this.ball.slowed = false;
            this.ball.speedX += less;
            this.ball.speedY += less;
          }, 3000);
        }

        Game.__essentialVariableToKeepTrackOfTheGreatGamesYoureCreatingMyDude.destroy(
          gameObject,
        );
      }
      if (goType === 'Wall') {
        if (left) this.setPosition(gameObject.x - this.width, this.y);
        else {
          this.setPosition(gameObject.x + gameObject.width, this.y);
        }
      }
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
    const [x, e] = Input.getInputs('MOUSEX', 'E');
    if (e) {
      Game.useActions({ name: 'EXIT', data: null });
      const scores = Store.getItem('scores') || {};
      scores[this.index] = Math.max(scores[this.index] || 0, this.ball.score);
      Store.addItem('scores', scores);
      return;
    }
    const position = x - this.width / 2;
    setTimeout(() => {
      this.before.x = position;
    }, 100);
    const dir =
      Math.abs(position - this.x) > 10 ? Math.sign(position - this.x) : 0;
    // console.log(dir);
    const originalPositionX = this.x;
    this.currentVelocity = dir * this.speed * this.deltaTime * 10;

    this.position(this.currentVelocity, 0);

    this.collision(this.currentVelocity, originalPositionX);
    this.speedBallCol = Math.abs(this.x - this.before.x);
    // this.setPosition(x, this.y);
  }
}
