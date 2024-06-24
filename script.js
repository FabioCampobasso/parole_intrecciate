const words = [
    "MENGONI", "ANNALISA", "ULTIMO", "ELODIE", "FEDEZ", "ACHILLELAURO", "LEVANTE", "MADAME", "IRAMA", "MAHMOOD"
];

const grid = [
    ['F', 'L', 'E', 'V', 'A', 'N', 'T', 'E', 'E', 'Q'],
    ['M', 'E', 'A', 'R', 'S', 'V', 'S', 'R', 'W', 'S'],
    ['V', 'E', 'D', 'T', 'O', 'C', 'J', 'D', 'M', 'N'],
    ['G', 'I', 'N', 'E', 'M', 'H', 'T', 'A', 'A', 'K'],
    ['Y', 'A', 'R', 'G', 'Z', 'U', 'E', 'C', 'N', 'L'],
    ['J', 'F', 'P', 'A', 'O', 'V', 'D', 'H', 'N', 'M'],
    ['C', 'R', 'W', 'V', 'M', 'N', 'Z', 'I', 'A', 'E'],
    ['G', 'H', 'Q', 'I', 'W', 'A', 'I', 'L', 'L', 'L'],
    ['M', 'M', 'A', 'D', 'A', 'M', 'E', 'L', 'I', 'O'],
    ['A', 'Q', 'R', 'L', 'G', 'F', 'N', 'E', 'S', 'D'],
    ['H', 'D', 'P', 'O', 'T', 'X', 'U', 'L', 'A', 'I'],
    ['M', 'J', 'P', 'Z', 'I', 'E', 'B', 'A', 'D', 'E'],
    ['O', 'U', 'L', 'T', 'I', 'M', 'O', 'U', 'W', 'P'],
    ['O', 'W', 'M', 'P', 'Z', 'R', 'A', 'R', 'B', 'S'],
    ['D', 'U', 'D', 'G', 'J', 'J', 'U', 'O', 'N', 'Y']
];

export let selectedCells = [];
let isSelecting = false;
let startCell = null;

const wordGridElement = document.getElementById('word-grid');
const dynamicCanvas = document.getElementById('selection-canvas');
const fixedCanvas = document.getElementById('fixed-canvas');
const dynamicCtx = dynamicCanvas.getContext('2d');
const fixedCtx = fixedCanvas.getContext('2d');
dynamicCanvas.width = wordGridElement.offsetWidth;
dynamicCanvas.height = wordGridElement.offsetHeight;
fixedCanvas.width = wordGridElement.offsetWidth;
fixedCanvas.height = wordGridElement.offsetHeight;

function createGrid() {
    wordGridElement.style.gridTemplateColumns = `repeat(${grid[0].length}, 1fr)`;
    wordGridElement.style.gridTemplateRows = `repeat(${grid.length}, 1fr)`;
    grid.forEach((row, rowIndex) => {
        row.forEach((letter, colIndex) => {
            const cell = document.createElement('div');
            const span = document.createElement('span');
            span.textContent = letter;
            cell.dataset.row = rowIndex;
            cell.dataset.col = colIndex;
            cell.appendChild(span);

            cell.addEventListener('mousedown', startSelection);
            cell.addEventListener('mouseover', continueSelection);
            cell.addEventListener('mouseup', endSelection);

            // Add touch event listeners
            cell.addEventListener('touchstart', startSelection, { passive: false });
            cell.addEventListener('touchmove', continueSelection, { passive: false });
            cell.addEventListener('touchend', endSelection, { passive: false });

            wordGridElement.appendChild(cell);
        });
    });
}

function startSelection(event) {
    event.preventDefault();
    clearSelection();
    isSelecting = true;
    startCell = event.target.closest('div');
    selectCell(startCell);
    displaySelectedWord();
    const clientX = event.touches ? event.touches[0].clientX : event.clientX;
    const clientY = event.touches ? event.touches[0].clientY : event.clientY;
    drawLineToCellCenter(startCell, clientX, clientY);
}

function continueSelection(event) {
    event.preventDefault();
    if (isSelecting) {
        const touch = event.touches ? event.touches[0] : null;
        const cell = touch ? document.elementFromPoint(touch.clientX, touch.clientY).closest('div') : event.target.closest('div');
        if (cell && cell !== startCell) {
            selectCellsInLine(startCell, cell);
            displaySelectedWord();
            const clientX = touch ? touch.clientX : event.clientX;
            const clientY = touch ? touch.clientY : event.clientY;
            drawLineToCellCenter(startCell, clientX, clientY);
        }
    }
}


function endSelection(event) {
    event.preventDefault();
    isSelecting = false;
    displaySelectedWord();
    if (checkWord()) {
        drawFixedLineForSelection('yellow');
    }
    startCell = null;
    dynamicCtx.clearRect(0, 0, dynamicCanvas.width, dynamicCanvas.height);
}

function selectCell(cell) {
    if (!cell.classList.contains('selected')) {
        cell.classList.add('selected');
        selectedCells.push(cell);
        
    }
}

export function clearSelection() {
    selectedCells.forEach(cell => cell.classList.remove('selected'));
    selectedCells = [];
}

let guessedWords = [];

function updateWordCount() {
    const wordCountBadge = document.getElementById('wordCount');
    wordCountBadge.textContent = guessedWords.length;
}

// Aggiorna anche all'inizializzazione se l'array ha contenuti iniziali
document.addEventListener('DOMContentLoaded', function() {
    updateWordCount();  // Assicurati che il conteggio sia aggiornato quando la pagina viene caricata
});

function addWordToSideMenu() {
    const sideMenu = document.getElementById('sideMenu');
    sideMenu.innerHTML = '<h2>Parole Indovinate</h2>';  // Pulisce il contenuto precedente del sideMenu

    guessedWords.forEach(word => {
        const wordDiv = document.createElement('article');
        wordDiv.textContent = word;
        wordDiv.addEventListener('click', () => {
            const artist = artistData.find(a => a.nome === word);
            if (artist) {
                showPopup(artist);
            }
        });
        sideMenu.appendChild(wordDiv);
    });
}
function addTransitionDelays() {
    selectedCells.forEach((cell, index) => {
        cell.querySelector('span').style.transitionDelay = `${index * 0.1}s`;
    });
}

function selectCellsInLine(startCell, endCell) {
    clearSelection();
    const startRow = parseInt(startCell.dataset.row);
    const startCol = parseInt(startCell.dataset.col);
    const endRow = parseInt(endCell.dataset.row);
    const endCol = parseInt(endCell.dataset.col);

    const rowDiff = endRow - startRow;
    const colDiff = endCol - startCol;

    const absRowDiff = Math.abs(rowDiff);
    const absColDiff = Math.abs(colDiff);

    if (absRowDiff === absColDiff || startRow === endRow || startCol === endCol) {
        const rowStep = rowDiff === 0 ? 0 : rowDiff / absRowDiff;
        const colStep = colDiff === 0 ? 0 : colDiff / absColDiff;

        for (let i = 0; i <= Math.max(absRowDiff, absColDiff); i++) {
            const row = startRow + i * rowStep;
            const col = startCol + i * colStep;
            const cell = document.querySelector(`div[data-row='${row}'][data-col='${col}']`);
            if (cell) {
                selectCell(cell);
            }
        }
    }
}

function drawLineToCellCenter(startCell, clientX, clientY) {
    const rect = wordGridElement.getBoundingClientRect();
    const startX = startCell.offsetLeft + startCell.offsetWidth / 2;
    const startY = startCell.offsetTop + startCell.offsetHeight / 2;

    const endCell = document.elementFromPoint(clientX, clientY);
    if (!endCell || !endCell.closest('#word-grid > div')) return;
    const targetCell = endCell.closest('#word-grid > div');

    const targetRect = targetCell.getBoundingClientRect();
    const adjustedEndX = targetRect.left + targetRect.width / 2 - rect.left;
    const adjustedEndY = targetRect.top + targetRect.height / 2 - rect.top;

    const circleDiameter = 35;
    const circleRadius = circleDiameter / 2;

    dynamicCtx.clearRect(0, 0, dynamicCanvas.width, dynamicCanvas.height);

    dynamicCtx.beginPath();
    dynamicCtx.moveTo(startX, startY);
    dynamicCtx.lineTo(adjustedEndX, adjustedEndY);
    dynamicCtx.strokeStyle = 'rgb(200, 200, 200)';
    dynamicCtx.lineWidth = 35;
    dynamicCtx.stroke();

    dynamicCtx.beginPath();
    dynamicCtx.arc(startX, startY, circleRadius, 0, 2 * Math.PI, false);
    dynamicCtx.fillStyle = 'rgb(200, 200, 200)';
    dynamicCtx.fill();

    dynamicCtx.beginPath();
    dynamicCtx.arc(adjustedEndX, adjustedEndY, circleRadius, 0, 2 * Math.PI, false);
    dynamicCtx.fillStyle = 'rgb(200, 200, 200)';
    dynamicCtx.fill();
}

function drawFixedLineForSelection(color) {
    if (selectedCells.length < 2) return;

    const startCell = selectedCells[0];
    const endCell = selectedCells[selectedCells.length - 1];

    const startX = startCell.offsetLeft + startCell.offsetWidth / 2;
    const startY = startCell.offsetTop + startCell.offsetHeight / 2;
    const endX = endCell.offsetLeft + endCell.offsetWidth / 2;
    const endY = endCell.offsetTop + endCell.offsetHeight / 2;

    const circleDiameter = 35;
    const circleRadius = circleDiameter / 2;

    // Disegna la linea
    fixedCtx.beginPath();
    fixedCtx.moveTo(startX, startY);
    fixedCtx.lineTo(endX, endY);
    fixedCtx.strokeStyle = color;
    fixedCtx.lineWidth = 35;
    fixedCtx.stroke();

    // Disegna il cerchio iniziale
    fixedCtx.beginPath();
    fixedCtx.arc(startX, startY, circleRadius, 0, 2 * Math.PI, false);
    fixedCtx.fillStyle = color;
    fixedCtx.fill();

    // Disegna il cerchio finale
    fixedCtx.beginPath();
    fixedCtx.arc(endX, endY, circleRadius, 0, 2 * Math.PI, false);
    fixedCtx.fillStyle = color;
    fixedCtx.fill();
}

createGrid();

function displaySelectedWord() {
    const wordDisplay = document.getElementById('selected-word-display');
    const selectedWord = selectedCells.map(cell => cell.textContent).join('');
    wordDisplay.textContent = selectedWord; // Mostra la parola selezionata o stringa vuota
}

document.addEventListener('click', function(event) {
    var menu = document.getElementById('sideMenu');
    var menuButton = document.getElementById('menuButton');

    // Controlla se il click è avvenuto sul pulsante del menu
    if (menuButton.contains(event.target)) {
        // Se il menu è già aperto, chiudilo; altrimenti, aprilo
        if (menu.style.width === '250px') {
            menu.style.width = '0';
        } else {
            menu.style.width = '250px';
        }
    } else if (!menu.contains(event.target)) {
        // Se il click è fuori dal menu, chiudi il menu
        if (menu.style.width === '250px') {
            menu.style.width = '0';
        }
    }
});

let artistData = null; // Variabile globale per memorizzare i dati degli artisti

document.addEventListener('DOMContentLoaded', () => {
    fetch('artists.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            artistData = data.artists;
        })
        .catch(error => console.error('Error fetching artist data:', error));
});

function showPopup(artist) {
    const popup = document.createElement('div');
    popup.classList.add('popup');
    popup.id = 'popup';

    const artistName = document.createElement('h1');
    artistName.classList.add('artist-name');
    artistName.textContent = artist.nome;

    const artistDate = document.createElement('h5');
    artistDate.classList.add('artist-date');
    artistDate.textContent = artist.data;

    const artistVenue = document.createElement('h2');
    artistVenue.classList.add('artist-venue');
    artistVenue.textContent = artist.venue;

    const artistButton = document.createElement('a');
    artistButton.classList.add('artist-button');
    artistButton.href = artist.button;
    artistButton.target = '_blank';
    artistButton.textContent = "Biglietti";

    const closeButton = document.createElement('button');
    closeButton.classList.add('close-button');
    closeButton.textContent = "X";
    closeButton.onclick = () => {
        popup.classList.remove('show');
        setTimeout(() => popup.remove(), 300); // Wait for animation to finish
    };

    popup.appendChild(artistName);
    popup.appendChild(artistDate);
    popup.appendChild(artistVenue);
    popup.appendChild(artistButton);
    popup.appendChild(closeButton);

    document.body.appendChild(popup);
    setTimeout(() => popup.classList.add('show'), 10); // Trigger animation
}

function checkWord() {
    const selectedWord = selectedCells.map(cell => cell.textContent).join('');
    const reversedSelectedWord = selectedCells.map(cell => cell.textContent).reverse().join('');
    let correctWord = null;

    if (words.includes(selectedWord)) {
        correctWord = selectedWord;
    } else if (words.includes(reversedSelectedWord)) {
        correctWord = reversedSelectedWord;
    }

    if (correctWord && !guessedWords.includes(correctWord)) {
        guessedWords.push(correctWord);
        const artist_name = correctWord;

        const artist = artistData.find(a => a.nome === artist_name);
        if (artist) {
            showPopup(artist);
        }

        addWordToSideMenu();  
        updateWordCount();   
        addTransitionDelays();
        selectedCells.forEach(cell => cell.classList.add('correct'));

        return true;
    }
    clearSelection();
    return false;
}
