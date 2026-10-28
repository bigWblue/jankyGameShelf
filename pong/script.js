const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d')

const paddleBounceSound = new Audio('./assets/paddleBounce.mp3');
const playerScoreSound = new Audio('./assets/playerScores.wav');
const computerScoreSound = new Audio('./assets/computerScores.wav');

const startBtn = document.getElementById('start-btn');

const gridSize = 40;
const cellSize = canvas.width / gridSize;

const paddleWidth = cellSize;
const paddleHeight = cellSize * 4;
const paddleOffset = 2;

const paddleSpeed = 7;
const ballSpeed = 10;

let playerScore = 0;
let computerScore = 0;

const paddle1 = {
    color: 'silver',
    size: {width: paddleWidth, height: paddleHeight},
    position: {x: paddleOffset * cellSize, y: canvas.height / 2 - (paddleHeight / 2)},
    dy: 0
}

const paddle2 = {
    color: 'silver',
    size: {width: paddleWidth, height: paddleHeight},
    position: {
        x: canvas.width - paddleOffset * cellSize - paddleWidth,
        y: canvas.height / 2 - (paddleHeight / 2)
    },
    dy: 0
}

const ball = {
    color: 'orange',
    size: {width: cellSize, height: cellSize},
    position: {x: canvas.width / 2 - (cellSize / 2), y: canvas.height / 2 - (cellSize / 2)},
    velocity: {x: ballSpeed, y: 0}
};

function drawStartScreen() {
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = '200px Arial Black';
    ctx.fillStyle = 'whitesmoke';
    ctx.fillText('PONG', canvas.width / 8, canvas.height / 2)
}

function drawField() {
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#4c4c4b';
    ctx.fillRect((canvas.width / 2) - cellSize / 4, 0, cellSize / 2, canvas.height);
}

function drawBall() {
    ctx.fillStyle = ball.color;
    ctx.fillRect(ball.position.x, ball.position.y, ball.size.width, ball.size.height);
}

function resetGame() {
    startBtn.classList.add('hidden');

    playerScore = 0;
    computerScore = 0;

    resetBall();
    paddle1.position.y = canvas.height / 2 - (paddleHeight / 2);
    paddle1.dy = 0;
    paddle2.position.y = canvas.height / 2 - (paddleHeight / 2);
    paddle2.dy = 0;
    requestAnimationFrame(drawGame);
}

function resetBall() {
    ball.position.x = canvas.width / 2 - (cellSize / 2);
    ball.position.y = canvas.height / 2 - (cellSize / 2);

    ball.velocity.x = 0;
    ball.velocity.y = 0;

    setTimeout(() => {
        ball.velocity.x = Math.random() > 0.5 ? ballSpeed * 1 : ballSpeed * -1;
    }, 800);
}

function drawPaddle(paddle) {
    ctx.fillStyle = paddle.color;
    ctx.fillRect(paddle.position.x, paddle.position.y, paddle.size.width, paddle.size.height);
}

function drawScore() {
    ctx.font = '50px monospace';
    ctx.fillStyle = 'whitesmoke';
    ctx.fillText(`${playerScore}`, (canvas.width / 2) - cellSize * 2, 40);

    ctx.font = '50px monospace';
    ctx.fillStyle = 'whitesmoke';
    ctx.fillText(`${computerScore}`, (canvas.width / 2) + cellSize, 40);
}

function handleVictory() {
    if (playerScore === 10 || computerScore === 10) {
        startBtn.classList.remove('hidden');
        startBtn.textContent = 'Play again';
        ctx.fillStyle = '#0a0a0a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        let victoryText = ' wins!';
        if (playerScore === 10) {
            victoryText = 'Player' + victoryText;
        } else if (computerScore === 10) {
            victoryText = 'Computer' + victoryText;
        }

        ctx.font = '80px monospace';
        ctx.fillStyle = 'white';
        ctx.fillText(`${victoryText}`, canvas.width / 8, canvas.height / 2)
        return true
    }
}

function handleBounce(paddle, direction) {
    const paddleCenter = paddle.position.y + paddleHeight / 2;
    const ballCenter = ball.position.y + ball.size.height / 2;
    
    const bouncePointOffset = (ballCenter - paddleCenter) / (paddleHeight / 2);
    const normalizedBouncePoint = Math.max(-1, Math.min(1, bouncePointOffset));
    const angle = normalizedBouncePoint * Math.PI / 3;
    
    ball.velocity.x = direction * ballSpeed * Math.cos(angle);
    ball.velocity.y = ballSpeed * Math.sin(angle);
}

function handleCollision() {
    if (paddle1.position.y < 0) {
        paddle1.position.y = 0;
    } else if (paddle1.position.y > canvas.height - paddleHeight) {
        paddle1.position.y = canvas.height - paddleHeight;
    }

    if (ball.position.y < 0) {
        ball.position.y = 0;
        ball.velocity.y *= -1;
    } else if (ball.position.y + ball.size.height >= canvas.height) {
        ball.position.y = canvas.height - ball.size.height;
        ball.velocity.y *= -1;
    }

    const paddle1Collision = ball.position.x <= paddle1.position.x + paddleWidth && 
                             ball.position.y >= paddle1.position.y - ball.size.height &&
                             ball.position.y <= paddle1.position.y + paddleHeight;

    const paddle2Collision = ball.position.x + ball.size.width >= paddle2.position.x &&
                             ball.position.y >= paddle2.position.y - ball.size.height &&
                             ball.position.y <= paddle2.position.y + paddleHeight;

    if (paddle1Collision && ball.velocity.x < 0) {
        ball.position.x = paddle1.position.x + paddleWidth + 1;
        handleBounce(paddle1, 1);
        paddleBounceSound.play();
    } else if (paddle2Collision && ball.velocity.x > 0) {
        ball.position.x = paddle2.position.x - 1;
        handleBounce(paddle2, -1);
        paddleBounceSound.play();
    }
}

function movePaddle2() {
    const ballCenter = ball.position.y + ball.size.height / 2;
    const paddleCenter = paddle2.position.y + paddleHeight / 2;
    
    if (ballCenter > paddleCenter) {
        paddle2.position.y += paddleSpeed;
    } else if (ballCenter < paddleCenter) {
        paddle2.position.y -= paddleSpeed;
    }
}

function update() {
    paddle1.position.y += paddle1.dy;

    ball.position.x += ball.velocity.x;
    ball.position.y += ball.velocity.y;

    if (ball.position.x < 0) {
        computerScore += 1;
        computerScoreSound.play();
        resetBall();
    } else if (ball.position.x > canvas.width) {
        playerScore += 1;
        playerScoreSound.play()
        resetBall();
    }
}

function drawGame() {
    update();

    drawField();
    drawBall();
    drawPaddle(paddle1);
    drawPaddle(paddle2);

    movePaddle2();
    handleCollision();
    drawScore();
    if (handleVictory()) {
        return
    } else {
        requestAnimationFrame(drawGame)
    }
}

document.addEventListener('keydown', e => {
    if (e.key === 'w') {
        if (paddle1.dy < -paddleSpeed) {
            paddle1.dy = -paddleSpeed;
        } else {
            paddle1.dy -= paddleSpeed;
        }
    } else if (e.key === 's') {
        if (paddle1.dy > paddleSpeed) {
            paddle1.dy = paddleSpeed;
        } else {
            paddle1.dy += paddleSpeed;
        }
    }
})

document.addEventListener('keyup', e => {
    if (e.key === 'w') {
        paddle1.dy = 0;
    } else if (e.key === 's') {
        paddle1.dy = 0;
    }
})

drawStartScreen();
startBtn.addEventListener('click', () => {
    resetGame();
})

