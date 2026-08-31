const canvas = document.getElementById('game'); // width and height are 600
const ctx = canvas.getContext('2d')

const infiniteCheckbox = document.getElementById('infinite-mode-checkbox');
const gameDeaths = document.getElementById('game-deaths');
const deathCount = document.getElementById('death-count');
const scoreCount = document.getElementById('score-count');

const gridSize = 30;
const cellSize = canvas.width / gridSize;

const snakeColor = 'hsl(155, 98%, 50%)';
const foodColor = 'hsl(10, 96%, 53%)';

let snake = [
        {x: 14, y: 26},
        {x: 14, y: 27},
        {x: 14, y: 28}
    ];
let foodGridXY = randFoodGrid();
let score = 0;
let isRunning = false;
let gameOver = false;
let currentDir = '';
let pendingDir = 'ArrowUp';

let lastTime = 0;
let accumulator = 0;
let stepMs = 55;

const dirs = {
    'ArrowLeft': {x: -1, y: 0},
    'ArrowUp': {x: 0, y: -1},
    'ArrowRight': {x: 1, y: 0},
    'ArrowDown': {x: 0, y: 1}
}


window.addEventListener('keydown', e => {
    const keyPressed = e.key;
    if (keyPressed === 'r') {
        resetGame()
    }
    else if (Object.keys(dirs).includes(keyPressed)) {
        const oppositeDirs = {
            'ArrowLeft': 'ArrowRight',
            'ArrowUp': 'ArrowDown',
            'ArrowRight': 'ArrowLeft',
            'ArrowDown': 'ArrowUp'
        };
        if (currentDir !== oppositeDirs[keyPressed]) {
            pendingDir = keyPressed;
        }
    }
    else if (keyPressed === ' ' && !isRunning) {
        accumulator = 0;
        lastTime = performance.now();
        isRunning = true;
    }
    else {
        //do nothing
    }
})

function resetGame() {
    accumulator = 0;
    lastTime = performance.now();
    score = 0;
    currentDir = '';
    pendingDir = 'ArrowUp';
    gameOver = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    snake = [
        {x: 14, y: 26},
        {x: 14, y: 27},
        {x: 14, y: 28}
    ];
    foodGridXY = randFoodGrid();
    requestAnimationFrame(drawGame)
}

function toggleDeathCount(isInfinite) {
    if (isInfinite) {
        gameDeaths.classList.remove('hidden');
        gameDeaths.classList.add('visible');
    }
    else {
        if (gameDeaths.classList.contains('visible')) {
            gameDeaths.classList.remove('visible')
        }
        gameDeaths.classList.add('hidden')
    }
}

function checkCollision(head) {
    const sidesCollision = head.x * cellSize >= canvas.width || head.x * cellSize < 0;
    const upDownCollision = head.y * cellSize >= canvas.height || head.y * cellSize < 0;
    let bodyCollision = false;
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            bodyCollision = true;
            break;
        }
    }
    if (sidesCollision || upDownCollision || bodyCollision) {
        if (infiniteCheckbox.checked) {
            const currentDeathCount = Number(deathCount.textContent);
            deathCount.textContent = currentDeathCount + 1;
            resetGame();
        }
        else {
            gameOver = true;
        }
    }
}

function randFoodGrid() {
    let isOverlapping = true;
    let fruitGridX;
    let fruitGridY;
    while (isOverlapping) {
        const gridX = Math.floor(Math.random() * gridSize);
        const gridY = Math.floor(Math.random() * gridSize);
        const gridCheck = snake.some((part) => gridX === part.x && gridY === part.y);
        if (gridCheck) {
            continue;
        }
        else {
            fruitGridX = gridX;
            fruitGridY = gridY;
            isOverlapping = false;
        }
    }
    return {x: fruitGridX, y: fruitGridY}
}

function drawStartScreen() {
    ctx.fillStyle = '#041f1f';
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.font = '29px monospace'
    ctx.fillStyle = 'whitesmoke';
    ctx.fillText('Press space to start', canvas.width / 4, canvas.height / 2)
}

function drawGameOver() {
    ctx.fillStyle = 'rgb(0, 0, 0, 0.3)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = '60px monospace'
    ctx.fillStyle = 'whitesmoke';
    ctx.fillText('Game Over', canvas.width / 4, canvas.height / 2)

    ctx.font = '20px monospace';
    ctx.fillStyle = 'whitesmoke';
    ctx.fillText('Press (r) to restart', 190, 330)
}

function drawScore(score) {
    const currentBestScore = Number(scoreCount.textContent);
    if (score > currentBestScore) {
        scoreCount.textContent = score;
    }
    ctx.font = '20px Consolas';
    ctx.fillStyle = 'whitesmoke';
    ctx.fillText(`Score: ${score}`, 3, 15);
}

function drawFood(coords) {
    const x = coords.x * cellSize;
    const y = coords.y * cellSize
    ctx.fillStyle = foodColor;
    ctx.fillRect(x, y, cellSize, cellSize);
}

function drawSnake(coords) {
    const x = coords.x * cellSize;
    const y = coords.y * cellSize
    ctx.fillStyle = snakeColor;
    ctx.fillRect(x, y, cellSize, cellSize);
}

function step() {
    currentDir = pendingDir;
    const head = snake[0];
    const newHead = {x: head.x + dirs[currentDir].x, y: head.y + dirs[currentDir].y}
    snake.unshift(newHead);

    if (newHead.x === foodGridXY.x && newHead.y === foodGridXY.y) {
        score += 1;
        foodGridXY = randFoodGrid();
    }
    else {
        snake.pop()
    }

    checkCollision(newHead);
}

function drawGame(now) {
    toggleDeathCount(infiniteCheckbox.checked);
    const delta = now - lastTime;
    lastTime = now;
    accumulator += delta;
    
    if (!isRunning) {
        drawStartScreen();
    }
    else if (isRunning && !gameOver) {
        while (accumulator >= stepMs) {
            step();
            accumulator -= stepMs;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = '#041f1f'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        for (let i = 0; i < snake.length; i++) {
            drawSnake({x: snake[i].x, y: snake[i].y});
        };
        drawFood(foodGridXY);
        drawScore(score);
    }
    else if (gameOver) {
        drawGameOver();
    }
    requestAnimationFrame(drawGame)
}
requestAnimationFrame(drawGame)