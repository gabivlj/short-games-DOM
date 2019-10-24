/* eslint-disable no-use-before-define */
/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
// browser compatibility.

/**
 * @description Creates a new engine when called.
 * @private
 * @returns {{Game: Game, Input: Input, GameObject: GameObject }}
 */
function GameEng() {
  (function() {
    const requestAnimationFrame =
      window.requestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.msRequestAnimationFrame;
    window.requestAnimationFrame = requestAnimationFrame;
    if (window.requestAnimationFrame == null)
      console.error('Error initializing requestAnimationFrame');
  })();

  const root = document.getElementById('root');
  // set as default the background color as black.
  document.body.style.backgroundColor = 'black';

  function guidGenerator() {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    return `_${Math.random()
      .toString(36)
      .substr(2, 9)}`;
  }

  /**
   * @description Inputs keycode object, we'll also check here when user gets inputs if they exist and inform them
   */
  const INPUTS = {
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    // Get all the chars from there
    ...new Array(25)
      .fill(0)
      .map((_, index) => String.fromCharCode(97 + index))
      .reduce(
        (prev, char, index) => ({ ...prev, [char.toUpperCase()]: 65 + index }),
        {},
      ),
  };

  /**
   * @description Map keys that will store if an input exists
   */
  const mapKeys = {};

  /**
   * @description Sets in the object if the input is being pressed (Refactor this in the future)
   */
  const processInput = (inputs, keyNumber, key, inputArrowKeys, inputThis) => {
    if (keyNumber === INPUTS[inputArrowKeys] && mapKeys[key]) {
      inputs[inputThis] = 1;
    } else if (keyNumber === INPUTS[inputArrowKeys] && !mapKeys[key])
      inputs[inputThis] = 0;
  };

  let globalInputs = null;

  class Input {
    constructor() {
      if (globalInputs) {
        throw new Error('You cannot instantiate inputs class!');
      }
      this.EXTRA_INPUTS = {};
      /**
       * @description The purpose of this is check in every frame what input is being checked and that it goes smooth.
       */
      window.onkeydown = window.onkeyup = e => {
        // eslint-disable-next-line no-restricted-globals
        e = e || event; // to deal with IE
        mapKeys[String(e.keyCode)] = e.type === 'keydown';
        Object.keys(mapKeys).forEach(key => {
          const keyNumber = parseInt(key, 10);
          processInput(this.EXTRA_INPUTS, keyNumber, key, 'UP', 'UP');
          processInput(this.EXTRA_INPUTS, keyNumber, key, 'DOWN', 'BOT');
          processInput(this.EXTRA_INPUTS, keyNumber, key, 'LEFT', 'LEFT');
          processInput(this.EXTRA_INPUTS, keyNumber, key, 'RIGHT', 'RIGHT');
          Object.keys(INPUTS).forEach(key => {
            processInput(
              this.EXTRA_INPUTS,
              keyNumber,
              INPUTS[key],
              key.toUpperCase(),
              key,
            );
          });
        });
      };
    }

    /**
     * @description We'll use this for static getInputs function
     */
    ___getInputs(inputs) {
      return inputs.reduce((prev, now) => {
        now = now.toUpperCase();
        prev.push(
          INPUTS[now]
            ? this.EXTRA_INPUTS[now] || 0
            : (() => {
                console.warn(`${now} input doesn't exist!`);
                return null;
              })(),
        );
        return prev;
      }, []);
    }

    /**
     * @param  {...String} inputs, [a...z] [A..Z] [UP..LEFT](clockwise)
     */
    static getInputs(...inputs) {
      return globalInputs.___getInputs(inputs);
    }
  }

  globalInputs = new Input();
  const LIFE_CYCLE_INTERVALS = [];
  const reservedGameObjects = {};

  class Game {
    constructor(gamespeed = 1) {
      this.gameID = guidGenerator();
      this._input = globalInputs;
      this.gamespeed = gamespeed;
      this.delta = 0.0;
      this.windowHeight = window.innerHeight;
      this.windowWidth = window.innerWidth;
      this.destroyed = false;
    }

    /**
     * @description When you wanna preload or you don't want some gameObjects to be destroyed when stopped add them to this.
     */
    reserve(...gameObjects) {
      reservedGameObjects[this.gameID] = [...gameObjects];
    }

    start() {
      // Sanity check
      if (
        Game.__CURRENT_GAME_DONT_DELETE_FROM_HERE_OR_YOU_BUG_YOUR_GAME_YOU_DECIDE
      )
        throw new Error(
          `There is another game instance being played, please delete it.`,
        );
      // Sanity check v2
      if (Game.__GAME_OBJECTS.length !== Game.__GAME_OBJECTS_LENGTH) {
        throw new Error(
          `There are GameObjects that don't exist in this game: GAME_OBJECTS: ${Game.__GAME_OBJECTS}`,
        );
      }
      Game.__CURRENT_GAME_DONT_DELETE_FROM_HERE_OR_YOU_BUG_YOUR_GAME_YOU_DECIDE = this;
      // Check if the game has been destroyed before and instantiate the reserved
      if (this.destroyed) {
        // todo: reset the gameObjects if the user wants us to.
        reservedGameObjects[this.gameID].forEach(element =>
          root.appendChild(element.sprite),
        );
      }
      Game.__GAME_OBJECTS = [
        ...Game.__GAME_OBJECTS,
        ...(reservedGameObjects[this.gameID] || []),
      ];
      Game.__GAME_OBJECTS_LENGTH = Game.__GAME_OBJECTS.length;
      window.onresize = () => {
        // check what is being resized.
        const v = () => {
          if (this.windowWidth === window.innerWidth) {
            return this.windowHeight / window.innerHeight;
          }
          return this.windowWidth / window.innerWidth;
        };
        const ratioX = v();
        const ratioY = v();
        Game.__GAME_OBJECTS.forEach(g => {
          g.width /= ratioX;
          g.height /= ratioY;
          g.x /= ratioX;
          g.y /= ratioY;
        });
        this.windowHeight = window.innerHeight;
        this.windowWidth = window.innerWidth;
      };
      // FIRST CALL.
      Game.__GAME_OBJECTS.forEach(g => {
        g.inputs = this._input;
        g.sprite.style.display = '';
        g.awake();
        g.start();
      });
      // SET INTERVAL
      LIFE_CYCLE_INTERVALS.push(
        setInterval(() => {
          Game.__GAME_OBJECTS.forEach(g => {
            g.inputs = this._input;
            g.update();
            g._update();
          });
        }, 0.1),
      );
      const lateUpdate = () => {
        const dt = Date.now();
        // console.log(Game.__GAME_OBJECTS);
        Game.__GAME_OBJECTS.forEach(g => {
          g.inputs.right = this._input.right;
          g.inputs.top = this._input.top;
          // Fixed update.
          g.fixedUpdate();
          g._update();
          // We promised that there would be a fixed update.
          g.lateUpdate();
          g._update();
        });
        this.deltaTime = Date.now() - dt ? 0.001 : Date.now() - dt / 100;
      };
      LIFE_CYCLE_INTERVALS.push(
        setInterval(() => {
          requestAnimationFrame(lateUpdate);
        }, 60),
      );
    }

    /**
     * @description Total reset of the scene/game, the gameObjects will be destroyed and the DOM will be reseted.
     */
    stop() {
      root.innerHTML = '';
      Game.__GAME_OBJECTS = [];
      Game.__GAME_OBJECTS_LENGTH = 0;
      Game.__CURRENT_GAME_DONT_DELETE_FROM_HERE_OR_YOU_BUG_YOUR_GAME_YOU_DECIDE = null;
      LIFE_CYCLE_INTERVALS.forEach(i => clearInterval(i));
      this.destroyed = true;
    }

    /**
     * @param {GameObject} gameObject
     */
    destroy(gameObject) {
      const id = gameObject.instanceID;
      Game.__GAME_OBJECTS = Game.__GAME_OBJECTS.filter(
        gameObj => gameObj.instanceID !== id,
      );
    }
  }

  // Game variables.
  Game.__GAME_OBJECTS = [];
  Game.__GAME_OBJECTS_LENGTH = 0;
  Game.__CURRENT_GAME_DONT_DELETE_FROM_HERE_OR_YOU_BUG_YOUR_GAME_YOU_DECIDE = null;

  /**
   * @description Inherit from this and you will be able to create your custom GameObjects!
   * @param {width Number} Width, width of your sprite or plain gameObject
   * @param {height Number} Height, height of your sprite or plain gameObject
   * @param {lengthOfSpriteSheet Number} lengthOfSpriteSheet, If you have a sprite sheet (or a single sprite) put a number here. If not just pass 0
   * @param {{ backgroundColor: string, color: string, borderRadius: string, spriteSource: string, offsetSpriteX: Number, offsetSpriteY: Number, typeOfMetrics : Number }} configuration,  basic configuration, don't use typeOfMetrics and offsetSprites because they are not recommended unless you know what you're really doing
   * @param {x Number} XPosition
   * @param {y Number} YPosition
   */
  class GameObject {
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
      },
      x = 0,
      y = 0,
      deg = 0,
    ) {
      /**
       * @description Time in ms passed since last frame.
       */
      this.deltaTime = 0.01;
      /**
       * @description Current degrees in the sprite.
       */
      this.degrees = deg;
      /**
       * @description Object width.
       */
      this.width = width;
      /**
       * @description Object height
       */
      this.height = height;
      /**
       * @description Length of the sprite sheet (x and y)
       */
      this.lengthSpriteSheet = lengthSpriteSheet;
      /**
       * @description Position X
       */
      this.x = x;
      /**
       * @description Position Y
       */
      this.y = y;
      /**
       * @description Index in the sprite sheet
       */
      this.currentSpriteIndex = [0, 0];
      /**
       * @description Instance ID
       * @private
       * @constant
       */
      this.instanceID = guidGenerator();
      /**
       * @description inputs.
       * @constant
       * @deprecated
       */
      this.inputs = {
        right: 0,
        top: 0,
        down: 0,
        left: 0,
        a: 0,
        w: 0,
        s: 0,
        d: 0,
      };
      /**
       * @description Initial dom insert.
       */
      const domInstance = document.createElement('div');
      domInstance.classList.add(this.instanceID);
      domInstance.classList.add('gameObject');
      domInstance.style.backgroundImage =
        spriteSource || spriteSource.length > 0
          ? `url('${spriteSource}')`
          : 'none';
      domInstance.style.backgroundColor = backgroundColor;
      domInstance.style.display = Game.__CURRENT_GAME_DONT_DELETE_FROM_HERE_OR_YOU_BUG_YOUR_GAME_YOU_DECIDE
        ? ''
        : 'none';
      this.typeOfMetric = typeOfMetrics;
      domInstance.style.backgroundPosition = `${offsetSpriteX}${this.typeOfMetric} ${offsetSpriteY}${this.typeOfMetric}`;
      this.offsetSpriteX = offsetSpriteX;
      this.offsetSpriteY = offsetSpriteY;
      domInstance.style.color = color;
      domInstance.style.borderRadius = borderRadius;
      domInstance.style.maxWidth = `${width}${this.typeOfMetric}`;
      domInstance.style.maxHeight = `${height}${this.typeOfMetric}`;
      root.appendChild(domInstance);
      this.sprite = domInstance;
      this.__dom = domInstance;
      this._rotate();
      if (!reserved) {
        Game.__GAME_OBJECTS.push(this);
        Game.__GAME_OBJECTS_LENGTH++;
      }
      if (
        Game.__CURRENT_GAME_DONT_DELETE_FROM_HERE_OR_YOU_BUG_YOUR_GAME_YOU_DECIDE &&
        !reserved
      ) {
        this.awake();
        this.start();
      }
    }

    /**
     * @description Returns an object if it collided, returns false if not.
     * @param {Number} offsetX The offset in X that you wanna check.
     * @param {Number} offsetY The offset in Y that you wanna check.
     * @returns {{Collided: Boolean ? ColliderInformation: { conditions: { left: Boolean, right: Boolean, top: Boolean, bot: Boolean}, info: { bCollision: Number, tCollision: Number, lCollision: Number, rCollision: Number}, gameObject: GameObject, collided: Boolean}}} Returns false if there isn't a collider
     */
    detectCollision(offsetX = 0, offsetY = 0) {
      const bottom = this.y + this.height;
      const right = this.x + this.width;
      const l = Game.__GAME_OBJECTS.length;
      for (let i = 0; i < l; i += 1) {
        const otherObject = Game.__GAME_OBJECTS[i];
        if (otherObject.instanceID === this.instanceID) continue;
        const tileBottom = otherObject.y + otherObject.height;
        const tileRight = otherObject.x + otherObject.width;
        const bCollision = Math.floor(tileBottom - this.y);
        const tCollision = Math.floor(bottom - otherObject.y);
        const lCollision = Math.floor(right - otherObject.x);
        const rCollision = Math.floor(tileRight - this.x);

        const conditions = {
          left:
            lCollision < rCollision &&
            lCollision < tCollision &&
            lCollision < bCollision,
          top:
            tCollision < rCollision &&
            tCollision < lCollision &&
            tCollision < bCollision,
          right:
            rCollision < tCollision &&
            rCollision < lCollision &&
            rCollision < bCollision,
          bot:
            bCollision < tCollision &&
            bCollision < lCollision &&
            bCollision < rCollision,
          info: {
            bCollision,
            tCollision,
            lCollision,
            rCollision,
          },
          gameObject: otherObject,
        };
        if (
          this.x < otherObject.x + otherObject.width &&
          this.instanceID !== otherObject.instanceID &&
          this.x + this.width > otherObject.x &&
          this.y < otherObject.y + otherObject.height &&
          this.height + this.y > otherObject.y
        )
          return {
            collided: true,
            colliderInformation: {
              conditions,
              collided: true,
            },
          };
      }
      return { collided: false, colliderInformation: {} };
    }

    /**
     * @private
     * @doNotChangeOrItWillBreak
     * @description Rotates object in the dom.
     */
    _rotate() {
      this.sprite.style.transform = `rotate(${this.degrees}deg)`;
      this.sprite.style.overflow = 'hidden';
      this.sprite.style.webkitTransform = `rotate(${this.degrees}deg)`;
    }

    /**
     * @param {Number} indexX
     * @param {Number} indexY
     * @description Sets the sprite index (Make sure the index is less than this.lengthSpriteSheet)
     * @returns If sprite index is right, returns the sprite DOM object, if it's not right returns null.
     */
    setSpriteIndex(indexX, indexY) {
      if (
        indexX >= this.lengthSpriteSheet ||
        indexY >= this.lengthSpriteSheet
      ) {
        return null;
      }
      this.sprite.style.backgroundPositionX = `${-this.width * indexX -
        this.offsetSpriteX}${this.typeOfMetric}`;
      this.sprite.style.backgroundPositionY = `${-this.height * indexY -
        this.offsetSpriteY}${this.typeOfMetric}`;
      this.currentSpriteIndex = [indexX, indexY];
      return this.sprite;
    }

    /**
     * @param {Number} x
     * @param {Number} y
     * @description Adds the position
     */
    position(x, y = 0) {
      this.x += x;
      this.y -= y;
    }

    setPosition(x, y) {
      this.x = x;
      this.y = y;
    }

    /**
     * @private
     * @doNotChangeOrItWillBreak
     * @description Updates object in the dom.
     */
    _update() {
      this.sprite.style.position = 'absolute';
      this.sprite.style.top = `${this.y}${this.typeOfMetric}`;
      this.sprite.style.left = `${this.x}${this.typeOfMetric}`;
      this._rotate();
      this.sprite.style.width = `${this.width}${this.typeOfMetric}`;
      this.sprite.style.height = `${this.height}${this.typeOfMetric}`;
      this.sprite.style.minWidth = `${this.width}${this.typeOfMetric}`;
      this.sprite.style.maxWidth = `${this.width}${this.typeOfMetric}`;
      this.sprite.style.minHeight = `${this.height}${this.typeOfMetric}`;
      this.sprite.style.maxHeight = `${this.height}${this.typeOfMetric}`;
    }

    /**
     * @description Executes before start
     */
    awake() {}

    /**
     * @description Executes one time.
     */
    start() {}

    /**
     * @description Executes whenever it can
     */
    update() {}

    /**
     * @description Executes in a fixed time
     */
    fixedUpdate() {}

    /**
     * @description Executes after all updates.
     */
    lateUpdate() {}
  }
  document.body.style.overflowY = 'hidden';
  document.body.style.overflowX = 'hidden';
  return {
    Game,
    GameObject,
    Input,
  };
}

const GameEngine = GameEng();
