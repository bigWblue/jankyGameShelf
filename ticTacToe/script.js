const gameboard = document.getElementById('gameboard');

const resetBtn = document.getElementById('reset-btn');

const gameModeCheckbox = document.getElementById('game-mode-checkbox');
const gameMode = document.getElementById('game-mode');

const playerScore = document.getElementById('player-score');
let playerCounter = document.getElementById('player-counter');
const computerScore = document.getElementById('cpu-score');
let computerCounter = document.getElementById('cpu-counter');

function resetSquares() {
    gameOver = false;
    for (let i = 0; i <= 8; i++) {
        board[i] = '';
        const square = document.querySelector(`.square-${i}`);
        square.textContent = '';
        square.style.border = '';
        gameboard.style.cursor = '';
    }
}

function switchGameMode() {
    if (gameModeCheckbox.checked) {
        gameMode.textContent = 'Single';
        playerScore.innerHTML = playerScore.innerHTML.replace('Player 1:', 'Player:');
        computerScore.innerHTML = computerScore.innerHTML.replace('Player 2:', 'Computer:');
    } else {
        gameMode.textContent = 'Two';
        playerScore.innerHTML = playerScore.innerHTML.replace('Player:', 'Player 1:');
        computerScore.innerHTML = computerScore.innerHTML.replace('Computer:', 'Player 2:');
    }
    playerCounter = document.getElementById('player-counter');
    computerCounter = document.getElementById('cpu-counter');
}

function getWinner() {
    let winner = null;
    const winCheck = checkWin();

    if (winCheck.victory) {
        winner = board[winCheck.line[0]]
    }
    return winner;
}

function minimax(board, depth, isComputer) {
    const winner = getWinner();

    if (winner === 'O') {
        return 10 - depth;
    }
    if (winner === 'X') {
        return depth - 10;
    }
    if (!winner && board.every(square => square !== '')) {
        return 0;
    }

    if (isComputer) {
        let bestScore = -Infinity;

        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = 'O';

                const score = minimax(board, depth + 1, false);

                board[i] = '';
                bestScore = Math.max(bestScore, score);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;

        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = 'X';
                const score = minimax(board, depth + 1, true);

                board[i] = '';
                bestScore = Math.min(bestScore, score);
            }
        }
        return bestScore;
    }
}

function getBestMove() {
    let bestScore = -Infinity;
    let bestMove = null;

    for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
            board[i] = 'O';

            const score = minimax(board, 0, false);

            board[i] = '';

            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }
    return bestMove;
}

function computerMove() {
    if (gameOver) return;

    const randMove = () => {
        let num = null;
        while (true) {
            const rand = Math.floor(Math.random() * board.length);
            if (board[rand] === '') {
                num = rand;
                break;
            }
        }
        return num;
    };
    const bestMove = getBestMove();
    const randChoice = [bestMove, bestMove, bestMove, randMove()][Math.floor(Math.random() * 4)];
    
    const randSquare = document.querySelector(`.square-${randChoice}`);
    const move = makeMove(randSquare, randChoice);
    board[randChoice] = move;

    const winCheck = checkWin();
    if (winCheck.victory) {
        handleVictory(winCheck.line);
    }
    if (board.every(square => square !== '') && !winCheck.victory) {
        handleTie();
    }
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
    const scoreInt = Number(scorer.textContent);
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

const beep = new Audio('./assets/universfield-ui-button-click-147358.mp3');
const opponentBeep = new Audio('./assets/audiomass-output-opponent.mp3');

for (let i = 0; i <= 8; i++) {
    const square = document.querySelector(`.square-${i}`);

    square.addEventListener('click', () => {
        if (gameOver || (!playerTurn && gameModeCheckbox.checked)) return;
        
        const move = makeMove(square, i);
        if (!move) return;
        board[i] = move;

        const winCheck = checkWin();

        if (winCheck.victory) {
            handleVictory(winCheck.line);
            return;
        } else {
            playerTurn ? beep.play() : opponentBeep.play();
        }
        if (board.every(square => square !== '') && !winCheck.victory) {
            handleTie();
            return;
        }
        if (gameModeCheckbox.checked) {
            playerTurn = false;
            setTimeout(() => {
                computerMove();
                opponentBeep.play();
                playerTurn = true;
            }, 290);
        } else {
            playerTurn = !playerTurn;
        }
    });
}

resetBtn.addEventListener('click', () => {
    resetSquares();
    playerTurn = true;
    [playerCounter, computerCounter].forEach(counter => {
        counter.textContent = 0;
    })
})

gameModeCheckbox.addEventListener('click', () => {
    resetSquares();
    [playerCounter, computerCounter].forEach(counter => {
        counter.textContent = 0;
    })
    switchGameMode();
})
