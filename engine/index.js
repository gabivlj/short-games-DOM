/* eslint-disable no-continue */
/* eslint-disable no-use-before-define */
/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */

/**
 * TODOs:
 * *More palettes.
 * *Better interface in the game. <- sure
 * *Inform what you got with the powerups. <---- tmrw
 * *Sound <--- maybe if i feel like it idk
 */

/**
 * @description Creates a new engine when called.
 * @private
 * @returns {{Game: Game, Input: Input, GameObject: GameObject }}
 */
function GameEng(backgroundColor) {
  class Sound {
    constructor(src) {
      this.sound = document.createElement('audio');
      this.sound.src = src;
      this.sound.setAttribute('preload', 'auto');
      this.sound.setAttribute('controls', 'none');
      this.sound.style.display = 'none';
      document.body.appendChild(this.sound);
    }

    play() {
      this.sound.play();
    }

    stop() {
      this.sound.pause();
    }
  }

  function findOptimizedColliders(game, gameObject) {
    game.__gameObjects.forEach(other => {
      if (
        gameObject._optimizedCollidersDictionary[Utils.GetType(other)] &&
        gameObject.instanceID !== other.instanceID
      )
        gameObject._optimizedColliders.push(other);
    });
  }
  /**
   * @description Local Storage manager and parser for you!
   */
  class Store {
    static addItem(key, data) {
      localStorage.setItem(key, JSON.stringify(data));
    }

    static modifyItemArray(key, callback) {
      const item = localStorage.getItem(key);
      const array = JSON.parse(
        !item || item === 'undefined' || item === 'null' ? '[]' : item,
      );
      const finalArray = callback(array);
      localStorage.setItem(key, JSON.stringify(finalArray));
    }

    static getItem(key) {
      const item = localStorage.getItem(key);
      const endItem =
        item && item !== 'undefined' && item !== 'null' ? item : null;
      if (!endItem) return null;
      return JSON.parse(endItem);
    }

    static deleteItem(key) {
      localStorage.removeItem(key);
    }
  }
  class Utils {
    /**
     * @description Only works with Numbers and Strings
     * @param {Object} copy, To what you wanna copy
     * @param {Object} attributes, What you wanna copy
     */
    static keyCopies(copy, attributes) {
      Object.keys(attributes).forEach(attribute => {
        copy[attribute] = attributes[attribute];
      });
      return copy;
    }

    static GetType(gameObject) {
      return gameObject.constructor.name;
    }

    static Clamp(value, x, y) {
      if (value <= x) return x;
      if (value >= y) return y;
      return value;
    }

    static destroyDOMElement(element) {
      element.parentNode.removeChild(element);
    }

    static guidGenerator() {
      // Math.random should be unique because of its seeding algorithm.
      // Convert it to base 36 (numbers + letters), and grab the first 9 characters
      // after the decimal.
      return `_${Math.random()
        .toString(36)
        .substr(2, 9)}`;
    }
  }

  // INITIALIZE REQUEST ANIMATION FRAME.
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

  // DOM ROOT.
  let root = document.getElementById('root');
  if (!root) {
    root = document.createElement('div');
    document.body.appendChild(root);
  }
  // set as default the background color as black.
  document.body.style.backgroundColor = backgroundColor;

  /**
   * @description Inputs keycode object, we'll also check here when user gets inputs if they exist and inform if it exist
   */
  const INPUTS = {
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    // Get all the chars from there (Lazy way)
    ...new Array(25)
      .fill(0)
      .map((_, index) => String.fromCharCode(97 + index))
      .reduce(
        (prev, char, index) => ({ ...prev, [char.toUpperCase()]: 65 + index }),
        {},
      ),
    MOUSEX: 1,
    MOUSEY: 1,
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
      this.EXTRA_INPUTS = { MOUSEX: 0, MOUSEY: 0 };
      /**
       * @description The purpose of this is check in every frame what input is being checked and that it goes smooth.
       */
      const inputKeys = Object.keys(INPUTS);
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
          inputKeys.forEach(key => {
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
      document.onmousemove = e => {
        if (e.clientX && e.clientY) {
          INPUTS.MOUSEX = e.clientX;
          INPUTS.MOUSEY = e.clientY;
          this.EXTRA_INPUTS.MOUSEX = INPUTS.MOUSEX;
          this.EXTRA_INPUTS.MOUSEY = INPUTS.MOUSEY;
        }
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

  class Game {
    constructor(
      resolutions = { x: window.innerWidth, y: window.innerHeight },
      globalCallbacks = {},
      configuration = { backgroundColor: 'white' },
    ) {
      this.gameID = Utils.guidGenerator();
      this._input = globalInputs;
      this.gamespeed = 1;
      this.delta = 0.0;
      this.windowHeight = resolutions.y || window.innerHeight;
      this.windowWidth = resolutions.x || window.innerWidth;
      this.destroyed = false;
      this.running = false;
      this.paused = false;
      this.callbacks = globalCallbacks;
      this.backgroundColor = configuration.backgroundColor;
      this.onPause = () => {};
      this.onReady = () => {};
    }

    /**
     * @description When you wanna preload or you don't want some gameObjects to be destroyed when stopped add them to this.
     */
    reserve(...gameObjects) {
      gameObjects.forEach(g => {
        g.windowHeight = this.windowHeight;
        g.windowWidth = this.windowWidth;
      });
      Game.__reservedGameObjects[this.gameID] = [...gameObjects];
      Game.__reservedGameObjects[this.gameID] = Game.__reservedGameObjects[
        this.gameID
      ].filter(g => g.reserved);
      Game.__reservedResetGameObjects[this.gameID] = Game.__reservedGameObjects[
        this.gameID
      ]
        .filter(gameObj => gameObj.reset)
        .map(gameObj => Utils.keyCopies({}, gameObj));
    }

    pause(pauseInformation) {
      this.paused = true;
      this.onPause(pauseInformation);
    }

    ready(readyInformation) {
      this.paused = false;
      this.onReady(readyInformation);
    }

    resize() {
      // check what is being resized.
      const v = () => {
        if (this.windowWidth === window.innerWidth) {
          return this.windowHeight / window.innerHeight;
        }
        return this.windowWidth / window.innerWidth;
      };
      Game.__gameObjects.forEach(g => {
        if (!g.windowWidth) g.windowWidth = this.windowWidth;
        if (!g.windowHeight) g.windowHeight = this.windowHeight;
        g.windowHeight = this.windowHeight;
        const ratioYY = g.windowHeight / window.innerHeight;
        const ratioXX = g.windowWidth / window.innerWidth;
        g.width /= ratioXX;
        g.height /= ratioYY;
        g.x = g.x === 0 ? 0 : g.x / ratioXX;
        g.y = g.y === 0 ? 0 : g.y / ratioYY;
        g._update();
        g.fontSize = g.fontSize ? g.fontSize / v() : g.fontSize;
        g.windowWidth = window.innerWidth;
        g.windowHeight = window.innerHeight;
      });

      // Game.__reservedGameObjects[this.gameID].forEach(g => {
      //   g.sprite.style.width = g.width;
      //   g.sprite.style.height = g.height;
      //   g.sprite.style.left = g.x;
      //   g.sprite.style.top = g.y;
      //   g._update();
      //   g.fontSize = g.fontSize ? g.fontSize / v() : g.fontSize;
      // });

      // Game.__reservedResetGameObjects[this.gameID].forEach(g => {
      //   g.sprite.style.width = g.width;
      //   g.sprite.style.height = g.height;
      //   g.sprite.style.left = g.x;
      //   g.sprite.style.top = g.y;
      //   g.fontSize = g.fontSize ? g.fontSize / v() : g.fontSize;
      // });

      this.windowHeight = window.innerHeight;
      this.windowWidth = window.innerWidth;
    }

    start() {
      document.body.style.backgroundColor = this.backgroundColor;
      // Sanity check
      if (Game.__essentialVariableToKeepTrackOfTheGreatGamesYoureCreatingMyDude)
        throw new Error(
          `There is another game instance being played, please use .stop() on it.`,
        );
      // Sanity check v2
      if (Game.__gameObjects.length !== Game.__gameObjectsLength) {
        throw new Error(
          `There are GameObjects that don't exist in this game: GAME_OBJECTS: ${Game.__gameObjects}`,
        );
      }
      let indexDeepCopy = 0;
      (Game.__reservedGameObjects[this.gameID] || []).forEach(element => {
        if (element.reset) {
          element = Utils.keyCopies(
            element,
            Game.__reservedResetGameObjects[this.gameID][indexDeepCopy],
          );
          indexDeepCopy++;
        }
      });

      Game.__essentialVariableToKeepTrackOfTheGreatGamesYoureCreatingMyDude = this;
      Game.__gameObjects = [
        ...Game.__gameObjects,
        ...(Game.__reservedGameObjects[this.gameID] || []),
      ];
      Game.__gameObjectsLength = Game.__gameObjects.length;
      Game.__gameObjects.forEach(gameObject => {
        findOptimizedColliders(Game, gameObject);
      });

      // resize();
      window.onresize = () => this.resize();
      this.resize();
      (Game.__reservedGameObjects[this.gameID] || []).forEach(e => {
        root.appendChild(e.sprite);
        if (e.useUpdate) Game.__gameObjectsUpdate.push(e);
      });
      Game.__gameObjects.forEach(g => {
        g.inputs = this._input;
        g.sprite.style.display = '';
        g.awake();
        g._start();
        g.start();
      });
      const timestep = 1000 / 60;
      const timestepUpdate = 1000 / 190;
      // SET INTERVAL
      let started = false;
      LIFE_CYCLE_INTERVALS.push(
        setInterval(() => {
          if (started) {
            console.log('EATEN?');
            return;
          }
          const dt = Date.now();
          started = true;
          if (this.paused) return;
          Game.__gameObjectsUpdate.forEach(g => {
            g.inputs = this._input;
            g.update();
            g._update();
            g.lateUpdate();
            g._update();
          });
          started = false;
          this.deltaTime = Date.now() - dt ? 0.001 : Date.now() - dt / 100;
        }, timestepUpdate),
      );
      const lateUpdate = timestamp => {
        if (this.paused) return;
        Game.__gameObjectsUpdate.forEach(g => {
          // Fixed update.
          g.fixedUpdate();
          g._update();
        });
      };
      LIFE_CYCLE_INTERVALS.push(
        setInterval(() => {
          requestAnimationFrame(lateUpdate);
        }, timestep),
      );
      this.running = true;
      Game.__gameObjects.forEach(g => g.startAfterFirstRender());
    }

    /**
     * @description Stop the game
     *              BEHAVIOUR:
     *              *   only the reserved GameObjects will stay in the Game's memory.
     *              *   only the reset and reserved: true will be reseted to original positions when loaded again.
     *              *   you can start this game again but take in mind these behaviours.
     */
    stop() {
      if (this.paused) this.ready();
      window.onresize = () => {};
      root.innerHTML = '';
      Game.__gameObjects = [];
      Game.__gameObjectsUpdate = [];
      Game.__gameObjectsLength = 0;
      Game.__essentialVariableToKeepTrackOfTheGreatGamesYoureCreatingMyDude = null;
      Game.__reservedGameObjects[this.gameID].forEach(g => {
        g._optimizedColliders = [];
      });
      Game.__reservedResetGameObjects[this.gameID].forEach(g => {
        g._optimizedColliders = [];
      });
      LIFE_CYCLE_INTERVALS.forEach(i => clearInterval(i));
      this.destroyed = true;
      Game.__IDGameStoredBefore = this.gameID;
      this.running = false;
    }

    /**
     * @param {GameObject} gameObject
     */
    destroy(gameObject) {
      const id = gameObject.instanceID;
      Game.__gameObjects = Game.__gameObjects.filter(gameObj => {
        const dontDestroy = gameObj.instanceID !== id;
        if (!dontDestroy) {
          gameObj.destroyed = true;
          Utils.destroyDOMElement(gameObj.sprite);
        }
        return dontDestroy;
      });

      Game.__gameObjectsUpdate = Game.__gameObjectsUpdate.filter(gameObj => {
        const dontDestroy = gameObj.instanceID !== id;
        if (!dontDestroy && !gameObj.destroyed) {
          gameObj.destroyed = true;
          Utils.destroyDOMElement(gameObj.sprite);
        }
        return dontDestroy;
      });

      Game.__gameObjects.forEach(g => {
        g._optimizedColliders = g._optimizedColliders.filter(
          gameObj => gameObj.instanceID !== gameObject.instanceID,
        );
      });

      if (!gameObject.reset)
        Game.__reservedGameObjects[this.gameID] = (
          Game.__reservedGameObjects[this.gameID] || []
        ).filter(gameObj => gameObj.instanceID !== id);
      gameObject.onDestroy();
    }

    executePersonalizedActions(...callbackAttributes) {
      callbackAttributes.forEach(c => this.callbacks[c.name](c.data));
    }
  }

  // Game variables.
  Game.__gameObjects = [];
  Game.__gameObjectsLength = 0;
  Game.__essentialVariableToKeepTrackOfTheGreatGamesYoureCreatingMyDude = null;
  Game.__IDGameStoredBefore = '';
  Game.__reservedGameObjects = {};
  // Store data of reset: true GameObjects.
  Game.__reservedResetGameObjects = {};
  Game.__gameObjectsUpdate = [];
  Game.useActions = (...callbackAttributes) => {
    Game.__essentialVariableToKeepTrackOfTheGreatGamesYoureCreatingMyDude.executePersonalizedActions(
      ...callbackAttributes,
    );
  };

  /**
   * @description Inherit from this and you will be able to create your custom GameObjects!
   * @param {width Number} Width, width of your sprite or plain gameObject
   * @param {height Number} Height, height of your sprite or plain gameObject
   * @param {lengthOfSpriteSheet Number} lengthOfSpriteSheet, If you have a sprite sheet (or a single sprite) put a number here. If not just pass 0
   * @param {{ backgroundColor: string, color: string, borderRadius: string, spriteSource: string, offsetSpriteX: Number, offsetSpriteY: Number, typeOfMetrics : Number, reserved: Boolean, reset: Boolean }} configuration,  basic configuration, don't use typeOfMetrics and offsetSprites because they are not recommended unless you know what you're really doing
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
        reset = false,
        collider = false,
        text = '',
        fontSize = '10px',
        gameObjectsToCollideTo = {},
        useUpdate = true,
        optimizedColliders = [],
      },
      x = 0,
      y = 0,
      deg = 0,
    ) {
      this.windowHeight = 0;
      this.windowWidth = 0;
      this._optimizedCollidersDictionary = optimizedColliders.reduce(
        (prev, now) => ({ ...prev, [now.name]: now }),
        {},
      );
      this._optimizedColliders = [];
      this.__collisions = [];
      this.useUpdate = useUpdate;
      this.destroyed = false;
      this.backgroundColor = backgroundColor;
      this.fontSize = `${fontSize}`;
      this.gameObjectsToCollideTo = gameObjectsToCollideTo;
      /**
       * @description Time in ms passed since last frame.
       */
      this.deltaTime = 0.01;
      /**
       * @description Current degrees in the sprite.
       */
      this.degrees = deg;

      this.text = text;
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
      this.instanceID = Utils.guidGenerator();
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
      this.collider = collider;
      const domInstance = document.createElement('div');
      domInstance.classList.add(this.instanceID);
      domInstance.classList.add('gameObject');
      domInstance.style.backgroundImage =
        spriteSource || spriteSource.length > 0
          ? `url('${spriteSource}')`
          : 'none';
      domInstance.style.backgroundColor = backgroundColor;
      domInstance.style.display = Game.__essentialVariableToKeepTrackOfTheGreatGamesYoureCreatingMyDude
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
      domInstance.style.fontSize = `${this.fontSize}px`;
      domInstance.innerText = text;
      domInstance.style.backgroundRepeat = 'no-repeat';
      this.reserved = reserved;
      if (!reserved) root.appendChild(domInstance);
      this.sprite = domInstance;
      this.__dom = domInstance;
      this._rotate();
      if (reset && !reserved) {
        console.warn('Reset won`t work if you don`t pass the reserved bool.');
      }
      this.reset = reset;

      if (
        Game.__essentialVariableToKeepTrackOfTheGreatGamesYoureCreatingMyDude &&
        !reserved
      ) {
        Game.__gameObjects.push(this);
        Game.__gameObjects.forEach(g =>
          g._optimizedCollidersDictionary[Utils.GetType(this)]
            ? g._optimizedColliders.push(this)
            : null,
        );
        if (useUpdate) Game.__gameObjectsUpdate.push(this);
        Game.__gameObjectsLength++;
        this.awake();
        this.start();
      }
    }

    /**
     * @description Detects collision from the optimized collider system.
     * @returns Array of collided objects
     */
    detectCollisionsOptimizedCollider({ x = 0, y = 0 }) {
      const arrayOfGO = [];
      const bottom = this.y + y + this.height;
      const right = this.x + x + this.width;
      this._optimizedColliders.forEach(collider => {
        if (collider.instanceID === this.instanceID) return;
        const tileBottom = collider.y + collider.height;
        const tileRight = collider.x + collider.width;
        const bCollision = Math.floor(tileBottom - this.y + y);
        const tCollision = Math.floor(bottom - collider.y);
        const lCollision = Math.floor(right - collider.x);
        const rCollision = Math.floor(tileRight - this.x + x);

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
          gameObject: collider,
        };
        if (
          this.x + x < collider.x + collider.width &&
          this.instanceID !== collider.instanceID &&
          this.x + x + this.width > collider.x &&
          this.y + y < collider.y + collider.height &&
          this.height + this.y + y > collider.y
        )
          arrayOfGO.push({
            collided: true,
            colliderInformation: {
              conditions,
              collided: true,
            },
          });
      });
      return arrayOfGO;
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
      const l = Game.__gameObjects.length;
      for (let i = 0; i < l; i += 1) {
        const otherObject = Game.__gameObjects[i];
        if (!otherObject.collider) continue;
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

    _start() {
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
      this.sprite.innerHTML = this.text;
      this.sprite.style.backgroundColor = this.backgroundColor;
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
      this.sprite.innerHTML = this.text;
      this.sprite.style.backgroundColor = this.backgroundColor;
    }

    /**
     * @description Executes before start
     */
    awake() {
      return true;
    }

    /**
     * @description Executes one time.
     */
    start() {
      return true;
    }

    /**
     * @description Executes whenever it can
     */
    update() {
      return true;
    }

    /**
     * @description Executes in a fixed time
     */
    fixedUpdate() {
      return true;
    }

    /**
     * @description Executes after all updates.
     */
    lateUpdate() {
      return true;
    }

    /**
     * @description Executes once after the first lifecycle
     */
    startAfterFirstRender() {}

    onDestroy() {}

    destroy() {
      Game.__essentialVariableToKeepTrackOfTheGreatGamesYoureCreatingMyDude.destroy(
        this,
      );
    }
  }
  document.body.style.overflowY = 'hidden';
  document.body.style.overflowX = 'hidden';
  return {
    Game,
    GameObject,
    Store,
    Input,
    Utils,
    root,
    Sound,
  };
}

const GameEngine = GameEng('#8B1E3F');
