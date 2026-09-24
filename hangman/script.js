const targetWordContainer = document.getElementById('target-word-container');
const keyboardContainer = document.getElementById('keyboard-container');
const hangmanDrawingContainer = document.getElementById('hangman-drawing-container');
let hangmanDrawing = document.getElementById('hangman-drawing');

let currTheme = document.getElementById('select-theme');

const resetBtn = document.getElementById('reset-btn');

const correctGuessSound = new Audio('./assets/universfield-menu-click-cropped.mp3');
const wrongGuessSound = new Audio('./assets/hitHurt-audiomass.mp3');

function resetGame() {
    resetBtn.classList.add('hidden');

    for (const key of keyboardKeys) {
        key.disabled = false;
        if (key.classList.contains('correct-letter')) {
            key.classList.remove('correct-letter');
        }
        else if (key.classList.contains('wrong-letter')) {
            key.classList.remove('wrong-letter');
        }
    }

    hangmanParts = [
        'head',
        'body',
        'left-arm',
        'right-arm',
        'left-leg',
        'right-leg'
    ];
    
    for (const part of hangmanDrawing.childNodes) {
        if (part.nodeName === '#text' || part.classList.contains('gallows')) {
            continue;
        } else {
            part.classList.add('hidden');
        }
    }

    targetWordContainer.innerHTML = '';
    hangmanDrawingContainer.style.backgroundColor = 'whitesmoke';
    generateTargetWord();
}

async function fetchWordArrs() {
    try {
        const response = await fetch('./wordLists.json');
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const data = await response.json();
        return data
    } catch(error) {
        console.log('Error fetching words')
        throw error;
    }
}

function getWordArr() {
    currTheme = document.getElementById('select-theme');
    return fetchWordArrs().then(parsedObj => {
        const chosenArr = parsedObj[currTheme.value];
        return chosenArr;
    }).catch(error => console.error(error));
}


async function generateTargetWord() {
    const targetWordsArr = await getWordArr();
    
    const randomIndex = () => {
        while (true) {
            const randTry = Math.floor(Math.random() * targetWordsArr.length);
            if (!currWord.length || randTry !== targetWordsArr.indexOf(currWord)) {
                return randTry;
            }
        }
    }
    const randomWord = targetWordsArr[randomIndex()];
    currWord = randomWord;

    let charIndex = 0;
    for (const char of randomWord) {
        const letterEl = 
        `<span id="letter-${charIndex}" class="target-letter blank">${char.toUpperCase()}</span>`
        targetWordContainer.innerHTML += letterEl;
        charIndex += 1;
    }
}

function generateKeyboard() {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (const letter of alphabet) {
        const letterBtn = `<button class="keyboard-letter">${letter}</button>`;
        keyboardContainer.innerHTML += letterBtn;
    }
}

function getRightLetters(keyPressed) {
    const correctLetters = [];
    for (let i = 0; i < currWord.length; i++) {
        if (keyPressed === currWord[i].toUpperCase()) {
            correctLetters.push(i);
        }
    }
    return correctLetters
}

function showCorrectLetters(correctLettersArr) {
    for (const i of correctLettersArr) {
        const correctLetter = targetWordContainer.querySelector(`#letter-${i}`);
        correctLetter.classList.remove('blank');
    }
}

function addHangmanPart() {
    if (!hangmanParts.length) return;

    const partName = hangmanParts.shift();
    const stickmanPart = hangmanDrawing.querySelector(`#stickman-${partName}`);
    stickmanPart.classList.remove('hidden');
}

function changeKeyColor(isCorrect, keyPressed) {
    for (const key of keyboardKeys) {
        if (key.textContent === keyPressed) {
            key.classList.add(isCorrect ? 'correct-letter' : 'wrong-letter');
            key.disabled = true;
        }
    }
}

function checkWin() {
    const remainingLetters = targetWordContainer.querySelectorAll('.blank').length;
    if (remainingLetters > 0) {
        return false;
    }
    return true
}

function revealMissingLetters() {
    const missingLetters = targetWordContainer.querySelectorAll('.blank');
    for (const letter of missingLetters) {
        letter.classList.remove('blank');
        letter.classList.add('wrong-letter');
    }
}

function disableAllBtns() {
    for (const key of keyboardKeys) {
        if (key.disabled) continue;
        key.disabled = true;
    }
}

function handleWin() {
   disableAllBtns();
   hangmanDrawingContainer.style.backgroundColor = 'lightgreen';
   resetBtn.classList.remove('hidden');
}

function handleGameOver() {
   disableAllBtns();
   hangmanDrawingContainer.style.backgroundColor = 'lightcoral';
   revealMissingLetters();
   resetBtn.classList.remove('hidden');
}

function checkGameOver() {
    return !Boolean(hangmanParts.length)
}

function handleKeyPressed(e) {
    const keyPressed = e.target.textContent;
    const correctLetters = getRightLetters(keyPressed);
    if (correctLetters.length) {
        showCorrectLetters(correctLetters);
        changeKeyColor(true, keyPressed);
        correctGuessSound.play();
    } else {
        addHangmanPart();
        changeKeyColor(false, keyPressed);
        wrongGuessSound.play();
    }
    const isWin = checkWin();
    if (isWin) {
        handleWin();
        return;
    }
    const isGameOver = checkGameOver();
    if (isGameOver) {
        handleGameOver();
        return;
    }
}

let currWord = '';
let hangmanParts = [
    'head',
    'body',
    'left-arm',
    'right-arm',
    'left-leg',
    'right-leg'
];

generateKeyboard();
generateTargetWord();

const keyboardKeys = keyboardContainer.querySelectorAll('.keyboard-letter');
for (key of keyboardKeys) {
    key.addEventListener('click', handleKeyPressed);
}

currTheme.addEventListener('change', () => {
    resetGame();
    currTheme.blur();
})
resetBtn.addEventListener('click', resetGame);

window.addEventListener('keydown', e => {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    if (e.key === 'Enter') {
        resetGame();
    }
    if (!alphabet.includes(e.key)) return;

    const keyPressedUppercase = e.key.toUpperCase();
    
    for (const btn of keyboardKeys) {
        if (btn.textContent === keyPressedUppercase) {
            btn.click();
        }
        else {
            continue;
        }
    }
})
