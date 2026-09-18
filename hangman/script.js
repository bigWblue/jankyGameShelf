const targetWordContainer = document.getElementById('target-word-container');
const keyboardContainer = document.getElementById('keyboard-container');
const hangmanDrawingContainer = document.getElementById('hangman-drawing-container');
let hangmanDrawing = document.getElementById('hangman-drawing');

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

function generateTargetWord() {
    const targetWordsArr = [
        'Electrode',
        'Diglett',
        'Nidoran',
        'Mankey',
        'Venusaur',
        'Rattata',
        'Fearow',
        'Pidgey',
        'Seaking',
        'Jolteon',
        'Dragonite',
        'Gastly',
        'Ponyta',
        'Vaporeon',
        'Poliwrath',
        'Butterfree',
        'Venomoth',
        'Poliwag',
        'Nidorino',
        'Golduck',
        'Ivysaur',
        'Grimer',
        'Victreebel',
        'Moltres',
        'Nidoking',
        'Farfetchd',
        'Abra',
        'Jigglypuff',
        'Kingler',
        'Rhyhorn',
        'Clefable',
        'Wigglytuff',
        'Zubat',
        'Primeape',
        'Meowth',
        'Onix',
        'Geodude',
        'Rapidash',
        'Magneton',
        'Snorlax',
        'Gengar',
        'Tangela',
        'Goldeen',
        'Spearow',
        'Weezing',
        'Seel',
        'Gyarados',
        'Slowbro',
        'Kabuto',
        'Persian',
        'Paras',
        'Horsea',
        'Raticate',
        'Magnemite',
        'Kadabra',
        'Weepinbell',
        'Ditto',
        'Cloyster',
        'Caterpie',
        'Sandshrew',
        'Bulbasaur',
        'Charmander',
        'Golem',
        'Pikachu',
        'Alakazam',
        'Doduo',
        'Venonat',
        'Machoke',
        'Kangaskhan',
        'Hypno',
        'Electabuzz',
        'Flareon',
        'Blastoise',
        'Poliwhirl',
        'Oddish',
        'Drowzee',
        'Raichu',
        'Nidoqueen',
        'Bellsprout',
        'Starmie',
        'Metapod',
        'Marowak',
        'Kakuna',
        'Clefairy',
        'Dodrio',
        'Seadra',
        'Vileplume',
        'Krabby',
        'Lickitung',
        'Tauros',
        'Weedle',
        'Nidoran',
        'Machop',
        'Shellder',
        'Porygon',
        'Hitmonchan',
        'Articuno',
        'Jynx',
        'Nidorina',
        'Beedrill',
        'Haunter',
        'Squirtle',
        'Chansey',
        'Parasect',
        'Exeggcute',
        'Muk',
        'Dewgong',
        'Pidgeotto',
        'Lapras',
        'Vulpix',
        'Rhydon',
        'Charizard',
        'Machamp',
        'Pinsir',
        'Koffing',
        'Dugtrio',
        'Golbat',
        'Staryu',
        'Magikarp',
        'Ninetales',
        'Ekans',
        'Omastar',
        'Scyther',
        'Tentacool',
        'Dragonair',
        'Magmar',
        'Sandslash',
        'Hitmonlee',
        'Psyduck',
        'Arcanine',
        'Eevee',
        'Exeggutor',
        'Kabutops',
        'Zapdos',
        'Dratini',
        'Growlithe',
        'Mrmime',
        'Cubone',
        'Graveler',
        'Voltorb',
        'Gloom',
        'Charmeleon',
        'Wartortle',
        'Mewtwo',
        'Tentacruel',
        'Aerodactyl',
        'Omanyte',
        'Slowpoke',
        'Pidgeot',
        'Arbok'
    ];

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

window.addEventListener('keydown', e => {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
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

resetBtn.addEventListener('click', resetGame);