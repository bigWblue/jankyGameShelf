const simonBtns = document.querySelectorAll('.simon-btn');
const startBtn = document.getElementById('start-btn');
const score = document.getElementById('score');
const highScore = document.getElementById('high-score');

const sound1 = new Audio('./assets/simon-sound1.wav');
const sound2 = new Audio('./assets/simon-sound2.wav');
const sound3 = new Audio('./assets/simon-sound3.wav');
const sound4 = new Audio('./assets/simon-sound4.wav');

function resetGame() {
    playerMoves.splice(0, playerMoves.length);
    computerMoves.splice(0, computerMoves.length);
    movesMadeCounter = 0;
    isPlayerTurn = false;
    isRunning = false;
}

function handleGameOver() {
    highScore.classList.remove('hidden');
    updateHighScore();
    resetGame();
    score.textContent = '0';
    startBtn.classList.remove('hidden');
    game();
}

function updateHighScore() {
    const scoreInt = Number(score.textContent);
    if (scoreInt > highScoreCounter) {
        highScoreCounter = scoreInt;
    }
    highScore.textContent = `High score: ${highScoreCounter}`;
}

function updateScore() {
    const scoreInt = Number(score.textContent);
    score.textContent = `${scoreInt + 1}`
}

function compareArrs(playerArr, computerArr) {
    let isGameOver = false;
    for (let i = 0; i < playerArr.length; i++) {
        const comparison = playerArr[i] === computerArr[i];
        if (!comparison) {
            isGameOver = true;
        }
    }

    if (!isGameOver) {
        updateScore();
    } else {
        handleGameOver();
    }
}

function highlightBtn(btn) {
    if (btn.id === 'simon-btn-1') {
        sound1.play();
    } else if (btn.id === 'simon-btn-2') {
        sound2.play();
    } else if (btn.id === 'simon-btn-3') {
        sound3.play();
    } else if (btn.id === 'simon-btn-4') {
        sound4.play();
    }
    const buttonNumber = Number(btn.id[btn.id.length-1]);
    const highlightClass = `btn-${buttonNumber}-lit`;
    btn.classList.add(highlightClass);
    setTimeout(() => {
        btn.classList.remove(highlightClass);
    }, 500)
}

function makeEveryComputerMove() {
    for (let i = 0; i < computerMoves.length; i++) {
        const btnID = computerMoves[i];
        const prevBtn = Array.from(simonBtns).find(btn => btn.id === btnID);
        setTimeout(() => {
            highlightBtn(prevBtn);
        }, 575 * i);
    }
}

function makeComputerMove() {
    const randBtn = simonBtns[Math.floor(Math.random() * simonBtns.length)];
    if (!computerMoves.length) {
        computerMoves.push(randBtn.id);
        highlightBtn(randBtn);
        return computerMoves.length
    }
    computerMoves.push(randBtn.id);
    makeEveryComputerMove();
    isPlayerTurn = true;
    return computerMoves.length
}

function makePlayerMove() {
    playerMoves.splice(0, playerMoves.length);
    const playerClickAction = (e) => {
        movesMadeCounter -= 1;
        const btnClicked = e.currentTarget;
        playerMoves.push(btnClicked.id);
        highlightBtn(btnClicked);
        
        if (movesMadeCounter === 0) {
            simonBtns.forEach(btn => {
                btn.removeEventListener('click', playerClickAction);
            });
            compareArrs(playerMoves, computerMoves);
            isPlayerTurn = false;
            setTimeout(game, 900)
        }
    }
    for (const btn of simonBtns) {
        btn.addEventListener('click', playerClickAction);
    }
}

function game() {
    if (!isRunning) {
        return
    }
    if (!isPlayerTurn) {
        simonBtns.forEach(btn => {
            btn.disabled = true;
        })
        const computerMovesMade = makeComputerMove();
        movesMadeCounter = computerMovesMade;
        setTimeout(() => {
            simonBtns.forEach(btn => {
                btn.disabled = false;
            })
            makePlayerMove()
        }, 575 * (movesMadeCounter - 1))
    }
}

const playerMoves = [];
const computerMoves = [];
let movesMadeCounter = 0;
let highScoreCounter = 0;
let isPlayerTurn = false;
let isRunning = false;

startBtn.addEventListener('click', () => {
    isRunning = true;
    startBtn.classList.add('hidden');
    highScore.classList.add('hidden');
    game();
});