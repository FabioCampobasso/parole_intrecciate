document.addEventListener("DOMContentLoaded", function() {
    var overlayDesktop = document.getElementById('overlay-desktop');

    function checkDevice() {
        if (window.innerWidth > 768) { // Assuming 'mobile' is any screen smaller than 768px
            overlayDesktop.classList.add('active');
        } else {
            overlayDesktop.classList.remove('active');
        }
    }

    window.addEventListener('resize', checkDevice); // Check on resize
    checkDevice(); // Initial check
});

const words = [
"CRIME", "AMICO", "FUTBOL", "FRA", "ROSA", "FIABA", "FREUD", "WALL",
"BODYSCEMI", "NAPOLI", "MISSITALIA", "DANZA", "GRAZIE", "MILANO",
"BATTITO", "OBLIO", "RADIO", "CETTO", "DENARO", "TRIO", "ZELIG",
"ROMA", "FANS", "VITA", "ATHOS", "NEVE", "KRUSKA", "PSICHE", "STORIE",
"STREGA", "FATTO", "PAPA", "DORSEY", "PUB", "BOOMERS"
];


const grid = [
    ['F', 'A', 'T', 'T', 'O', 'A', 'B', 'P', 'C', 'L'],
    ['D', 'M', 'F', 'C', 'E', 'A', 'U', 'Z', 'O', 'P'],
    ['B', 'F', 'I', 'R', 'R', 'B', 'T', 'B', 'G', 'H'],
    ['I', 'O', 'J', 'L', 'E', 'I', 'T', 'H', 'K', 'L'],
    ['S', 'G', 'D', 'M', 'A', 'U', 'M', 'N', 'O', 'N'],
    ['T', 'N', 'R', 'Y', 'F', 'N', 'D', 'E', 'V', 'S'],
    ['O', 'A', 'D', 'A', 'S', 'A', 'O', 'V', 'I', 'Z'],
    ['R', 'P', 'G', 'A', 'Z', 'C', 'N', 'E', 'T', 'E'],
    ['I', 'O', 'R', 'E', 'N', 'I', 'E', 'S', 'A', 'L'],
    ['E', 'L', 'S', 'A', 'R', 'Z', 'E', 'M', 'R', 'I'],
    ['A', 'I', 'E', 'C', 'D', 'T', 'A', 'O', 'I', 'G'],
    ['M', 'S', 'D', 'O', 'M', 'I', 'S', 'C', 'B', 'F'],
    ['P', 'I', 'C', 'O', 'B', 'A', 'O', 'E', 'O', 'R'],
    ['E', 'S', 'S', 'V', 'R', 'L', 'Q', 'T', 'O', 'A'],
    ['B', 'F', 'I', 'S', 'P', 'S', 'I', 'T', 'M', 'X'],
    ['A', 'P', 'B', 'C', 'I', 'R', 'E', 'O', 'E', 'F'],
    ['T', 'M', 'D', 'A', 'H', 'T', 'O', 'Y', 'R', 'I'],
    ['P', 'R', 'I', 'E', 'T', 'E', 'A', 'M', 'S', 'A'],
    ['W', 'A', 'I', 'C', 'N', 'T', 'U', 'L', 'A', 'B'],
    ['A', 'Z', 'P', 'O', 'O', 'A', 'I', 'Y', 'I', 'A'],
    ['L', 'T', 'P', 'A', 'B', 'P', 'R', 'T', 'R', 'A'],
    ['L', 'K', 'R', 'U', 'S', 'K', 'A', 'O', 'O', 'W']   
];


let selectedCells = [];
let isSelecting = false;
let startCell = null;
let guessedWords = [];
let artistData = null;

const wordGridElement = document.getElementById('word-grid');
const dynamicCanvas = document.getElementById('selection-canvas');
const fixedCanvas = document.getElementById('fixed-canvas');
const dynamicCtx = dynamicCanvas.getContext('2d');
const fixedCtx = fixedCanvas.getContext('2d');

function initializeCanvases() {
    const rect = wordGridElement.getBoundingClientRect();
    dynamicCanvas.width = fixedCanvas.width = rect.width;
    dynamicCanvas.height = fixedCanvas.height = rect.height;
}

document.addEventListener('DOMContentLoaded', function() {
    const wordsContainer = document.getElementById('wordsContainer');

    words.forEach((word, index) => {
        const wordElement = document.createElement('div');
        wordElement.className = 'word-item';
        wordElement.id = 'word-' + word;
        wordElement.textContent = word;
        
        if (index < words.length - 1) {
            wordElement.textContent += ' - ';
        }
        
        wordsContainer.appendChild(wordElement);
    });

    createGrid();
    initializeCanvases();
});

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
}

function startSelection(event) {
    event.preventDefault();
    clearSelection();
    isSelecting = true;
    startCell = event.target.closest('div');
    selectCell(startCell);
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
            const clientX = touch ? touch.clientX : event.clientX;
            const clientY = touch ? touch.clientY : event.clientY;
            drawLineToCellCenter(startCell, clientX, clientY);
        }
    }
}

function endSelection(event) {
    event.preventDefault();
    isSelecting = false;
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

function clearSelection() {
    selectedCells.forEach(cell => cell.classList.remove('selected'));
    selectedCells = [];
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

function getVwInPixels(vw) {
    return vw * (document.documentElement.clientWidth / 100);
}

const lineWidth = getVwInPixels(8); 


function drawLineToCellCenter(startCell, clientX, clientY) {

    const rect = wordGridElement.getBoundingClientRect();
    const cellWidth = startCell.offsetWidth;
    const cellHeight = startCell.offsetHeight;
    const startX = startCell.offsetLeft + cellWidth / 2;
    const startY = startCell.offsetTop + cellHeight / 2;
    const endCell = document.elementFromPoint(clientX, clientY);
    if (!endCell || !endCell.closest('#word-grid > div')) return;
    const targetCell = endCell.closest('#word-grid > div');

    const targetRect = targetCell.getBoundingClientRect();
    const adjustedEndX = targetRect.left + targetRect.width / 2 - rect.left;
    const adjustedEndY = targetRect.top + targetRect.height / 2 - rect.top;

    const circleDiameter = lineWidth;
    const circleRadius = circleDiameter / 2;

    dynamicCtx.clearRect(0, 0, dynamicCanvas.width, dynamicCanvas.height);

    dynamicCtx.beginPath();
    dynamicCtx.moveTo(startX, startY);
    dynamicCtx.lineTo(adjustedEndX, adjustedEndY);
    dynamicCtx.strokeStyle = 'rgb(200, 200, 200)';
    dynamicCtx.lineWidth = lineWidth;
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

    const circleDiameter = lineWidth;
    const circleRadius = circleDiameter / 2;

    fixedCtx.beginPath();
    fixedCtx.moveTo(startX, startY);
    fixedCtx.lineTo(endX, endY);
    fixedCtx.strokeStyle = color;
    fixedCtx.lineWidth = lineWidth;
    fixedCtx.stroke();

    fixedCtx.beginPath();
    fixedCtx.arc(startX, startY, circleRadius, 0, 2 * Math.PI, false);
    fixedCtx.fillStyle = color;
    fixedCtx.fill();

    fixedCtx.beginPath();
    fixedCtx.arc(endX, endY, circleRadius, 0, 2 * Math.PI, false);
    fixedCtx.fillStyle = color;
    fixedCtx.fill();
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
        const artist_id = correctWord;

        const artist = artistData.find(a => a.id === artist_id);
        if (artist) {
            showPopup(artist);
            showCard(artist);
        }

        addTransitionDelays();
        selectedCells.forEach(cell => cell.classList.add('correct'));

        const wordElement = document.getElementById('word-' + correctWord);
        if (wordElement) {
            wordElement.style.color = 'lightgray';
        }

        return true;
    }
    clearSelection();
    return false;
}

function addTransitionDelays() {
    selectedCells.forEach((cell, index) => {
        cell.querySelector('span').style.transitionDelay = `${index * 0.1}s`;
    });
}

function showPopup(artist) {
    const popup = document.createElement('div');
    popup.classList.add('popup', 'card');
    popup.style.width = '18rem';
    popup.id = 'popup';
    popup.style.backgroundColor = 'yellow';
    popup.style.border = '5px solid #000';

    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');

    const artistName = document.createElement('h3');
    artistName.classList.add('card-title', 'roboto-con-bold');
    artistName.textContent = artist.nome;

    const artistShow = document.createElement('h5');
    artistShow.classList.add('card-text', 'roboto-con-semibold');
    artistShow.textContent = artist.spettacolo;

    const artistDatesContainer = document.createElement('div');
    artistDatesContainer.classList.add('card-text', 'roboto-con-semibold');
    artist.date.forEach(date => {
        const artistDate = document.createElement('div');
        artistDate.textContent = date;
        artistDatesContainer.appendChild(artistDate);
    });

    const artistButton = document.createElement('a');
    artistButton.classList.add('roboto-con-bold', 'boot-button');
    artistButton.href = artist.button;
    artistButton.target = '_blank';
    artistButton.textContent = "BIGLIETTI";
    artistButton.style.display = 'inline-block';
    artistButton.style.textDecoration = 'none';

    const closeButton = document.createElement('button');
    closeButton.classList.add('btn');
    closeButton.textContent = "X";
    closeButton.style.position = 'absolute';
    closeButton.style.top = '10px';
    closeButton.style.right = '10px';

    const closePopup = () => {
        popup.remove();
        document.removeEventListener('mousedown', handleOutsideInteraction);
        document.removeEventListener('touchstart', handleOutsideInteraction);
    };

    closeButton.onclick = closePopup;

    const handleOutsideInteraction = (e) => {
        if (!popup.contains(e.target)) {
            closePopup();
        }
    };

    cardBody.appendChild(artistName);
    cardBody.appendChild(artistShow);
    cardBody.appendChild(artistDatesContainer);
    cardBody.appendChild(artistButton);
    popup.appendChild(cardBody);
    popup.appendChild(closeButton);

    document.body.appendChild(popup);
    
    setTimeout(() => {
        document.addEventListener('mousedown', handleOutsideInteraction);
        document.addEventListener('touchstart', handleOutsideInteraction);
    }, 0);
}
let isYellow = true; // Variabile per tenere traccia dell'alternanza dei colori

function showCard(artist) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.style.width = '100%';  // Larghezza della card adattata
    card.style.paddingLeft = '5px';
    card.style.backgroundColor = isYellow ? '#FFFF00' : 'lightgray';  // Alternanza di colori di sfondo

    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body','pt-3','pb-3');

    const artistName = document.createElement('h4');
    artistName.classList.add( 'roboto-con-bold');
    artistName.textContent = artist.nome;
    artistName.style.color = '#000000';  // Alternanza di colori di testo

    const artistShow = document.createElement('h5');
    artistShow.classList.add( 'roboto-con-semibold');
    artistShow.textContent = artist.spettacolo;
    artistShow.style.color = '#000000';  // Alternanza di colori di testo

    const artistDatesContainer = document.createElement('div');
    artistDatesContainer.classList.add('roboto-con-semibold', 'date-container');
    artist.date.forEach(date => {
        const artistDate = document.createElement('p');
        artistDate.textContent = date;
        artistDate.style.color ='#000000';  // Alternanza di colori di testo
        artistDatesContainer.appendChild(artistDate);
    });

    const artistButton = document.createElement('a');
    artistButton.classList.add('roboto-con-bold', 'boot-button');
    artistButton.href = artist.button;
    artistButton.target = '_blank';
    artistButton.textContent = "BIGLIETTI";
    artistButton.style.display = 'inline-block';
    artistButton.style.textDecoration = 'none';
    artistButton.style.backgroundColor = isYellow ? '#000000' : '#FFFF00';  // Alternanza di colori del bottone
    artistButton.style.color = isYellow ? '#FFFF00' : '#000000';  // Inverti il colore del testo nel bottone

    cardBody.appendChild(artistName);
    cardBody.appendChild(artistShow);
    cardBody.appendChild(artistDatesContainer);
    cardBody.appendChild(artistButton);
    card.appendChild(cardBody);

    document.getElementById('card-display-area').appendChild(card);

    isYellow = !isYellow;  // Inverti il flag per la prossima card
}





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

window.addEventListener('resize', initializeCanvases);


document.addEventListener("DOMContentLoaded", function() {
    const osInstance = OverlayScrollbars(document.querySelector("#scroll-container"), {
        className: "os-theme-custom",
        scrollbars: {
            autoHide: "never",
            dragScrolling: true,
            clickScrolling: true,
            touchSupport: true,
            snapHandle: true
        },
        overflowBehavior: {
            x: "hidden",
            y: "scroll"
        }
    });

    // Imposta la posizione di scorrimento all'inizio
    osInstance.scroll({ y: "0%" }, 2);
});
  