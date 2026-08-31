const gameboard = document.getElementById('gameboard');

const resetBtn = document.getElementById('reset-btn');

const playerCounter = document.getElementById('player-counter');
const computerCounter = document.getElementById('cpu-counter');

function resetSquares() {
    playerTurn = true;
    gameOver = false;
    for (let i = 0; i <= 8; i++) {
        board[i] = '';
        const square = document.querySelector(`.square-${i}`);
        square.textContent = '';
        square.style.border = '';
        gameboard.style.cursor = '';
    }
}

function computerMove() {
    if (gameOver) return;

    let isSquareEmpty = false;
    let randInt = null;
    while (!isSquareEmpty) {
        randInt = Math.floor(Math.random() * (8 + 1));
        if (!board[randInt]) {
            isSquareEmpty = true;
        }
    }

    const randSquare = document.querySelector(`.square-${randInt}`);
    const move = makeMove(randSquare, randInt);
    board[randInt] = move;

    const winCheck = checkWin();
    if (winCheck.victory) {
        handleVictory(winCheck.line);
    }
    if (board.every(square => square !== '') && !winCheck.victory) {
        handleTie();
    }
    return randSquare;
}

function handleVictory(winLine) {
    gameOver = true;
    playerTurn ? updateScore(playerCounter) : updateScore(computerCounter);
    handleGameOver(winLine);
}

function handleTie() {
    gameOver = true;
    handleGameOver();
}

function handleGameOver(line = [0, 1, 2, 3, 4, 5, 6, 7, 8]) {
    const winSquares = [];
    gameboard.style.cursor = 'pointer';
    for (let i of line) {
        const square = document.querySelector(`.square-${i}`);
        square.style.border = '1px solid gold';
        winSquares.push(square);
    }
    setTimeout(() => {
        const softResetRef = () => {
            resetSquares();
            gameboard.removeEventListener('click', softResetRef)
        }
        gameboard.addEventListener('click', softResetRef)
    }, 500)
}

function updateScore(scorer) {
    const scoreInt = Number(scorer.textContent)
    scorer.textContent = scoreInt + 1;
}

function makeMove(square, i) {
    if (board[i] !== '') {
        return
    }
    const move = playerTurn ? 'X' : 'O';
    square.textContent = move;
    return move
}

function checkWin() {
    let isVictory = false;
    let victoryLine = null;
    const winConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [2, 4, 6],
        [0, 4, 8]
    ];
    for (const condition of winConditions) {
        [a, b, c] = condition;
        if (board[a] && board[b] && board[c]) {
            if (board[a] === board[b] && board[b] === board[c]) {
                isVictory = true;
                victoryLine = condition;
            }
        }
    }
    return {'victory': isVictory, 'line': victoryLine}
}

const board = [
    '', '', '',
    '', '', '',
    '', '', ''
]
let playerTurn = true;
let gameOver = false;

for (let i = 0; i <= 8; i++) {
    const square = document.querySelector(`.square-${i}`);

    square.addEventListener('click', () => {
        if (gameOver || !playerTurn) return;

        const move = makeMove(square, i);
        if (!move) return;
        board[i] = move;

        const winCheck = checkWin();
        if (winCheck.victory) {
            handleVictory(winCheck.line);
            return;
        }
        if (board.every(square => square !== '') && !winCheck.victory) {
            handleTie();
            return;
        }
        playerTurn = false;
        setTimeout(() => {
            computerMove();
            playerTurn = true;
        }, 290);
    });
}

resetBtn.addEventListener('click', () => {
    resetSquares();
    [playerCounter, computerCounter].forEach(counter => {
        counter.textContent = 0;
    })
})