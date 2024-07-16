//const grid = [
//    ['E', 'P', 'I', 'F', 'A', 'N', 'I', 'O', 'A', 'D'],
//    ['I', 'L', 'T', 'R', 'I', 'O', 'D', 'M', 'U', 'E'],
//    ['X', 'P', 'U', 'B', 'O', 'N', 'O', 'A', 'T', 'M'],
//    ['P', 'X', 'X', 'O', 'B', 'E', 'R', 'R', 'O', 'O'],
//    ['I', 'E', 'X', 'O', 'L', 'L', 'O', 'G', 'M', 'C'],
//    ['E', 'D', 'V', 'M', 'I', 'A', 'T', 'U', 'O', 'R'],
//    ['R', 'F', 'A', 'E', 'O', 'R', 'H', 'T', 'B', 'A'],
//    ['F', 'A', 'X', 'R', 'N', 'A', 'Y', 'T', 'I', 'T'],
//    ['E', 'T', 'X', 'S', 'T', 'I', 'X', 'A', 'L', 'I'],
//    ['R', 'T', 'A', 'T', 'I', 'A', 'N', 'A', 'I', 'C'],
//    ['D', 'O', 'S', 'T', 'R', 'E', 'G', 'A', 'S', 'O'],
//    ['I', 'V', 'I', 'A', 'N', 'D', 'A', 'N', 'T', 'E'],
//    ['V', 'I', 'T', 'A', 'B', 'A', 'S', 'S', 'A', 'X'],
//    ['C', 'A', 'U', 'C', 'A', 'S', 'I', 'C', 'O', 'N'],
//    ['B', 'E', 'L', 'I', 'S', 'A', 'R', 'I', 'X', 'X']
//];

const words = [
    "CRIMINE", "AMICO", "FUTBOL", "GIOVENTU", "ROSA", "FIABA", "FREUD", "THEWALL", "BODYSCEMI", 
    "NAPOLI", "MISSITALIA", "DANZA", "PIUTTOSTOCHE", "CANZONACCE", "TUMTUMPA", "OBLIO", "MARGUTTA", 
    "EPIFANIO", "NONELARAI", "ILTRIO", "AUTOMOBILISTA", "DEMOCRATICO", "CAUCASICO", "VITABASSA", 
    "DARTAGNAN", "NEVE", "TATIANA", "VIANDANTE", "BELISARI", "STREGA", "FATTO", "PIERFERDI", 
    "DOROTHY", "PUB", "BOOMERS"
];


const grid = [
    ['C', 'A', 'N', 'Z', 'O', 'N', 'A', 'C', 'C', 'E'],
    ['G', 'I', 'O', 'V', 'E', 'N', 'T', 'U', 'X', 'X'],
    ['X', 'X', 'X', 'X', 'X', 'X', 'H', 'X', 'X', 'P'],
    ['X', 'F', 'X', 'X', 'F', 'R', 'E', 'U', 'D', 'I'],
    ['X', 'X', 'I', 'X', 'X', 'X', 'W', 'X', 'X', 'U'],
    ['X', 'N', 'D', 'A', 'N', 'Z', 'A', 'X', 'X', 'T'],
    ['X', 'A', 'X', 'X', 'B', 'X', 'L', 'X', 'A', 'T'],
    ['X', 'P', 'X', 'A', 'X', 'A', 'L', 'X', 'M', 'O'],
    ['B', 'O', 'D', 'Y', 'S', 'C', 'E', 'M', 'I', 'S'],
    ['X', 'L', 'X', 'X', 'X', 'O', 'X', 'X', 'C', 'T'],
    ['X', 'I', 'X', 'X', 'X', 'X', 'R', 'X', 'O', 'O'],
    ['T', 'U', 'M', 'T', 'U', 'M', 'P', 'A', 'X', 'C'],
    ['X', 'X', 'F', 'U', 'T', 'B', 'O', 'L', 'X', 'H'],
    ['X', 'X', 'X', 'C', 'R', 'I', 'M', 'I', 'N', 'E'],
    ['M', 'I', 'S', 'S', 'I', 'T', 'A', 'L', 'I', 'A']
];

function initializeCanvases() {
    const wordGridElement = document.getElementById('word-grid');
    const dynamicCanvas = document.getElementById('selection-canvas');
    const fixedCanvas = document.getElementById('fixed-canvas');
    const dynamicCtx = dynamicCanvas.getContext('2d');
    const fixedCtx = fixedCanvas.getContext('2d');
    
    dynamicCanvas.width = wordGridElement.offsetWidth;
    dynamicCanvas.height = wordGridElement.offsetHeight;
    fixedCanvas.width = wordGridElement.offsetWidth;
    fixedCanvas.height = wordGridElement.offsetHeight;
}

document.addEventListener('DOMContentLoaded', function() {
    const wordsContainer = document.getElementById('wordsContainer');

    words.forEach((word, index) => {
        const words_estract = document.createElement('div');
        words_estract.className = 'word-item';
        words_estract.id = 'word-' + word;
        words_estract.textContent = word;
        
        if (index < words.length - 1) {
            words_estract.textContent += ' - ';
        }
        
        wordsContainer.appendChild(words_estract);
    });

    createGrid(); 
    updateWordCount();
});

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
            cell.addEventListener('touchstart', startSelection, { passive: false });
            cell.addEventListener('touchmove', continueSelection, { passive: false });
            cell.addEventListener('touchend', endSelection, { passive: false });

            wordGridElement.appendChild(cell);
        });
    });
    
    // Inizializza i canvas dopo aver creato la griglia
    initializeCanvases();
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

//RIPULISCI LA SELEZIONE
export function clearSelection() {
    selectedCells.forEach(cell => cell.classList.remove('selected'));
    selectedCells = [];
}

//PAROLE SELEZIONATE
let guessedWords = [];

function updateWordCount() {
    const wordCountBadge = document.getElementById('wordCount');
    wordCountBadge.textContent = guessedWords.length;
}

// Aggiorna anche all'inizializzazione se l'array ha contenuti iniziali
document.addEventListener('DOMContentLoaded', function() {
    updateWordCount();  
});

//CREA PULSANTI CON ARTISTI TROVATI
function addWordToSideMenu() {
    const sideMenu = document.getElementById('sideMenu');
    sideMenu.innerHTML = '<h2>Parole Indovinate</h2>';  // Pulisce il contenuto precedente del sideMenu
    const conteainerWordDiv = document.createElement('main');
    sideMenu.appendChild(conteainerWordDiv);
    guessedWords.forEach(word => {
        const wordDiv = document.createElement('article');
        wordDiv.textContent = word;
        wordDiv.addEventListener('click', () => {
            const artist = artistData.find(a => a.nome === word);
            if (artist) {
                showPopup(artist);
            }
        });
        conteainerWordDiv.appendChild(wordDiv);
    });
}
function addTransitionDelays() {
    selectedCells.forEach((cell, index) => {
        cell.querySelector('span').style.transitionDelay = `${index * 0.1}s`;
    });
}

//SELEZIONE CELLE IN LINEA
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

//CREAZIONE LINEA DI SELEZIONE
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

//CREA LINEA EVIDENZIATORE GIALLA
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


// MOSTRA LETTERE SELEZIONATE
function displaySelectedWord() {
    const wordDisplay = document.getElementById('selected-word-display');
    const selectedWord = selectedCells.map(cell => cell.textContent).join('');
    wordDisplay.textContent = selectedWord;
}

// GESTIONE MENU LATERALE
document.addEventListener('click', function(event) {
    var menu = document.getElementById('sideMenu');
    var menuButton = document.getElementById('menuButton');

    if (menuButton.contains(event.target)) {
        // Se il menu è già aperto, chiudilo; altrimenti, aprilo
        if (menu.style.width === '70%') {
            menu.style.width = '0';
        } else {
            menu.style.width = '70%';
        }
    } else if (!menu.contains(event.target)) {
        // Se il click è fuori dal menu, chiudi il menu
        if (menu.style.width === '70%') {
            menu.style.width = '0';
        }
    }
});

//FETCH DATI SUGLI ARTISTI
let artistData = null; 

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

//MOSTRA IL POPUP
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
    artistButton.textContent = "BIGLIETTI";

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

// CONTROLLA SE LA PAROLA SELEZIONATA è CORRETTA
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
        const artist_id = correctWord; // Usa l'ID della parola come riferimento

        const artist = artistData.find(a => a.id === artist_id); // Trova l'artista per ID
        if (artist) {
            showPopup(artist); // Mostra il popup se l'artista è trovato
        }

        addWordToSideMenu();  
        updateWordCount();   
        addTransitionDelays();
        selectedCells.forEach(cell => cell.classList.add('correct'));

        // Change the color of the guessed word in the list
        const wordElement = document.getElementById('word-' + correctWord);
        if (wordElement) {
            wordElement.style.color = 'yellow';  // Change the color to yellow
        }

        return true;
    }
    clearSelection();
    return false;
}
