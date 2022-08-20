(() => {
  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => {
    __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
    return value;
  };

  // js/constants/ScreenConstants.js
  var CANVAS_WIDTH = 1280;
  var CANVAS_HEIGHT = 720;
  var HORIZONTAL_TILES = 32;
  var VERTICAL_TILES = 18;
  var PIXELS_PER_TILE = 10;
  var PIXEL_WIDTH = CANVAS_WIDTH / HORIZONTAL_TILES / PIXELS_PER_TILE;
  var ON_SCREEN_CANVAS_WIDTH = 1280;
  var ON_SCREEN_CANVAS_HEIGHT = 720;
  var UI_CANVAS_WIDTH = ON_SCREEN_CANVAS_WIDTH;
  var UI_CANVAS_HEIGHT = ON_SCREEN_CANVAS_HEIGHT;
  var UI_PIXEL_WIDTH = 3;

  // js/math/Common.js
  var clamp = (x, low, high) => {
    return Math.min(high, Math.max(x, low));
  };
  var sign = (x) => {
    if (x > 0) {
      return 1;
    } else if (x === 0) {
      return 0;
    } else {
      return -1;
    }
  };

  // js/math/Vector.js
  var Vector = class {
    constructor(x, y) {
      this.x = x;
      this.y = y;
    }
    add(vector) {
      this.x += vector.x;
      this.y += vector.y;
      return this;
    }
    multiply(factor) {
      this.x *= factor;
      this.y *= factor;
      return this;
    }
    copy() {
      return new Vector(this.x, this.y);
    }
    get magnitude() {
      return Math.hypot(this.x, this.y);
    }
    static add(a, b) {
      return new Vector(a.x + b.x, a.y + b.y);
    }
    static diff(a, b) {
      return new Vector(a.x - b.x, a.y - b.y);
    }
    static scale(vector, factor) {
      return new Vector(vector.x * factor, vector.y * factor);
    }
    static sqrDist(a, b) {
      const xDiff = a.x - b.x;
      const yDiff = a.y - b.y;
      return xDiff * xDiff + yDiff * yDiff;
    }
    static manhattanDist(a, b) {
      return Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y));
    }
    static dist(a, b) {
      return Math.hypot(a.x - b.x, a.y - b.y);
    }
    static lerp(v1, v2, t) {
      return new Vector(v1.x * (1 - t) + v2.x * t, v1.y * (1 - t) + v2.y * t);
    }
  };

  // js/math/Shapes.js
  var Circle = class {
    constructor(position, radius) {
      this.position = position;
      this.radius = radius;
    }
    intersectsCircle(otherCircle) {
      const radiusSum = this.radius + otherCircle.radius;
      return Vector.sqrDist(this.position, otherCircle.position) < radiusSum * radiusSum;
    }
    intersectsVector(point) {
      return Vector.sqrDist(this.position, point) < this.radius * this.radius;
    }
    intersectsRectangle(rectangle) {
      const closestX = clamp(this.position.x, rectangle.x1, rectangle.x2);
      const closestY = clamp(this.position.y, rectangle.y1, rectangle.y2);
      return this.intersectsVector(new Vector(closestX, closestY));
    }
    isKissingBelow(rectangle) {
      return this.position.y + this.radius === rectangle.y1 && rectangle.x1 <= this.position.x && this.position.x <= rectangle.x2;
    }
    draw(canvas) {
      canvas.fillEllipse(
        this.position.x,
        this.position.y,
        this.radius,
        this.radius
      );
    }
  };
  var Rectangle = class {
    constructor(x1, y1, x2, y2) {
      this.x1 = x1;
      this.y1 = y1;
      this.x2 = x2;
      this.y2 = y2;
    }
    intersectsPoint(point) {
      return this.x1 <= point.x && point.x <= this.x2 && this.y1 <= point.y && point.y <= this.y2;
    }
    get width() {
      return this.x2 - this.x1;
    }
    get height() {
      return this.y2 - this.y1;
    }
    get midpoint() {
      return new Vector((this.x1 + this.x2) / 2, (this.y1 + this.y2) / 2);
    }
    intersectsRectangle(otherRectangle) {
      return otherRectangle.x1 <= this.x2 && this.x1 <= otherRectangle.x2 && otherRectangle.y1 <= this.y2 && this.y1 <= otherRectangle.y2;
    }
    uncollideCircle(circle) {
      const closestX = clamp(circle.position.x, this.x1, this.x2);
      const closestY = clamp(circle.position.y, this.y1, this.y2);
      const p0 = new Vector(closestX, closestY);
      const pToCenter = Vector.diff(circle.position, p0);
      const distFromCenter = pToCenter.magnitude || 1;
      if (distFromCenter >= circle.radius) {
        const circleDistToMyCenter = Vector.diff(circle.position, this.midpoint);
        const horizontalDistance = this.width / 2 - Math.abs(circleDistToMyCenter.x);
        const verticalDistance = this.height / 2 - Math.abs(circleDistToMyCenter.y);
        if (horizontalDistance < verticalDistance) {
          return new Vector(
            (horizontalDistance + circle.radius) * sign(circleDistToMyCenter.x),
            0
          );
        } else {
          return new Vector(
            0,
            (verticalDistance + circle.radius) * sign(circleDistToMyCenter.y)
          );
        }
      }
      return Vector.scale(
        pToCenter,
        (circle.radius - distFromCenter) / distFromCenter
      );
    }
    draw(canvas) {
      canvas.fillRect(this.x1, this.y1, this.width, this.height);
    }
    stroke(canvas, inset = 0) {
      canvas.strokeRectInset(this.x1, this.y1, this.width, this.height, inset);
    }
    inset(insetBy) {
      return new Rectangle(
        this.x1 + insetBy,
        this.y1 + insetBy,
        this.x2 - insetBy,
        this.y2 - insetBy
      );
    }
    static widthForm(x, y, width, height) {
      return new Rectangle(x, y, x + width, y + height);
    }
    static centerForm(x, y, width, height) {
      return new Rectangle(x - width, y - height, x + width, y + height);
    }
    static aroundPoint(point, halfWidth, halfHeight) {
      return new Rectangle(
        point.x - halfWidth,
        point.y - halfHeight,
        point.x + halfWidth,
        point.y + halfHeight
      );
    }
  };

  // js/level/ExitTrigger.js
  var ExitTrigger = class {
    constructor(collider, key, nextLevelCollider) {
      this.collider = collider;
      this.key = key;
      this.nextLevelCollider = nextLevelCollider || collider;
    }
    hasEntered(player) {
      return this.collider.intersectsPoint(player.position);
    }
    translatePlayerToNext(player) {
      return Vector.diff(
        player.position,
        new Vector(this.nextLevelCollider.x1, this.nextLevelCollider.y1)
      );
    }
  };

  // js/constants/Keys.js
  var Up = Symbol("Up");
  var Down = Symbol("Down");
  var Left = Symbol("Left");
  var Right = Symbol("Right");
  var Jump = Symbol("Jump");
  var Interact = Symbol("Interact");
  var Escape = Symbol("Escape");
  var Input = {
    Down,
    Escape,
    Interact,
    Jump,
    Left,
    Right,
    Up
  };

  // js/InputManager.js
  var KEY_MAP = {
    " ": Input.Jump,
    escape: Input.Escape,
    esc: Input.Escape,
    Escape: Input.Escape,
    Esc: Input.Escape,
    w: Input.Up,
    a: Input.Left,
    s: Input.Down,
    d: Input.Right,
    e: Input.Interact
  };
  var InputState = class {
    constructor(keyMap, mousePosition) {
      this.keyMap = keyMap;
      this.mousePosition = mousePosition;
    }
    getHorizontalAxis() {
      return +!!this.keyMap[Input.Right] - +!!this.keyMap[Input.Left];
    }
    isPressed(input) {
      return !!this.keyMap[input];
    }
    static empty() {
      return new InputState({});
    }
  };
  var InputEvent = class {
    constructor() {
    }
    isForKey() {
      return false;
    }
    isClick() {
      return false;
    }
  };
  var KeyPressEvent = class extends InputEvent {
    constructor(input) {
      super();
      this.input = input;
    }
    isForKey(key) {
      return key === this.input;
    }
  };
  var ClickEvent = class extends InputEvent {
    constructor(position, isRightClick) {
      super();
      this.position = position;
      this.isRight = isRightClick;
    }
    isClick() {
      return true;
    }
    isRightClick() {
      return this.isRight;
    }
  };
  var InputManager = class {
    constructor(listener) {
      this.isMouseDown = false;
      this.isButtonDown = {};
      this.listener = listener;
      this.mousePosition = new Vector(0, 0);
      this.canvas = document.getElementById("canvas");
    }
    init() {
      document.addEventListener("keydown", (e) => {
        if (e.repeat) {
          return;
        }
        const symbol = KEY_MAP[e.key];
        if (!symbol) {
          return;
        }
        this.isButtonDown[symbol] = true;
        if (this.listener) {
          this.listener(new KeyPressEvent(symbol));
        }
      });
      document.addEventListener("keyup", (e) => {
        const symbol = KEY_MAP[e.key];
        if (!symbol) {
          return;
        }
        this.isButtonDown[symbol] = false;
      });
      document.addEventListener("mousemove", (event) => {
        this.mousePosition = this.toCanvasPosition(event);
      });
      document.addEventListener("click", (event) => {
        this.mousePosition = this.toCanvasPosition(event);
        if (this.listener) {
          this.listener(new ClickEvent(this.mousePosition, false));
        }
      });
      document.addEventListener("contextmenu", (event) => {
        event.preventDefault();
        this.mousePosition = this.toCanvasPosition(event);
        if (this.listener) {
          this.listener(new ClickEvent(this.mousePosition, true));
        }
      });
    }
    toCanvasPosition(event) {
      return Vector.scale(
        new Vector(
          event.clientX - this.canvas.offsetLeft,
          event.clientY - this.canvas.offsetTop
        ),
        this.canvas.width / this.canvas.clientWidth * UI_CANVAS_WIDTH / ON_SCREEN_CANVAS_WIDTH
      );
    }
    getInputState() {
      return new InputState(this.isButtonDown, this.mousePosition);
    }
  };

  // js/level/LevelEvent.js
  var LevelEvent = class {
    constructor() {
    }
    isExitEvent() {
      return false;
    }
    isOpenPuzzleEvent() {
      return false;
    }
    isClosePuzzleEvent() {
      return false;
    }
  };
  var ExitEvent = class extends LevelEvent {
    constructor(exitTrigger) {
      super();
      this.exitTrigger = exitTrigger;
    }
    isExitEvent() {
      return true;
    }
  };
  var OpenPuzzleEvent = class extends LevelEvent {
    constructor(puzzleId) {
      super();
      this.puzzleId = puzzleId;
    }
    isOpenPuzzleEvent() {
      return true;
    }
  };
  var ClosePuzzleEvent = class extends LevelEvent {
    constructor(puzzleId) {
      super();
      this.puzzleId = puzzleId;
    }
    isClosePuzzleEvent() {
      return true;
    }
  };

  // js/level/Level.js
  var SCALE_FACTOR = CANVAS_WIDTH / HORIZONTAL_TILES;
  var TileImage = new Image();
  TileImage.src = "./img/tileset.png";
  var Level = class {
    constructor(key, width, height, levelGrid, objects, player, exitTriggers, interactibles) {
      this.key = key;
      this.levelGrid = levelGrid;
      this.objects = objects;
      this.player = player;
      this.exitTriggers = exitTriggers;
      this.interactibles = interactibles;
      this.width = width;
      this.height = height;
      this.camera = this.getIdealCamera();
      this.interactingWith = void 0;
      this.drawnStatic = false;
      this.playModeManager = void 0;
    }
    start(playModeManager) {
      this.drawnStatic = false;
      this.interactingWith = void 0;
      this.playModeManager = playModeManager;
    }
    emitEvent(event) {
      if (this.playModeManager) {
        this.playModeManager.onLevelEvent(event);
      }
    }
    feedPlayerInfo(previousPlayer, previousExit) {
      if (previousExit.key !== this.key) {
        console.error("Exit key mis-match");
      }
      const position = previousExit.translatePlayerToNext(previousPlayer);
      this.player.position.x = position.x;
      this.player.position.y = position.y;
      this.player.velocity = previousPlayer.velocity.copy();
      this.camera = this.getIdealCamera();
    }
    update(deltaTime, inputState) {
      this.player.update(
        deltaTime,
        this.isPlayerActive() ? inputState : InputState.empty(),
        this
      );
      this.interactibles.forEach((interactible) => {
        interactible.update(this.player.position, deltaTime);
      });
      if (!this.interactingWith?.isTriggered) {
        this.closeCurrentPuzzle();
        this.interactingWith = void 0;
      }
      this.updateCamera(deltaTime);
      this.updateExits();
    }
    isPlayerActive() {
      return !this.interactingWith;
    }
    closeCurrentPuzzle() {
      if (this.interactingWith) {
        this.emitEvent(new ClosePuzzleEvent(this.interactingWith.id));
      }
    }
    onInput(input) {
      if (this.isPlayerActive()) {
        this.player.onInput(input);
      }
      if (input.input === Input.Interact) {
        this.interactingWith = this.interactibles.find((i) => i.isTriggered);
        if (this.interactingWith) {
          this.emitEvent(new OpenPuzzleEvent(this.interactingWith.id));
        }
      } else if (input.input === Input.Escape) {
        this.closeCurrentPuzzle();
        this.interactingWith = void 0;
      }
    }
    updateExits() {
      const triggeredExit = this.exitTriggers.find(
        (trigger) => trigger.hasEntered(this.player)
      );
      if (triggeredExit) {
        this.emitEvent(new ExitEvent(triggeredExit));
      }
    }
    clampCamera(camera) {
      return new Vector(
        clamp(camera.x, 0, this.width - HORIZONTAL_TILES),
        clamp(camera.y, 0, this.height - VERTICAL_TILES)
      );
    }
    getNaiveCamera(position = this.player.position) {
      return new Vector(
        position.x - HORIZONTAL_TILES / 2,
        position.y - VERTICAL_TILES / 2
      );
    }
    getIdealCamera(position = this.player.position) {
      return this.clampCamera(this.getNaiveCamera(position));
    }
    updateCamera(deltaTime) {
      this.camera = this.clampCamera(
        Vector.lerp(
          this.camera,
          this.getNaiveCamera(
            Vector.add(
              this.player.position,
              new Vector(this.player.velocity.x * 0.3, 0)
            )
          ),
          deltaTime * 2
        )
      );
    }
    withSetupCanvas(canvas, action) {
      canvas.saveTransform();
      canvas.scale(SCALE_FACTOR, SCALE_FACTOR);
      action(canvas);
      canvas.restoreTransform();
    }
    draw(screenManager) {
      if (!this.drawnStatic) {
        this.withSetupCanvas(screenManager.staticWorldCanvas, (canvas) => {
          canvas.setColor("#6400c8");
          canvas.fillRect(0, 0, canvas.width, canvas.height);
          canvas.setColor("red");
          for (const object of this.objects) {
            object.draw(canvas);
          }
          canvas.setColor("black");
          for (let row = 0; row < this.height; row++) {
            for (let col = 0; col < this.width; col++) {
              const blockType = this.levelGrid[row][col];
              if (blockType) {
                canvas.drawImage(
                  TileImage,
                  (blockType - 1) * PIXELS_PER_TILE,
                  0,
                  PIXELS_PER_TILE,
                  PIXELS_PER_TILE,
                  col,
                  row,
                  1,
                  1
                );
              }
            }
          }
        });
        this.drawnStatic = true;
      }
      this.withSetupCanvas(screenManager.dynamicWorldCanvas, (canvas) => {
        canvas.clear();
        this.interactibles.forEach((interactible) => {
          interactible.draw(canvas);
        });
        this.player.draw(canvas);
      });
      screenManager.setCamera(
        new Vector(
          Math.floor(this.camera.x * SCALE_FACTOR),
          Math.floor(this.camera.y * SCALE_FACTOR)
        )
      );
    }
  };

  // js/level/BlockTypes.js
  var BlockType = {
    SOLID: 1,
    LEDGE: 2,
    VENT: 3,
    LADDER: 4,
    isSolid: (blockType) => {
      return blockType === BlockType.SOLID;
    },
    isGrounding: (blockType) => {
      return blockType === BlockType.SOLID || blockType === BlockType.LEDGE;
    }
  };

  // js/level/RectPool.js
  var RectPoolClass = class {
    constructor() {
      this.grid = [];
    }
    get(row, col) {
      if (!(row in this.grid)) {
        this.grid[row] = [];
      }
      if (!(col in this.grid[row])) {
        this.grid[row][col] = Rectangle.widthForm(col, row, 1, 1);
      }
      return this.grid[row][col];
    }
  };
  var RectPool = new RectPoolClass();

  // js/level/Player.js
  var PLAYER_RADIUS = 0.8;
  var PLAYER_MAX_SPEED = 16;
  var PLAYER_ACCEL = PLAYER_MAX_SPEED / 0.3;
  var PLAYER_DECEL = 2 * PLAYER_ACCEL;
  var TURN_SPEED = 1.8 * PLAYER_ACCEL;
  var JUMP_HEIGHT = 4;
  var JUMP_DURATION = 0.6;
  var PARAM_A = 4 * JUMP_HEIGHT / JUMP_DURATION;
  var JUMP_INITIAL_SPEED = PARAM_A;
  var GRAVITY = 2 * PARAM_A / JUMP_DURATION;
  var COYOTE_TIME = 0.1;
  var Player = class {
    constructor(position) {
      this.position = position;
      this.collider = new Circle(position, PLAYER_RADIUS);
      this.velocity = new Vector(0, 0);
      this.isColliding = false;
      this.isGrounded = false;
      this.isDropping = false;
      this.wantsToJump = false;
      this.inAirFor = 1;
    }
    onInput(input) {
      if (input.isForKey(Input.Jump)) {
        this.wantsToJump = true;
      }
    }
    update(deltaTime, inputState, level) {
      const getCellAt = (x2, y2) => {
        return level.levelGrid[Math.floor(y2)]?.[Math.floor(x2)];
      };
      const getRectAt = (x2, y2) => {
        const type = getCellAt(x2, y2);
        if (type) {
          return {
            type: getCellAt(x2, y2),
            rect: RectPool.get(Math.floor(y2), Math.floor(x2))
          };
        }
      };
      const inputX = inputState.getHorizontalAxis();
      const acceleration = new Vector(inputX * PLAYER_ACCEL, 0);
      if (inputState.isPressed(Input.Down)) {
        this.isDropping = true;
      }
      const playerBottom = this.position.y + this.collider.radius;
      const cellBelow = getCellAt(this.position.x, playerBottom);
      const groundingCellBelow = this.isDropping ? BlockType.isSolid(cellBelow) : BlockType.isGrounding(cellBelow);
      const gridCellWithin = getCellAt(this.position.x, this.position.y);
      const groundedOnGridCell = groundingCellBelow && playerBottom === Math.floor(playerBottom);
      this.isGrounded = groundedOnGridCell || level.objects.some((object) => this.collider.isKissingBelow(object));
      if (this.isGrounded) {
        this.inAirFor = 0;
        if (sign(inputX)) {
          if (sign(inputX) !== sign(this.velocity.x)) {
            acceleration.x += -TURN_SPEED * sign(this.velocity.x);
          }
        } else {
          acceleration.x += -Math.min(Math.abs(this.velocity.x / deltaTime), PLAYER_DECEL) * sign(this.velocity.x);
        }
        this.velocity.y = 0;
      } else {
        this.inAirFor += deltaTime;
        if (gridCellWithin === BlockType.VENT) {
          const ventMultiplier = this.velocity.y > 0 ? 0.75 : 1.1;
          acceleration.y -= GRAVITY * ventMultiplier;
        } else {
          acceleration.y += GRAVITY;
        }
      }
      if (this.inAirFor < COYOTE_TIME && this.wantsToJump) {
        this.velocity.y = -JUMP_INITIAL_SPEED;
      }
      this.velocity.add(Vector.scale(acceleration, deltaTime));
      this.velocity.x = clamp(
        this.velocity.x,
        -PLAYER_MAX_SPEED,
        PLAYER_MAX_SPEED
      );
      const step = Vector.scale(this.velocity, deltaTime);
      step.x = clamp(step.x, -PLAYER_RADIUS, PLAYER_RADIUS);
      step.y = clamp(step.y, -PLAYER_RADIUS, PLAYER_RADIUS);
      this.position.add(step);
      this.isColliding = false;
      const { x, y } = this.position;
      const nearbyBlocks = [
        getRectAt(x, y),
        getRectAt(x, y + 1),
        getRectAt(x, y - 1),
        getRectAt(x - 1, y),
        getRectAt(x + 1, y),
        getRectAt(x - 1, y - 1),
        getRectAt(x + 1, y - 1),
        getRectAt(x - 1, y + 1),
        getRectAt(x + 1, y + 1)
      ].filter((rect) => !!rect);
      let contactingAnyLedge = false;
      nearbyBlocks.forEach(({ type, rect }) => {
        const isActiveLedge = !this.isDropping && type === BlockType.LEDGE && this.velocity.y >= 0 && this.position.y < rect.y1;
        const intersects = this.collider.intersectsRectangle(rect);
        if (intersects && type === BlockType.LEDGE) {
          contactingAnyLedge = true;
          if (this.velocity.y < 0 && this.position.y >= rect.y1) {
            this.isDropping = true;
          }
        }
        if (BlockType.isSolid(type) || isActiveLedge) {
          if (intersects) {
            this.isColliding = true;
            const collidingBy = rect.uncollideCircle(this.collider);
            this.velocity.add(Vector.scale(collidingBy, 1 / deltaTime));
            if (collidingBy.x > 0 && collidingBy.y === 0) {
              this.velocity.x = Math.max(0, this.velocity.x);
            } else if (collidingBy.x < 0 && collidingBy.y === 0) {
              this.velocity.x = Math.min(0, this.velocity.x);
            }
            if (collidingBy.y > 0 && collidingBy.x === 0) {
              this.velocity.y = Math.max(0, this.velocity.y);
            } else if (collidingBy.y < 0 && collidingBy.x === 0) {
              this.velocity.y = Math.min(0, this.velocity.y);
            }
            this.position.add(collidingBy);
          }
          return this.collider.intersectsRectangle(rect);
        }
      });
      this.wantsToJump = false;
      this.isDropping = this.isDropping && contactingAnyLedge;
    }
    draw(canvas) {
      canvas.setColor("yellow");
      this.collider.draw(canvas);
    }
  };

  // js/level/LevelFactory.js
  var LevelFactory = class {
    constructor(key, iid, width, height) {
      this.key = key;
      this.iid = iid;
      this.width = width;
      this.height = height;
      this.levelGrid = [];
      this.objects = [];
      this.playerPosition = new Vector(16, 9);
      this.exitTriggers = [];
      this.interactibles = [];
      this.worldPosition = new Vector(0, 0);
    }
    addObjects(objects) {
      this.objects = this.objects.concat(objects);
      return this;
    }
    addExits(exits) {
      this.exitTriggers = this.exitTriggers.concat(exits);
      return this;
    }
    addInteractibles(is) {
      this.interactibles = this.interactibles.concat(is);
      return this;
    }
    setPlayerPos(pos) {
      this.playerPosition = pos;
      return this;
    }
    setLevelGrid(grid) {
      this.levelGrid = grid;
    }
    makeGridSpace() {
      this.levelGrid = [];
      for (let row = 0; row < this.height; row++) {
        this.levelGrid.push([]);
      }
    }
    setWorldPosition(vec) {
      this.worldPosition = vec;
    }
    setCell(row, col, blockType) {
      this.levelGrid[row][col] = blockType;
    }
    create() {
      return new Level(
        this.key,
        this.width,
        this.height,
        this.levelGrid,
        this.objects,
        new Player(this.playerPosition),
        this.exitTriggers,
        this.interactibles
      );
    }
  };

  // js/puzzle-manager/constants.js
  var OPEN_DURATION = 0.4;
  var CLOSE_DURATION = 0.25;
  var PUZZLE_WINDOW_WIDTH = 7 / 9 * UI_CANVAS_HEIGHT;
  var SOLVED_BACKGROUND = "#00ff62c8";
  var DEFAULT_BACKGROUND = "#0096ffc8";

  // js/utils/Color.js
  var HEX = 16;
  var ZERO = "0";
  var toHex = (number, digits) => {
    return number.toString(HEX).padStart(digits, ZERO);
  };

  // js/Canvas.js
  var CTX = Symbol("ctx");
  var CANVAS = Symbol("canvas");
  var Canvas = class {
    constructor(canvas) {
      if (!(canvas instanceof HTMLCanvasElement)) {
        throw Error("Invalid canvas provided!");
      }
      this[CANVAS] = canvas;
      const ctx = canvas.getContext("2d");
      ctx.imageSmoothingEnabled = false;
      if (!ctx) {
        throw Error("Unable to get 2d context");
      }
      this[CTX] = ctx;
      this[CTX].fillStyle = "black";
      this[CTX].strokeStyle = "black";
      this.width = this[CANVAS].width;
      this.height = this[CANVAS].height;
    }
    fillRect(x, y, width, height) {
      this[CTX].fillRect(x, y, width, height);
    }
    clear() {
      this[CTX].clearRect(0, 0, this.width, this.height);
    }
    strokeRect(x, y, width, height) {
      this[CTX].strokeRect(x, y, width, height);
    }
    strokeRectInset(x, y, width, height, inset) {
      this.strokeRect(
        x + inset,
        y + inset,
        width - inset * 2,
        height - inset * 2
      );
    }
    fillEllipse(x, y, width, height) {
      this[CTX].beginPath();
      this[CTX].ellipse(x, y, width, height, 0, 0, 2 * Math.PI);
      this[CTX].fill();
    }
    strokeEllipse(x, y, width, height) {
      this[CTX].beginPath();
      this[CTX].ellipse(x, y, width, height, 0, 0, 2 * Math.PI);
      this[CTX].stroke();
    }
    drawLine(x0, y0, x1, y1) {
      this[CTX].beginPath();
      this[CTX].moveTo(x0, y0);
      this[CTX].lineTo(x1, y1);
      this[CTX].stroke();
    }
    scale(xScale, yScale) {
      this[CTX].scale(xScale, yScale);
    }
    translate(xOffset, yOffset) {
      this[CTX].translate(xOffset, yOffset);
    }
    setColor(colorString) {
      if (colorString === this[CTX].fillStyle) {
        return;
      }
      this[CTX].fillStyle = colorString;
      this[CTX].strokeStyle = colorString;
    }
    setLineWidth(width) {
      this[CTX].lineWidth = width;
    }
    get lineWidth() {
      return this[CTX].lineWidth;
    }
    setLineDash(pattern) {
      this[CTX].setLineDash(pattern);
    }
    setColorRGB(red, green, blue, alpha = 255) {
      const colorString = `#${toHex(red, 2)}${toHex(green, 2)}${toHex(
        blue,
        2
      )}${toHex(alpha, 2)}`;
      this.setColor(colorString);
    }
    setColorHSLA(hue, saturation, lightness, alpha = 1) {
      const colorString = `hsla(${hue},${Math.floor(
        saturation * 100
      )}%,${Math.floor(lightness * 100)}%,${alpha})`;
      this.setColor(colorString);
    }
    saveTransform() {
      this[CTX].save();
    }
    restoreTransform() {
      this[CTX].restore();
    }
    drawImage(imageSource, sourceX, sourceY, sourceWidth, sourceHeight, destinationX, destinationY, destinationWidth, destinationHeight) {
      let image;
      if (imageSource instanceof Canvas) {
        image = imageSource[CANVAS];
      } else if (imageSource instanceof Image) {
        image = imageSource;
      } else {
        throw Error("Drawing something unmanageable");
      }
      this[CTX].drawImage(
        image,
        sourceX,
        sourceY,
        sourceWidth,
        sourceHeight,
        destinationX,
        destinationY,
        destinationWidth,
        destinationHeight
      );
    }
    static fromId(id) {
      const canvas = document.getElementById(id);
      return new Canvas(canvas);
    }
    static fromScratch(width, height) {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      return new Canvas(canvas);
    }
  };

  // js/ScreenManager.js
  var REAL_CANVAS = Symbol("real-canvas");
  function getRawCanvas() {
    const rawCanvas = document.getElementById("canvas");
    rawCanvas.setAttribute("width", ON_SCREEN_CANVAS_WIDTH);
    rawCanvas.setAttribute("height", ON_SCREEN_CANVAS_HEIGHT);
    return rawCanvas;
  }
  var _ScreenManager = class {
    constructor() {
      const screenCanvas = new Canvas(getRawCanvas());
      if (!(screenCanvas instanceof Canvas)) {
        throw Error("No canvas found!");
      }
      this[REAL_CANVAS] = screenCanvas;
      this.staticWorldCanvas = Canvas.fromScratch(
        CANVAS_WIDTH * 2,
        CANVAS_HEIGHT * 2
      );
      this.dynamicWorldCanvas = Canvas.fromScratch(
        CANVAS_WIDTH * 2,
        CANVAS_HEIGHT * 2
      );
      this.uiCanvas = Canvas.fromScratch(
        ON_SCREEN_CANVAS_WIDTH,
        ON_SCREEN_CANVAS_HEIGHT
      );
      this.camera = new Vector(0, 0);
    }
    setCamera(cameraPosition) {
      this.camera = cameraPosition;
    }
    drawToScreen() {
      this[REAL_CANVAS].drawImage(
        this.staticWorldCanvas,
        this.camera.x,
        this.camera.y,
        CANVAS_WIDTH,
        CANVAS_HEIGHT,
        0,
        0,
        this[REAL_CANVAS].width,
        this[REAL_CANVAS].height
      );
      this[REAL_CANVAS].drawImage(
        this.dynamicWorldCanvas,
        this.camera.x,
        this.camera.y,
        CANVAS_WIDTH,
        CANVAS_HEIGHT,
        0,
        0,
        this[REAL_CANVAS].width,
        this[REAL_CANVAS].height
      );
      this[REAL_CANVAS].drawImage(
        this.uiCanvas,
        0,
        0,
        UI_CANVAS_WIDTH,
        UI_CANVAS_HEIGHT,
        0,
        0,
        this[REAL_CANVAS].width,
        this[REAL_CANVAS].height
      );
    }
    static getInstance() {
      if (this.instance) {
        return this.instance;
      }
      return new _ScreenManager();
    }
  };
  var ScreenManager = _ScreenManager;
  __publicField(ScreenManager, "instance", null);

  // js/puzzle-manager/PuzzleSpaceManager.js
  var CACHE = {};
  var cacheKey = (rows, cols) => `${rows}-${cols}`;
  var produceObject = (rows, cols) => {
    const LARGER_DIR = Math.max(rows, cols);
    const WIDE_EDGE = 0.7;
    const NARROW_EDGE = 0.5;
    const CELL_SIZE = Math.floor(
      PUZZLE_WINDOW_WIDTH / (LARGER_DIR + WIDE_EDGE + NARROW_EDGE)
    );
    const NARROW_SIZE = Math.floor(CELL_SIZE * NARROW_EDGE);
    const WIDE_SIZE = PUZZLE_WINDOW_WIDTH - CELL_SIZE * LARGER_DIR - NARROW_SIZE;
    const FULL_HEIGHT = WIDE_SIZE + NARROW_SIZE + rows * CELL_SIZE;
    const FULL_WIDTH = WIDE_SIZE + NARROW_SIZE + cols * CELL_SIZE;
    const TOP_EDGE = Math.max((FULL_WIDTH - FULL_HEIGHT) / 2, 0);
    const LEFT_EDGE = Math.max((FULL_HEIGHT - FULL_WIDTH) / 2, 0);
    const xSpacing = [[LEFT_EDGE, LEFT_EDGE + NARROW_SIZE]];
    let lastX = LEFT_EDGE + NARROW_SIZE;
    for (let i = 0; i < cols; i++) {
      xSpacing.push([lastX, lastX + CELL_SIZE]);
      lastX += CELL_SIZE;
    }
    xSpacing.push([lastX, lastX + WIDE_SIZE]);
    const ySpacing = [[TOP_EDGE, TOP_EDGE + WIDE_SIZE]];
    let lastY = TOP_EDGE + WIDE_SIZE;
    for (let i = 0; i < rows; i++) {
      ySpacing.push([lastY, lastY + CELL_SIZE]);
      lastY += CELL_SIZE;
    }
    ySpacing.push([lastY, lastY + NARROW_SIZE]);
    const matrix = [];
    for (const [y1, y2] of ySpacing) {
      const thisRow = [];
      for (const [x1, x2] of xSpacing) {
        thisRow.push(new Rectangle(x1, y1, x2, y2));
      }
      matrix.push(thisRow);
    }
    return matrix;
  };
  var getObject = (rows, cols) => {
    const key = cacheKey(rows, cols);
    if (!(key in CACHE)) {
      CACHE[key] = produceObject(rows, cols);
    }
    return CACHE[key];
  };
  var positionGetter = (rows, cols) => {
    const matrix = getObject(rows, cols);
    return (row, col) => {
      return matrix[row === "end" ? rows + 1 : row + 1][col === "end" ? cols + 1 : col + 1];
    };
  };

  // js/puzzle-manager/Puzzle.js
  var PARTIAL_RADIUS = 0.4;
  var Puzzle = class {
    constructor(id, rows, columns, validator) {
      this.id = id;
      this.openCloseStatus = 0;
      this.isOpen = false;
      this.rows = rows;
      this.cols = columns;
      this.state = [];
      this.elements = [];
      this.validator = validator;
      this.isSolved = false;
      this.hasBeenSolvedEver = false;
      this.positionGetter = positionGetter(rows, columns);
      for (let row = 0; row < rows; row++) {
        const currentRow = [];
        for (let col = 0; col < columns; col++) {
          currentRow.push(null);
          this.elements.push({
            row,
            col,
            shape: this.positionGetter(row, col).inset(UI_PIXEL_WIDTH),
            isHovered: false
          });
        }
        this.state.push(currentRow);
      }
    }
    open() {
      if (this.isOpen) {
        return;
      }
      this.isOpen = true;
      this.openCloseStatus = 0;
    }
    close() {
      this.isOpen = false;
    }
    uiPosition() {
      const pos = Math.pow(1 - this.openCloseStatus, 2);
      const slideInOffset = new Vector(0, UI_CANVAS_HEIGHT * pos);
      const puzzleScreenOffset = new Vector(
        (UI_CANVAS_WIDTH - PUZZLE_WINDOW_WIDTH) / 2,
        (UI_CANVAS_HEIGHT - PUZZLE_WINDOW_WIDTH) / 2
      );
      return Vector.add(slideInOffset, puzzleScreenOffset);
    }
    draw(screenManager) {
      const canvas = screenManager.uiCanvas;
      canvas.clear();
      if (this.openCloseStatus === 0) {
        return;
      }
      const offset = this.uiPosition();
      canvas.translate(offset.x, offset.y);
      canvas.setColor(this.isSolved ? SOLVED_BACKGROUND : DEFAULT_BACKGROUND);
      canvas.fillRect(0, 0, PUZZLE_WINDOW_WIDTH, PUZZLE_WINDOW_WIDTH);
      canvas.setColor("#222222");
      canvas.fillRect(
        PUZZLE_WINDOW_WIDTH / 4,
        PUZZLE_WINDOW_WIDTH,
        PUZZLE_WINDOW_WIDTH / 2,
        PUZZLE_WINDOW_WIDTH
      );
      canvas.setLineWidth(UI_PIXEL_WIDTH * 8);
      canvas.setLineDash([]);
      canvas.strokeRectInset(
        0,
        0,
        PUZZLE_WINDOW_WIDTH,
        PUZZLE_WINDOW_WIDTH,
        -UI_PIXEL_WIDTH * 4
      );
      const LIGHT_PIXEL = UI_PIXEL_WIDTH * 8;
      if (this.isSolved) {
        canvas.setColor("white");
        canvas.fillRect(
          PUZZLE_WINDOW_WIDTH - LIGHT_PIXEL * 6,
          -LIGHT_PIXEL,
          LIGHT_PIXEL * 2,
          LIGHT_PIXEL
        );
      }
      if (this.hasBeenSolvedEver) {
        canvas.setColor("yellow");
        canvas.fillRect(
          PUZZLE_WINDOW_WIDTH - LIGHT_PIXEL * 3,
          -LIGHT_PIXEL,
          LIGHT_PIXEL * 2,
          LIGHT_PIXEL
        );
      }
      canvas.setColor("#ffffff64");
      canvas.setLineWidth(UI_PIXEL_WIDTH);
      canvas.strokeRectInset(
        0,
        0,
        PUZZLE_WINDOW_WIDTH,
        PUZZLE_WINDOW_WIDTH,
        UI_PIXEL_WIDTH / 2
      );
      for (const element of this.elements) {
        if (element.isHovered) {
          canvas.setColor("white");
        } else {
          canvas.setColor("#ffffff64");
        }
        canvas.setLineDash([]);
        element.shape.stroke(canvas, UI_PIXEL_WIDTH / 2);
        const cellState = this.state[element.row][element.col];
        const mid = element.shape.midpoint;
        if (cellState) {
          canvas.setColor("white");
          canvas.fillEllipse(
            mid.x,
            mid.y,
            element.shape.width * PARTIAL_RADIUS,
            element.shape.width * PARTIAL_RADIUS
          );
        } else if (cellState === false) {
          canvas.setColor("#ffffff64");
          canvas.setLineDash([UI_PIXEL_WIDTH * 2, UI_PIXEL_WIDTH * 2]);
          canvas.strokeEllipse(
            mid.x,
            mid.y,
            element.shape.width * PARTIAL_RADIUS,
            element.shape.width * PARTIAL_RADIUS
          );
        }
      }
      this.validator.draw(canvas, this.positionGetter);
      canvas.translate(-offset.x, -offset.y);
    }
    update(deltaTime, inputState) {
      if (this.isOpen && this.openCloseStatus < 1) {
        this.openCloseStatus += deltaTime / OPEN_DURATION;
      } else if (!this.isOpen && this.openCloseStatus > 0) {
        this.openCloseStatus -= deltaTime / CLOSE_DURATION;
      }
      this.openCloseStatus = clamp(this.openCloseStatus, 0, 1);
      if (inputState) {
        const position = Vector.diff(inputState.mousePosition, this.uiPosition());
        for (const element of this.elements) {
          element.isHovered = element.shape.intersectsPoint(position);
        }
      }
    }
    onStateChange() {
      this.isSolved = this.validator.isValid(this.state);
      if (this.isSolved) {
        this.hasBeenSolvedEver = true;
      }
    }
    onInput(input) {
      let anyChange = false;
      if (input.isClick()) {
        const clickPosition = Vector.diff(input.position, this.uiPosition());
        for (const element of this.elements) {
          element.isHovered = element.shape.intersectsPoint(clickPosition);
          if (element.isHovered) {
            const currentState = this.state[element.row][element.col];
            anyChange = true;
            let nextState = null;
            if (input.isRightClick()) {
              if (currentState === false) {
                nextState = null;
              } else {
                nextState = false;
              }
            } else {
              if (currentState === true) {
                nextState = null;
              } else {
                nextState = true;
              }
            }
            this.state[element.row][element.col] = nextState;
          }
        }
      }
      if (anyChange) {
        this.onStateChange();
      }
    }
  };

  // js/puzzle-manager/PuzzleValidation.js
  var PuzzleValidator = class {
    constructor(validationItems) {
      this.validationItems = validationItems;
    }
    isValid(state) {
      this.validationItems.forEach((item) => {
        item.validate(state);
      });
      return this.validationItems.every((item) => item.isValid);
    }
    draw(canvas, ...args) {
      this.validationItems.forEach((item) => {
        item.draw(canvas, ...args);
      });
    }
  };
  var ValidationItem = class {
    constructor() {
      this.isValid = false;
    }
    validate(state) {
    }
    draw(canvas) {
    }
  };
  var EDGE_COUNT_LAYOUT = [
    [new Circle(new Vector(0, 0), 0.33)],
    [new Circle(new Vector(0, 0), 0.33)],
    [new Circle(new Vector(0, 0.4), 0.33), new Circle(new Vector(0, -0.4), 0.33)],
    [
      new Circle(new Vector(-0.42, 0.4), 0.33),
      new Circle(new Vector(0.42, 0.4), 0.33),
      new Circle(new Vector(0, -0.4), 0.33)
    ],
    [
      new Circle(new Vector(0.4, 0.4), 0.33),
      new Circle(new Vector(0.4, -0.4), 0.33),
      new Circle(new Vector(-0.4, 0.4), 0.33),
      new Circle(new Vector(-0.4, -0.4), 0.33)
    ]
  ];
  var EDGE_GROUP_LAYOUT = [
    [Rectangle.centerForm(0, 0, 0.33, 0.33)],
    [Rectangle.centerForm(0, 0, 0.33, 0.33)],
    [
      Rectangle.centerForm(0, -0.4, 0.33, 0.33),
      Rectangle.centerForm(0, 0.4, 0.33, 0.33)
    ],
    [
      Rectangle.centerForm(0, -0.4, 0.33, 0.33),
      Rectangle.centerForm(-0.4, 0.4, 0.33, 0.33),
      Rectangle.centerForm(0.4, 0.4, 0.33, 0.33)
    ]
  ];
  var rotRight = (vector) => new Vector(-vector.y, vector.x);
  var EdgeValidationItem = class extends ValidationItem {
    constructor(isRow, index) {
      super();
      this.isRow = isRow;
      this.index = index;
      this.isValid = false;
    }
    getRelevantRow(state) {
      if (this.isRow) {
        return state[this.index];
      } else {
        return state.map((row) => row[this.index]);
      }
    }
    validateRow(row) {
      throw new TypeError("Cannot validate as a generic EdgeValidationItem");
    }
    validate(state) {
      const row = this.getRelevantRow(state);
      this.isValid = this.validateRow(row);
    }
    drawInCell(canvas, center, scaleBy, isSideways) {
      throw new TypeError("Cannot draw a generic EdgeValidationItem");
    }
    draw(canvas, positionGetter2) {
      if (this.isValid) {
        canvas.setColor("white");
      } else {
        canvas.setColor("red");
      }
      if (this.isRow) {
        const cell = positionGetter2(this.index, "end");
        this.drawInCell(canvas, cell.midpoint, cell.width / 2, true);
      } else {
        const cell = positionGetter2(-1, this.index);
        this.drawInCell(canvas, cell.midpoint, cell.height / 2, false);
      }
    }
  };
  var EdgeCountValidationItem = class extends EdgeValidationItem {
    constructor(isRow, index, count) {
      super(isRow, index);
      this.count = count;
      this.isValid = count === 0;
    }
    validateRow(row) {
      const count = row.reduce((soFar, item) => item ? soFar + 1 : soFar, 0);
      return count === this.count;
    }
    drawInCell(canvas, center, scaleBy, isSideways) {
      const transformCircle = isSideways ? (circle) => new Circle(rotRight(circle.position), circle.radius) : (v) => v;
      for (let circle of EDGE_COUNT_LAYOUT[this.count]) {
        circle = transformCircle(circle);
        const position = Vector.add(
          center,
          Vector.scale(circle.position, scaleBy)
        );
        if (this.count === 0) {
          canvas.setLineWidth(circle.radius * scaleBy * 0.5);
          canvas.strokeEllipse(
            position.x,
            position.y,
            circle.radius * scaleBy * 0.75,
            circle.radius * scaleBy * 0.75
          );
        } else {
          canvas.fillEllipse(
            position.x,
            position.y,
            circle.radius * scaleBy,
            circle.radius * scaleBy
          );
        }
      }
    }
  };
  var EdgeGroupsValidationItem = class extends EdgeCountValidationItem {
    validateRow(row) {
      const [numGroups] = row.reduce(
        ([soFar, inGroup], item) => item && !inGroup ? [soFar + 1, true] : [soFar, !!item],
        [0, false]
      );
      return numGroups === this.count;
    }
    drawSquare(canvas, position, width) {
      canvas.fillRect(
        position.x - width / 2,
        position.y - width / 2,
        width,
        width
      );
    }
    drawInCell(canvas, center, scaleBy, isSideways) {
      const moveCenter = (pos) => isSideways ? rotRight(pos) : pos;
      for (const square of EDGE_GROUP_LAYOUT[this.count]) {
        const position = Vector.add(
          center,
          Vector.scale(moveCenter(square.midpoint), scaleBy)
        );
        const width = square.width * scaleBy;
        this.drawSquare(canvas, position, width);
      }
    }
  };
  var EdgeBlankGroupsValidationItem = class extends EdgeGroupsValidationItem {
    constructor(isRow, index, count) {
      super(isRow, index, count);
      this.isValid = count === 1;
    }
    validateRow(row) {
      const [numGroups] = row.reduce(
        ([soFar, inGroup], item) => !item && inGroup ? [soFar + 1, false] : [soFar, !!item],
        [0, true]
      );
      return numGroups === this.count;
    }
    drawSquare(canvas, position, width) {
      canvas.setLineDash([]);
      canvas.setLineWidth(width * 0.25);
      canvas.strokeRectInset(position.x, position.y, 0, 0, -width * 0.4);
    }
  };
  var EdgeNoTripleValidationItem = class extends EdgeValidationItem {
    constructor(isRow, index) {
      super(isRow, index);
      this.isValid = true;
    }
    validateRow(row) {
      let count = 0;
      for (const value of row) {
        if (value) {
          count += 1;
        } else {
          count = 0;
        }
        if (count >= 3) {
          return false;
        }
      }
      return true;
    }
    drawInCell(canvas, center, scaleBy, isSideways) {
      canvas.setLineWidth(scaleBy * 0.1);
      canvas.setLineDash([]);
      canvas.fillEllipse(center.x, center.y, 0.22 * scaleBy, 0.22 * scaleBy);
      const center2 = Vector.add(
        center,
        Vector.scale(
          isSideways ? new Vector(-0.5, 0) : new Vector(0, 0.5),
          scaleBy
        )
      );
      canvas.fillEllipse(center2.x, center2.y, 0.22 * scaleBy, 0.22 * scaleBy);
      const center3 = Vector.add(center, Vector.diff(center, center2));
      const radius = scaleBy * 0.22;
      canvas.drawLine(
        center3.x - radius,
        center3.y - radius,
        center3.x + radius,
        center3.y + radius
      );
      canvas.drawLine(
        center3.x - radius,
        center3.y + radius,
        center3.x + radius,
        center3.y - radius
      );
    }
  };
  var PuzzleValidatorFactory = class {
    constructor() {
      this.validationItems = [];
    }
    addEdgeValidators(nums, isRow, ValidationItemType = EdgeCountValidationItem) {
      nums.forEach((num, index) => {
        if (typeof num !== "number") {
          return;
        }
        this.validationItems.push(new ValidationItemType(isRow, index, num));
      });
    }
    addColumnCounts(nums) {
      this.addEdgeValidators(nums, false);
      return this;
    }
    addRowCounts(nums) {
      this.addEdgeValidators(nums, true);
      return this;
    }
    addColumnGroups(nums) {
      this.addEdgeValidators(nums, false, EdgeGroupsValidationItem);
      return this;
    }
    addRowGroups(nums) {
      this.addEdgeValidators(nums, true, EdgeGroupsValidationItem);
      return this;
    }
    addColumnBlankGroups(nums) {
      this.addEdgeValidators(nums, false, EdgeBlankGroupsValidationItem);
      return this;
    }
    addRowBlankGroups(nums) {
      this.addEdgeValidators(nums, true, EdgeBlankGroupsValidationItem);
      return this;
    }
    addColumnNoTriple(yeses) {
      yeses.forEach((bool, index) => {
        if (!bool) {
          return;
        }
        this.validationItems.push(new EdgeNoTripleValidationItem(false, index));
      });
    }
    addRowNoTriple(yeses) {
      yeses.forEach((bool, index) => {
        if (!bool) {
          return;
        }
        this.validationItems.push(new EdgeNoTripleValidationItem(true, index));
      });
    }
    create() {
      return new PuzzleValidator(this.validationItems);
    }
  };

  // js/puzzle-manager/PuzzleManager.js
  function puzzleRules(id) {
    if (id === "1") {
      return new PuzzleValidatorFactory().addColumnCounts([1, 3, 1]).addRowCounts([2, 2, 1]).create();
    } else if (id === "2") {
      return new PuzzleValidatorFactory().addColumnCounts([4, 3, 2, 1]).addRowCounts([1, 2, 3, 4]).create();
    } else if (id === "3") {
      return new PuzzleValidatorFactory().addColumnCounts([1, 1, 1]).addRowCounts([1, 1, 1]).create();
    } else if (id === "4") {
      return new PuzzleValidatorFactory().addRowCounts([4, 3, null]).addColumnGroups([1, null, null, 2]).create();
    } else {
      console.error("Cannot find puzzle with id", id);
    }
    return new PuzzleValidatorFactory().create();
  }
  function makePuzzle(id) {
    const rules = puzzleRules(id);
    if (id === "1") {
      return new Puzzle(id, 3, 3, rules);
    } else if (id === "2") {
      return new Puzzle(id, 4, 4, rules);
    } else if (id === "3") {
      return new Puzzle(id, 3, 3, rules);
    } else if (id === "4") {
      return new Puzzle(id, 3, 4, rules);
    } else {
      console.error("Cannot find puzzle with id", id);
    }
  }
  var PuzzleManagerInstance = class {
    constructor() {
      this.puzzleMap = {};
    }
    loadPuzzle(id) {
      return makePuzzle(id);
    }
    getPuzzle(id) {
      if (id in this.puzzleMap) {
        return this.puzzleMap[id];
      }
      const puzzle = this.loadPuzzle(id);
      this.puzzleMap[id] = puzzle;
      return puzzle;
    }
  };
  var PuzzleManager = new PuzzleManagerInstance();

  // js/level/PuzzleInteractible.js
  var PuzzleInteractible = class {
    constructor(id, position, area) {
      this.id = id;
      this.position = position;
      this.area = area;
      this.isTriggered = false;
      this.puzzle = PuzzleManager.getPuzzle(this.id);
    }
    update(playerPosition, deltaTime) {
      this.isTriggered = this.area.intersectsPoint(playerPosition);
    }
    draw(canvas) {
      if (false) {
        canvas.setColorRGB(255, 255, 255);
        canvas.setLineWidth(0.1);
        canvas.setLineDash([0.2, 0.2]);
        canvas.strokeRect(
          this.area.x1,
          this.area.y1,
          this.area.width,
          this.area.height
        );
      }
      const SCREEN_W = 1;
      const PIXEL_SCALE = 1 / PIXELS_PER_TILE;
      canvas.setColorRGB(0, 0, 0);
      canvas.fillRect(
        this.position.x - SCREEN_W / 2,
        this.position.y + SCREEN_W,
        SCREEN_W,
        2
      );
      canvas.setLineWidth(PIXEL_SCALE);
      if (this.isTriggered) {
        canvas.setColorRGB(255, 255, 255, 128);
        canvas.strokeRectInset(
          this.position.x,
          this.position.y,
          0,
          0,
          -SCREEN_W - PIXEL_SCALE * 1.5
        );
      }
      canvas.setColorRGB(0, 0, 0);
      canvas.strokeRectInset(
        this.position.x,
        this.position.y,
        0,
        0,
        -SCREEN_W - PIXEL_SCALE / 2
      );
      if (this.puzzle.isSolved) {
        canvas.setColor("white");
        canvas.fillRect(
          this.position.x + SCREEN_W - 6 * PIXEL_SCALE,
          this.position.y - SCREEN_W - 1 * PIXEL_SCALE,
          PIXEL_SCALE * 2,
          PIXEL_SCALE * 1
        );
      }
      if (this.puzzle.hasBeenSolvedEver) {
        canvas.setColor("yellow");
        canvas.fillRect(
          this.position.x + SCREEN_W - 3 * PIXEL_SCALE,
          this.position.y - SCREEN_W - 1 * PIXEL_SCALE,
          PIXEL_SCALE * 2,
          PIXEL_SCALE * 1
        );
      }
      canvas.setColor(
        this.puzzle.isSolved ? SOLVED_BACKGROUND : DEFAULT_BACKGROUND
      );
      canvas.fillRect(
        this.position.x - SCREEN_W,
        this.position.y - SCREEN_W,
        SCREEN_W * 2,
        SCREEN_W * 2
      );
      const offset = new Vector(
        this.position.x - SCREEN_W,
        this.position.y - SCREEN_W
      );
      canvas.translate(offset.x, offset.y);
      canvas.setColor("white");
      const rows = this.puzzle.state;
      const PAD = PIXEL_SCALE;
      for (let row = 0; row < rows.length; row++) {
        for (let col = 0; col < rows[row].length; col++) {
          if (rows[row][col]) {
            canvas.fillRect(
              PAD + col * 2 * (SCREEN_W - PAD) / rows[row].length,
              PAD + row * 2 * (SCREEN_W - PAD) / rows.length,
              PIXEL_SCALE * 2,
              PIXEL_SCALE * 2
            );
          }
        }
      }
      canvas.translate(-offset.x, -offset.y);
    }
  };

  // js/level/DataLoader.js
  var LEVEL_DATA_URL = "./data/world.json";
  function loadJson(file) {
    return fetch(file).then((data) => data.json());
  }
  function find(list, iden) {
    return list.find((item) => item.__identifier === iden);
  }
  function findLayer(level, key) {
    return find(level.layerInstances, key);
  }
  function pxToTile(num) {
    return Math.floor(num / PIXELS_PER_TILE);
  }
  function srcToBlockType(src) {
    return pxToTile(src[0]) + 1;
  }
  function firstPass(level) {
    const factory = new LevelFactory(
      level.identifier,
      level.iid,
      pxToTile(level.pxWid),
      pxToTile(level.pxHei)
    );
    factory.makeGridSpace();
    const solidLayer = findLayer(level, "Solid");
    for (const cell of solidLayer.gridTiles) {
      const col = pxToTile(cell.px[0]);
      const row = pxToTile(cell.px[1]);
      const blockType = srcToBlockType(cell.src);
      factory.setCell(row, col, blockType);
    }
    let setStartPos = false;
    const entityLayer = findLayer(level, "EntityLayer");
    entityLayer.entityInstances.forEach((entity) => {
      switch (entity.__identifier) {
        case "PlayerStart":
          factory.setPlayerPos(new Vector(entity.__grid[0], entity.__grid[1]));
          setStartPos = true;
          break;
        case "PuzzleScreen":
          const key = find(entity.fieldInstances, "key");
          if (!key) {
            console.warn("Puzzle with no key in:", level.identifier);
          }
          const center = new Vector(entity.__grid[0] + 2, entity.__grid[1] + 2);
          factory.addInteractibles([
            new PuzzleInteractible(
              key.__value,
              center,
              Rectangle.aroundPoint(center, 2, 2)
            )
          ]);
          break;
        default:
          console.warn("Processing unknown entity type:", entity.__identifier);
      }
    });
    if (!setStartPos) {
      console.warn(`Level ${level.identifier} is missing a PlayerStart`);
    }
    factory.setWorldPosition(
      new Vector(pxToTile(level.worldX), pxToTile(level.worldY))
    );
    return factory;
  }
  function secondPass(level, others) {
    const factory = others[level.iid];
    for (const neighbourInfo of level.__neighbours) {
      const nId = neighbourInfo.levelIid;
      const neighbour = others[nId];
      const topLeft = Vector.diff(neighbour.worldPosition, factory.worldPosition);
      const nextCollider = Rectangle.widthForm(
        topLeft.x,
        topLeft.y,
        neighbour.width,
        neighbour.height
      );
      factory.addExits([
        new ExitTrigger(nextCollider, neighbour.key, nextCollider)
      ]);
    }
    return factory.create();
  }
  var _DataLoader = class {
    static start() {
      return loadJson(LEVEL_DATA_URL).then((data) => {
        _DataLoader.data = data;
        const basicMap = {};
        data.levels.forEach((level) => {
          const basicData = firstPass(level);
          basicMap[basicData.iid] = basicData;
          basicMap[basicData.key] = basicData;
        });
        data.levels.forEach((rawLevel) => {
          const level = secondPass(rawLevel, basicMap);
          _DataLoader.levelMap[level.key] = level;
        });
      }).then(() => void 0);
    }
    static getLevel(key) {
      return _DataLoader.levelMap[key];
    }
  };
  var DataLoader = _DataLoader;
  __publicField(DataLoader, "hasLoaded", false);
  __publicField(DataLoader, "data", null);
  __publicField(DataLoader, "levelMap", {});

  // js/level/LevelManager.js
  var LevelManager = class {
    constructor() {
      const key = "Level_0";
      this.levelMap = {};
      this.currentLevel = DataLoader.getLevel(key);
      this.levelMap[key] = this.currentLevel;
    }
    getInitialLevel() {
      return this.currentLevel;
    }
    getLevel(key, previousExit) {
      const nextLevel = this.levelMap[key] || DataLoader.getLevel(key);
      nextLevel.feedPlayerInfo(this.currentLevel.player, previousExit);
      this.currentLevel = nextLevel;
      this.levelMap[key] = nextLevel;
      return nextLevel;
    }
  };

  // js/game-modes/PlayMode.js
  var PlayMode = class {
    constructor() {
      this.levelManager = new LevelManager();
      this.startLevel(this.levelManager.getInitialLevel());
      this.puzzleManager = PuzzleManager;
      this.currentPuzzle = void 0;
    }
    startLevel(level) {
      this.currentLevel = level;
      level.start(this);
    }
    onLevelEvent(event) {
      if (event.isExitEvent()) {
        const exitTrigger = event.exitTrigger;
        this.startLevel(this.levelManager.getLevel(exitTrigger.key, exitTrigger));
      } else if (event.isOpenPuzzleEvent()) {
        this.currentPuzzle = this.puzzleManager.getPuzzle(event.puzzleId);
        this.currentPuzzle.open();
      } else if (event.isClosePuzzleEvent()) {
        this.currentPuzzle?.close();
      }
    }
    update(deltaTime, inputState) {
      this.currentLevel.update(deltaTime, inputState);
      this.currentPuzzle?.update(deltaTime, inputState);
    }
    onInput(input) {
      this.currentLevel.onInput(input);
      this.currentPuzzle?.onInput(input);
    }
    draw(screenManager) {
      this.currentLevel.draw(screenManager);
      this.currentPuzzle?.draw(screenManager);
    }
  };

  // js/GameModeManager.js
  var GameModeManager = class {
    constructor() {
      this.playMode = new PlayMode();
      this.currentMode = this.playMode;
    }
    update(deltaTime, inputState) {
      this.currentMode.update(deltaTime, inputState);
    }
    onInput(input) {
      this.currentMode.onInput(input);
    }
    draw(screenManager) {
      this.currentMode.draw(screenManager);
    }
  };

  // js/App.js
  var MAX_FRAME_TIME = 1 / 20;
  var App = class {
    constructor() {
      this.screenManager = ScreenManager.getInstance();
      this.gameModeManager = new GameModeManager();
      this.inputManager = new InputManager((input) => this.onInput(input));
    }
    start() {
      this.inputManager.init();
      this.lastFrameTime = performance.now();
      requestAnimationFrame(() => this.mainLoop());
    }
    onInput(input) {
      this.gameModeManager.onInput(input);
    }
    mainLoop() {
      const now = performance.now();
      const deltaTime = Math.min(
        (now - this.lastFrameTime) / 1e3,
        MAX_FRAME_TIME
      );
      this.gameModeManager.update(deltaTime, this.inputManager.getInputState());
      this.gameModeManager.draw(this.screenManager);
      this.screenManager.drawToScreen();
      requestAnimationFrame(() => this.mainLoop());
      this.lastFrameTime = now;
    }
  };
  var main = () => {
    const loading = DataLoader.start();
    loading.then(() => {
      const app = new App();
      app.start();
      window.app = app;
    });
    if (!location.href.includes("localhost")) {
      Array.from(document.getElementsByTagName("p")).forEach(
        (tag) => tag.classList.add("visible")
      );
    }
  };
  window.onload = () => {
    main();
  };
})();
