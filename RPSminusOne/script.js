const gameContainer =  document.getElementById('rps-game');

let choiceBtns = document.querySelectorAll('.rps-choice');
let chosenOptions = document.getElementById('chosen-options');

let undoBtn = document.getElementById('undo-btn');
let confirmBtn = document.getElementById('confirm-btn');

function restartGame() {
    gameContainer.innerHTML = '';
    gameContainer.innerHTML = `
            <div id="choices">
                <button class="rps-choice" value="rock">
                    <img src="./assets/hand-rock.png" alt="rock">
                </button>
                <button class="rps-choice" value="paper">
                    <img src="./assets/hand-paper.png" alt="paper">
                </button>
                <button class="rps-choice" value="scissors">
                    <img src="./assets/hand-scissors.png" alt="scissors">
                </button>
            </div>
            <div id="chosen-options">
            </div>
            <div id="pre-game-buttons">
                <button id="undo-btn">Undo</button>
                <button id="confirm-btn">Confirm</button>
            </div>
            `
    undoBtn = document.getElementById('undo-btn');
    confirmBtn = document.getElementById('confirm-btn');
    choiceBtns = document.querySelectorAll('.rps-choice');
    chosenOptions = document.getElementById('chosen-options');
    addFirstEventListeners();
}

function addFirstEventListeners() {
    choiceBtns.forEach(choiceBtn => {
    choiceBtn.addEventListener('click', handleChoiceClick)
    })
    undoBtn.addEventListener('click', handleUndo);
    confirmBtn.addEventListener('click', playGame);
}

function handleUndo() {
    let stringOfEls = '';
    const currChosen = chosenOptions.getElementsByTagName('img');
    for (let i = 0; i < currChosen.length; i++) {
        const el = currChosen[i];
        
        if (i === currChosen.length-1) {
            continue;
        } else {
            stringOfEls += el.outerHTML;
        }
    }
    chosenOptions.innerHTML = stringOfEls;
}

function getHandImg(choice) {
    return `<img src="./assets/hand-${choice}.png" alt="${choice}">`
}

function addToChosenOptions(imgEl) {
    chosenOptions.innerHTML += imgEl;
}

function handleChoiceClick(e) {
    let val = e.target.value || e.target.parentElement.value;
    const img = getHandImg(val);
    
    const chosenAmount = chosenOptions.getElementsByTagName('img').length;
    if (chosenAmount < 2) {
        selectSound.play();
        addToChosenOptions(img);
    }
}

function getRandomComputerChoices() {
    const choices = [];
    const options = ['rock', 'paper', 'scissors'];
    for (let i = 0; i <= 1; i++) {
        const randomPick = options[Math.floor(Math.random() * 3)];
        choices.push(getHandImg(randomPick))
    }
    return choices
}

function displayChoices(choices, isPlayer) {
    let choiceContainer = '';
    if (isPlayer) {
        choiceContainer += `<div id="player-choices">`;
        for (const choice of choices) {
            choiceContainer += choice.outerHTML;
        }
    } else {
        choiceContainer += `<div id="computer-choices">`;
        for (const choice of choices) {
            choiceContainer += choice;
        }
    }
    choiceContainer += '</div>';
    gameContainer.innerHTML += choiceContainer;
}

function addListenersToRestartBtns(id) {
    const btn = document.getElementById(id);
    btn.addEventListener('click', restartGame)
}

function displayRestartBtns() {
    let btnsContainer = '<div id="restart-container">';
    btnsContainer += `<button id="restart-btn">Restart</button>`;
    btnsContainer += `</div>`;
    gameContainer.innerHTML += btnsContainer;
}

function getWinner(player, computer) {
    let winner = null;
    const rpsWinCases = {
        'rock': {'rock': 'tie', 'paper': 'computer', 'scissors': 'player'},
        'paper': {'rock': 'player', 'paper': 'tie', 'scissors': 'computer'},
        'scissors': {'rock': 'computer', 'paper': 'player', 'scissors': 'tie'}
    };
    winner = rpsWinCases[player][computer];
    return winner
}

function displayGameResult(winner) {
    let resultContainer = `<div id="game-result">`;

    if (winner === 'tie') {
        resultContainer += `<span class="tie">It's a tie!</span>`
        tieSound.play();
    } else if (winner === 'player') {
        resultContainer += '<span class="win">You win!</span>'
        winSound.play();
    } else {
        resultContainer += '<span class="lose">You lose.</span>'
        loseSound.play();
    }
    resultContainer += `</div>`;
    return resultContainer;
}

function playRPS(player, computer) {
    const convertToRPS = (hand) => {
        const isRock = hand.includes('hand-rock');
        const isPaper = hand.includes('hand-paper');
        const isScissors = hand.includes('hand-scissors');

        if (isRock) {
            return 'rock'
        } else if (isPaper) {
            return 'paper'
        } else {
            return 'scissors'
        }
    };
    const playerHand = convertToRPS(player);
    const computerHand = convertToRPS(computer);

    const computerFinalChoice = `<div id="computer-final-choice">${computer}</div>`;
    const winner = getWinner(playerHand, computerHand);
    const playerFinalChoice = `<div id="player-final-choice">${player}</div>`;

    gameContainer.innerHTML = computerFinalChoice;
    gameContainer.innerHTML += displayGameResult(winner);
    gameContainer.innerHTML += playerFinalChoice;
    displayRestartBtns();
    addListenersToRestartBtns('restart-btn');
}

function addListenersToPlayerChoices(computerChoices) {
    const playerChoicesContainer = document.getElementById('player-choices');
    const playerChoicesImgs = playerChoicesContainer.getElementsByTagName('img');

    const clickChoiceRef = (e) => {
        const playerChoice = e.target;
        const computerChoice = computerChoices[Math.floor(Math.random() * 2)];
        playRPS(playerChoice.outerHTML, computerChoice);
    };

    for (const img of playerChoicesImgs) {
        img.addEventListener('click', clickChoiceRef);
    }
}

function playGame() {
    const playerChoices = chosenOptions.getElementsByTagName('img');
    if (playerChoices.length < 2) {
        return;
    }
    const computerChoices = getRandomComputerChoices();

    gameContainer.innerHTML = '';
    displayChoices(computerChoices, false);
    displayChoices(playerChoices, true);
    displayRestartBtns();
    addListenersToPlayerChoices(computerChoices);
    addListenersToRestartBtns('restart-btn');
}

const selectSound = new Audio('./assets/blipSelect.wav');
const winSound = new Audio('./assets/winSound.wav');
const loseSound = new Audio('./assets/loseSound.wav');
const tieSound = new Audio('./assets/tieSound.wav');
addFirstEventListeners();