const SPACE_CODE = 32;

const DIRECTIONS = {
    UP: 38,
    DOWN: 40,
    LEFT: 37,
    RIGHT: 39,
};

const GRID_CLASSES = {
    BOUNDARY: 'boundary',
    SNAKE_HEAD: 'snake-head',
    SNAKE_BODY: 'snake-body',
    FOOD: 'food',
};

let settings = {
    maxX: 12,
    maxY: 12,
    interval: 150,
};

class Boundary {
    constructor(maxX, maxY) {
        /**
         * @type {Position[]}
         */
        this.positions = [];
        for (let x = 0; x < maxX; x++) {
            for (let y = 0; y < maxY; y++) {
                if ((x === 0 || x === (maxX - 1))
                    || (y === 0 || y === (maxY - 1))) {
                    this.positions.push(new Position(x, y));
                }
            }
        }
    }
}

class Position {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    /**
     * @param {number} maxX
     * @param {number} maxY
     * @param {Position[]} takenGrids
     * @param {number} minX
     * @param {number} minY
     * @returns {Position}
     */
    static RandomlyGenerate(maxX, maxY, takenGrids = [], minX = 0, minY = 0) {
        let availableGrids = [];
        for (let x = minX; x < maxX; x++) {
            for (let y = minY; y < maxY; y++) {
                let notExists = takenGrids.find(element => element.x === x && element.y === y) === undefined;
                if (notExists) {
                    availableGrids.push(new Position(x, y));
                }
            }
        }
        return availableGrids[Math.floor(Math.random() * availableGrids.length)];
    }
}

class Movement extends Position {
    constructor(direction) {
        switch (direction) {
            case DIRECTIONS.UP:
                super(0, -1);
                break;
            case DIRECTIONS.DOWN:
                super(0, 1);
                break;
            case DIRECTIONS.LEFT:
                super(-1, 0);
                break;
            case DIRECTIONS.RIGHT:
                super(1, 0);
                break;
        }
    }
}

class Snake {
    /**
     * @param {Position} position
     * @param {number} direction
     */
    constructor(position, direction) {
        /**
         * @type {Position[]}
         */
        this.positions = [];
        this.positions.push(position);
        this.direction = direction;
        this.requestedDirection = direction;
        /**
         * 紀錄移動前身體最後的位置，當吃到食物後用來加入的座標
         * @type {Position}
         */
        this.previousTail = null;
    }

    Move() {
        let movement = new Movement(this.direction);
        let head = new Position(this.GetHeadPosition().x + movement.x, this.GetHeadPosition().y + movement.y);
        this.positions.unshift(head);
        this.previousTail = this.positions.pop();
    }

    RequestTurn(direction) {
        this.requestedDirection = direction;
    }

    Turn() {
        if (this.requestedDirection === this.direction) {
            return;
        }
        let currentMovement = new Movement(this.direction);
        let requestedMovement = new Movement(this.requestedDirection);

        if ((currentMovement.x + requestedMovement.x) === 0
            && (currentMovement.y + requestedMovement.y) === 0) {
            return;
        }

        this.direction = this.requestedDirection;
    }

    Grow() {
        this.positions.push(this.previousTail);
        this.previousTail = null;
    }

    GetHeadPosition() {
        return this.positions[0];
    }

    GetBodyPositions() {
        return this.positions.slice(1);
    }
}

class Food {
    constructor(position) {
        this.position = position;
    }
}

class Renderer {
    /**
     * @param {number} maxX
     * @param {number} maxY
     * @param {Snake} snake
     * @param {Food} food
     * @param {Boundary} boundary
     */
    constructor(maxX, maxY, snake, food, boundary) {
        this.maxX = maxX;
        this.maxY = maxY;
        this.snake = snake;
        this.food = food;
        this.boundary = boundary;
    }

    Initialize() {
        let canvas = $('#canvas');
        canvas.html('');

        for (let y = 0; y < this.maxY; y++) {
            canvas.append(`<tr id='y-${y}'>`);
            let row = canvas.find(`#y-${y}`);
            for (let x = 0; x < this.maxX; x++) {
                row.append(`<td id='${x}-${y}' class='grid'></td>`);
            }
            canvas.append('</tr>');
        }

        for (let position of this.boundary.positions) {
            this.paintGrids(position, GRID_CLASSES.BOUNDARY);
        }

        this.Render();
    }

    Render() {
        $('#canvas .grid').removeClass(['snake-head', 'snake-body', 'food']);

        this.paintGrids(this.snake.GetHeadPosition(), GRID_CLASSES.SNAKE_HEAD);

        for (let position of this.snake.GetBodyPositions()) {
            this.paintGrids(position, GRID_CLASSES.SNAKE_BODY);
        }

        this.paintGrids(this.food.position, GRID_CLASSES.FOOD);
    }

    paintGrids(position, className) {
        $(`#${position.x}-${position.y}`).addClass(className);
    }
}

class CollisionDetector {
    /**
     * @param {Snake} snake
     * @param {Food} food
     * @param {Boundary} boundary
     */
    constructor(snake, food, boundary) {
        this.snake = snake;
        this.food = food;
        this.boundary = boundary;
    }

    /**
     * @returns {boolean}
     */
    IsSnakeGotFood() {
        return this.snake.GetHeadPosition().x === this.food.position.x
            && this.snake.GetHeadPosition().y === this.food.position.y;
    }

    /**
     * @returns {boolean}
     */
    IsSnakeHitBoundary() {
        return this.boundary.positions.find(p => p.x === this.snake.GetHeadPosition().x && p.y === this.snake.GetHeadPosition().y) !== undefined;
    }

    /**
     * @returns {boolean}
     */
    IsSnakeHitSelf() {
        return this.snake.GetBodyPositions().find(p => p.x === this.snake.GetHeadPosition().x && p.y === this.snake.GetHeadPosition().y) !== undefined;
    }
}

class GameManager {
    constructor() {
        /**
         * @type {function[]}
         */
        this.onGameStatusChangedCallbacks = [];
    }

    /**
     * @param {object} settings
     */
    NewGame(settings) {
        this.setGameStatus(false);
        this.settings = settings;
        this.boundary = new Boundary(this.settings.maxX, this.settings.maxY);
        this.snake = new Snake(new Position(3, 3), DIRECTIONS.RIGHT);
        this.food = this.generateFood();
        this.render = new Renderer(this.settings.maxX, this.settings.maxY, this.snake, this.food, this.boundary);
        this.collisionDetector = new CollisionDetector(this.snake, this.food, this.boundary);

        this.render.Initialize();
    }

    Start() {
        this.setGameStatus(true);
        this.render.Render();
        let m = this;
        let tick = setInterval(function () {
            m.snake.Turn();
            m.snake.Move();

            if (m.collisionDetector.IsSnakeHitBoundary() || m.collisionDetector.IsSnakeHitSelf()) {
                clearInterval(tick);
                alert("弱豹惹辣! σ`∀´)σ ");
                m.NewGame(m.settings);
                m.setGameStatus(false);
                return;
            }

            if (m.collisionDetector.IsSnakeGotFood()) {
                m.snake.Grow();
                m.food = m.generateFood();
                m.collisionDetector.food = m.food;
                m.render.food = m.food;
            }

            m.render.Render();
        }, this.settings.interval);
    }

    /**
     * @param {function} callback
     */
    RegisterGameStatusChangeEvent(callback) {
        this.onGameStatusChangedCallbacks.push(callback);
    }

    /**
     * @returns {Food}
     */
    generateFood() {
        return new Food(Position.RandomlyGenerate(this.settings.maxX, this.settings.maxY, this.getTakenGrids(), 3, 3));
    }

    /**
     * @param {boolean} isStarted
     */
    setGameStatus(isStarted) {
        this.isStarted = isStarted;
        for (const i in this.onGameStatusChangedCallbacks) {
            this.onGameStatusChangedCallbacks[i](this.isStarted);
        }
    }

    /**
     * @returns {Position[]}
     */
    getTakenGrids() {
        let takenGrid = [];
        if (this.boundary) {
            takenGrid = takenGrid.concat(this.boundary.positions);
        }
        if (this.snake) {
            takenGrid = takenGrid.concat(this.snake.positions);
        }
        if (this.food) {
            takenGrid = takenGrid.concat([this.food.position]);
        }
        return takenGrid;
    }
}

$(document).ready(function () {
    /**
     * @param {boolean} isGameStarted
     */
    function setUIStatus(isGameStarted) {
        if (isGameStarted) {
            $('.disabled-on-gaming').attr('disabled', 'disabled');
        } else {
            $('.disabled-on-gaming').removeAttr('disabled');
        }
    }

    let manager = new GameManager();

    manager.RegisterGameStatusChangeEvent(setUIStatus);

    $('.size').on('click', function () {
        settings.maxX = $(this).data('size');
        settings.maxY = $(this).data('size');
        $(this).addClass('btn-info').siblings('.size').addClass('btn-secondary').removeClass('btn-info');
        manager.NewGame(settings);
    });

    $('.interval').on('click', function () {
        settings.interval = $(this).data('interval');
        $(this).addClass('btn-info').siblings('.interval').addClass('btn-secondary').removeClass('btn-info');
        manager.NewGame(settings);
    });

    $(document).keydown(function (event) {
        if (Object.values(DIRECTIONS).includes(event.keyCode)) {
            manager.snake.RequestTurn(event.keyCode);
        } else if (!manager.isStarted && event.keyCode === SPACE_CODE) {
            manager.Start();
        }
    });

    manager.NewGame(settings);

    $('#start-btn').on('click', function () {
        manager.Start();
    });
});


