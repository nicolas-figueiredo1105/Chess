const wPawn = "♙";
const wKnight = "♘";
const wBishop = "♗";
const wRook = "♖";
const wQueen = "♕";
const wKing = "♔";
    
const bPawn = "♟";
const bKnight = "♞";
const bBishop = "♝";
const bRook = "♜";
const bQueen = "♛";
const bKing = "♚";
    
const boardElement = document.getElementById('board');
const gameOverText = document.getElementById('gameOver');
const container = document.getElementById('container');

gameOverText.style.display = 'none';


let whiteTurn = true;
    
var board = [[bRook, bKnight, bBishop, bQueen, bKing, bBishop, bKnight, bRook],
            [bPawn, bPawn, bPawn, bPawn, bPawn, bPawn, bPawn, bPawn],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            [wPawn, wPawn, wPawn, wPawn, wPawn, wPawn, wPawn, wPawn],
            [wRook, wKnight, wBishop, wQueen, wKing, wBishop, wKnight, wRook]
];

let possibleMoves = [];
    
    
function drawBoard(){
    for(let row = 0; row < 8; row++){
        for(let col = 0; col < 8; col++){
            const cell = document.createElement('div');
            cell.className = 'cell ' + ((row + col) % 2 ? 'dark' : 'bright');
            cell.textContent = board[row][col];
            cell.setAttribute('data-row', row);
            cell.setAttribute('data-col', col);
            boardElement.appendChild(cell);

            if(board[row][col] == wPawn || board[row][col]== bPawn){
                cell.setAttribute('name', 'notMoved');
            }
        }
    }
}

function changeBoardColor(color){
    const cells = boardElement.querySelectorAll('.cell');
    cells.forEach(cell => {
        let row = parseInt(cell.getAttribute('data-row'));
        let col = parseInt(cell.getAttribute('data-col'));
        if((row + col) % 2 == 0){
            switch(color){
                case 'red':
                    cell.style.backgroundColor = 'rgb(180, 76, 76)';
                    break;
                case 'blue':
                    cell.style.backgroundColor = 'rgb(107, 107, 221)';
                    break;
                case 'white':
                    cell.style.backgroundColor = '#FFFFFF';
                    break;
                case 'default':
                    cell.style.backgroundColor = '#acc49e';
                    break;
            }
        } else {
            switch (color) {
                case 'red':
                    cell.style.backgroundColor = 'rgb(119, 40, 40)';
                    break;
                case 'blue':
                    cell.style.backgroundColor = 'rgb(54, 54, 185)';
                    break;
                case 'white':
                    cell.style.backgroundColor = '#888888';
                    break;
                case 'default':
                    cell.style.backgroundColor = '#516645';
                    break;
            }
        }
    });
}

function toggleDisplay() {
    const settings = document.getElementById('displayToggle');
    settings.classList.toggle('move-in');
}


const redBoard = document.getElementById('red');
const blueBoard = document.getElementById('blue');
const whiteBoard = document.getElementById('blackWhite');
const defaultBoard = document.getElementById('default');

for(let row = 0; row < 8; row++){
    for(let col = 0; col < 8; col++){
        const cell = document.createElement('div');
        cell.className = 'cell ' + ((row + col) % 2 ? 'darkRed' : 'brightRed');
        redBoard.appendChild(cell);
    }
}

for(let row = 0; row < 8; row++){
    for(let col = 0; col < 8; col++){
        const cell = document.createElement('div');
        cell.className = 'cell ' + ((row + col) % 2 ? 'darkBlue' : 'brightBlue');
        blueBoard.appendChild(cell);
    }
}

for(let row = 0; row < 8; row++){
    for(let col = 0; col < 8; col++){
        const cell = document.createElement('div');
        cell.className = 'cell ' + ((row + col) % 2 ? 'darkWhite' : 'brightWhite');
        whiteBoard.appendChild(cell);
    }
}

for(let row = 0; row < 8; row++){
    for(let col = 0; col < 8; col++){
        const cell = document.createElement('div');
        cell.className = 'cell ' + ((row + col) % 2 ? 'dark' : 'bright');
        defaultBoard.appendChild(cell);
    }
}

    
drawBoard();

function updateBoard(){
    const cells = boardElement.querySelectorAll('.cell');
    cells.forEach(cell => {
        const row = cell.getAttribute('data-row');
        const col = cell.getAttribute('data-col');

        cell.textContent = board[row][col];
    })
}

let selectedCell;

boardElement.addEventListener('click', function(event){
    if(event.target.classList.contains('cell')){
        const clickedPiece = event.target.textContent;
        if(!selectedCell && whiteTurn && isWhitePiece(clickedPiece)){
            selectedCell = event.target;
            const row = parseInt(event.target.getAttribute('data-row'));
            const col = parseInt(event.target.getAttribute('data-col'));
            const piece = event.target.textContent;

            
            highlightMove(row,col, piece);
        } else if (!selectedCell && !whiteTurn && isBlackPiece(clickedPiece)){
            selectedCell = event.target;
            const row = parseInt(event.target.getAttribute('data-row'));
            const col = parseInt(event.target.getAttribute('data-col'));
            const piece = clickedPiece;

            highlightMove(row, col, piece);
        } else if(selectedCell){
            if(event.target.classList.contains('possibleMove')){
                const newRow = parseInt(event.target.getAttribute('data-row'));
                const newCol = parseInt(event.target.getAttribute('data-col'));

                board[newRow][newCol] = board[selectedCell.getAttribute('data-row')][selectedCell.getAttribute('data-col')];
                board[selectedCell.getAttribute('data-row')][selectedCell.getAttribute('data-col')] = '';
                updateBoard();
                changeTurn();
                clearHighlight();
                checkGameOver();
                selectedCell = null;
            } else {
                selectedCell = null;
                clearHighlight();
            }
        }
    }
});



function applyHighlights(possibleMoves) {
    possibleMoves.forEach(move => {
        const cell = document.querySelector(`.cell[data-row="${move.row}"][data-col="${move.col}"]`);
        if(cell) {
            cell.classList.add('possibleMove');
        }
    });
}

function checkMovement(row, col, piece){
    possibleMoves = []; 
    const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
    

    switch(piece){
        case wPawn:
            if(isEmpty(row - 1, col) && cell.getAttribute('name') == 'notMoved'){
                possibleMoves.push({row: row - 1, col: col});
                possibleMoves.push({row: row - 2, col: col});
            } else if(isEmpty(row - 1, col) && cell.getAttribute('name') != 'notMoved'){
                possibleMoves.push({row: row - 1, col: col});
            }
            if(isEnemyPiece(row - 1, col - 1)){
                possibleMoves.push({row: row - 1, col: col - 1});
            }
            if(isEnemyPiece(row - 1, col + 1)){
                possibleMoves.push({row: row - 1, col: col + 1})
            }
            break;

        // Horizontal movement to the left
        case wRook:
        case bRook:
            for(let c = col - 1; c >= 0; c--){
                if(isEmpty(row, c)){
                    possibleMoves.push({row: row, col: c});
                } else if(isEnemyPiece(row, c)){
                    possibleMoves.push({row: row, col: c});
                    break;  
                } else {
                    break;
                }
            }

            // Horizontal movement to the right
            for(let c = col + 1; c < 8; c++){
                if(isEmpty(row, c)){
                    possibleMoves.push({row: row, col: c});
                } else if(isEnemyPiece(row, c)){
                    possibleMoves.push({row: row, col: c});
                    break;  
                } else {
                    break;
                }
            }

            // Vertical movement upwards
            for(let r = row - 1; r >= 0; r--){
                if(isEmpty(r, col)){
                    possibleMoves.push({row: r, col: col});
                } else if(isEnemyPiece(r, col)){
                    possibleMoves.push({row: r, col: col});
                    break;  
                } else {
                    break;
                }
            }

            // Vertical movement downwards
            for(let r = row + 1; r < 8; r++){
                if(isEmpty(r, col)){
                    possibleMoves.push({row: r, col: col});
                } else if(isEnemyPiece(r, col)){
                    possibleMoves.push({row: r, col: col});
                    break;  
                } else {
                    break;
                }
            }

            break;


        case wKnight:
        case bKnight:
            if(isValidMove(row + 2, col - 1)){
                if((isEmpty(row + 2, col - 1) || isEnemyPiece(row + 2, col - 1))){
                    possibleMoves.push({row: row + 2, col: col - 1});
                }
            }
            if(isValidMove(row + 2, col + 1)){
                if((isEmpty(row + 2, col + 1) || isEnemyPiece(row + 2, col + 1))){
                    possibleMoves.push({row: row + 2, col: col + 1});
                }
            }
            if(isValidMove(row - 2, col - 1)){
                if((isEmpty(row - 2, col - 1) || isEnemyPiece(row - 2, col - 1))){
                    possibleMoves.push({row: row - 2, col: col - 1});
                }
            }
            
            if(isValidMove(row - 2, col + 1)){
                if((isEmpty(row - 2, col + 1) || isEnemyPiece(row - 2, col + 1))){
                    possibleMoves.push({row: row - 2, col: col + 1});
                }
            }

            if(isValidMove(row + 1, col + 2)){
                if((isEmpty(row + 1, col + 2) || isEnemyPiece(row + 1, col + 2))){
                    possibleMoves.push({row: row + 1, col: col + 2});
                }
            }
            
            if(isValidMove(row - 1, col + 2)){
                if((isEmpty(row - 1, col + 2) || isEnemyPiece(row - 1, col + 2))){
                    possibleMoves.push({row: row - 1, col: col + 2});
                }
            }

            if(isValidMove(row + 1, col - 2)){
                if((isEmpty(row + 1, col  -2) || isEnemyPiece(row + 1, col  -2))){
                    possibleMoves.push({row: row + 1, col: col - 2});
                }
            }
            
            if(isValidMove(row - 1, col - 2)){
                if((isEmpty(row - 1, col - 2) || isEnemyPiece(row - 1, col - 2))){
                    possibleMoves.push({row: row - 1, col: col - 2});
                }
            }
            
            
            break;

        case wBishop:
        case bBishop:
            // Diagonal movement to the upper right
            for (let i = 1; row - i >= 0 && col + i < 8; i++) {
                if (isEmpty(row - i, col + i)) {
                    possibleMoves.push({row: row - i, col: col + i});
                } else if (isEnemyPiece(row - i, col + 1)) {
                    possibleMoves.push({row: row - i, col: col + i});
                    break;  
                } else {
                    break; 
                }
            }

            // Diagonal movement to the upper left
            for (let i = 1; row - i >= 0 && col - i >= 0; i++) {
                if (isEmpty(row - i, col - i)) {
                    possibleMoves.push({row: row - i, col: col - i});
                } else if (isEnemyPiece(row - i, col - i)) {
                    possibleMoves.push({row: row - i, col: col - i});
                    break;  
                } else {
                    break; 
                }
            }

            // Diagonal movement to the lower right
            for (let i = 1; row + i < 8 && col + i < 8; i++) {
                if (isEmpty(row + i, col + i)) {
                    possibleMoves.push({row: row + i, col: col + i});
                } else if (isEnemyPiece(row + 1, col + 1)) {
                    possibleMoves.push({row: row + i, col: col + i});
                    break;  
                } else {
                    break; 
                }
            }

            // Diagonal movement to the lower left
            for (let i = 1; row + i < 8 && col - i >= 0; i++) {
                if (isEmpty(row + i, col - i)) {
                    possibleMoves.push({row: row + i, col: col - i});
                } else if (isEnemyPiece(row + i, col - i)) {
                    possibleMoves.push({row: row + i, col: col - i});
                    break;  
                } else {
                    break; 
                }
            }
            break;

            case wQueen:
            case bQueen:
                for (let i = 1; row - i >= 0 && col + i < 8; i++) {
                    if (isEmpty(row - i, col + i)) {
                        possibleMoves.push({row: row - i, col: col + i});
                    } else if (isEnemyPiece(row - i, col + i)) {
                        possibleMoves.push({row: row - i, col: col + i});
                        break;  
                    } else {
                        break;  
                    }
                }
    
                // Diagonal movement to the upper left
                for (let i = 1; row - i >= 0 && col - i >= 0; i++) {
                    if (isEmpty(row - i, col - i)) {
                        possibleMoves.push({row: row - i, col: col - i});
                    } else if (isEnemyPiece(row - i, col - i)) {
                        possibleMoves.push({row: row - i, col: col - i});
                        break;  
                    } else {
                        break;  
                    }
                }
    
                // Diagonal movement to the lower right
                for (let i = 1; row + i < 8 && col + i < 8; i++) {
                    if (isEmpty(row + i, col + i)) {
                        possibleMoves.push({row: row + i, col: col + i});
                    } else if (isEnemyPiece(row + i, col + i)) {
                        possibleMoves.push({row: row + i, col: col + i});
                        break;  
                    } else {
                        break;  
                    }
                }
    
                // Diagonal movement to the lower left
                for (let i = 1; row + i < 8 && col - i >= 0; i++) {
                    if (isEmpty(row + i, col - i)) {
                        possibleMoves.push({row: row + i, col: col - i});
                    } else if (isEnemyPiece(row + i, col - i)) {
                        possibleMoves.push({row: row + i, col: col - i});
                        break;  
                    } else {
                        break;  
                    }
                }

                // Horizontal movement to the left
                for(let c = col - 1; c >= 0; c--){
                    if(isEmpty(row, c)){
                        possibleMoves.push({row: row, col: c});
                    } else if(isEnemyPiece(row, c)){
                        possibleMoves.push({row: row, col: c});
                        break;
                    } else {
                        break;
                    }
                }

                // Horizontal movement to the right
                for(let c = col + 1; c < 8; c++){
                    if(isEmpty(row, c)){
                        possibleMoves.push({row: row, col: c});
                    } else if(isEnemyPiece(row, c)){
                        possibleMoves.push({row: row, col: c});
                        break;
                    } else {
                        break;
                    }
                }

                // Vertical movement upwards
                for(let r = row - 1; r >= 0; r--){
                    if(isEmpty(r, col)){
                        possibleMoves.push({row: r, col: col});
                    } else if(isEnemyPiece(r, col)){
                        possibleMoves.push({row: r, col: col});
                        break;
                    } else {
                        break;
                    }
                }

                // Vertical movement downwards
                for(let r = row + 1; r < 8; r++){
                    if(isEmpty(r, col)){
                        possibleMoves.push({row: r, col: col});
                    } else if(isEnemyPiece(r, col)){
                        possibleMoves.push({row: r, col: col});
                        break;
                    } else {
                        break;
                    }
                }
                break;
            
                case wKing:
                case bKing:
                    for(let r = -1; r <= 1; r++){
                        for(let c = -1; c <= 1; c++){
                            const newRow = row + r;
                            const newCol = col + c;
                            if(isValidMove(newRow, newCol) && ((isEmpty(newRow, newCol) || isEnemyPiece(newRow, newCol)))){
                                possibleMoves.push({row: newRow, col: newCol});
                            }
                        }
                    }
                    break;
                    

                case bPawn:
                    if(isEmpty(row + 1, col) && cell.getAttribute('name') == 'notMoved'){
                        possibleMoves.push({row: row + 1, col: col});
                        possibleMoves.push({row: row + 2, col: col});
                    } else if(isEmpty(row + 1, col) && cell.getAttribute('name') != 'notMoved'){
                        possibleMoves.push({row: row + 1, col: col});
                    } 
                    if(isEnemyPiece(row + 1, col - 1)){
                        possibleMoves.push({row: row + 1, col: col - 1});
                    }
                    if(isEnemyPiece(row + 1, col + 1)){
                        possibleMoves.push({row: row + 1, col: col + 1})
                    }
                    break;
    }
}

function highlightMove(row, col, piece){
    checkMovement(row, col, piece)

    applyHighlights(possibleMoves);
}

function clearHighlight(){
    document.querySelectorAll(".possibleMove").forEach(el => {el.classList.remove('possibleMove')});
}

function isEmpty(row, col) {
    return board[row][col] == '';
}

function checkTurn(){
    if(whiteTurn){
        return 'w';
    } else {
        return 'b';
    }
}

function changeTurn(){
    whiteTurn = !whiteTurn;
}

function isEnemyPiece(row, col) {
    const piece = board[row][col];
    const turn = checkTurn();
    
    if (turn === 'w') {
        return piece === bPawn || piece === bKnight || piece === bBishop || piece === bRook || piece === bQueen || piece === bKing;
    } else {
        return piece === wPawn || piece === wKnight || piece === wBishop || piece === wRook || piece === wQueen || piece === wKing;
    }
}

function findKing(turn) {
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            if ((turn === 'w' && board[row][col] === wKing) || (turn === 'b' && board[row][col] === bKing)) {
                return { row, col };
            }
        }
    }
}

function isWhitePiece(piece) {
    return piece.charAt(0) === '♙' || piece.charAt(0) === '♘' || piece.charAt(0) === '♗' || piece.charAt(0) === '♖' || piece.charAt(0) === '♕' || piece.charAt(0) === '♔';
}

function isBlackPiece(piece) {
    return piece.charAt(0) === '♟' || piece.charAt(0) === '♞' || piece.charAt(0) === '♝' || piece.charAt(0) === '♜' || piece.charAt(0) === '♛' || piece.charAt(0) === '♚';
}

function isValidMove(row, col) {
    return row >= 0 && row < 8 && col >= 0 && col < 8;
}

function resetGame(){
    board = [[bRook, bKnight, bBishop, bQueen, bKing, bBishop, bKnight, bRook],
            [bPawn, bPawn, bPawn, bPawn, bPawn, bPawn, bPawn, bPawn],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            [wPawn, wPawn, wPawn, wPawn, wPawn, wPawn, wPawn, wPawn],
            [wRook, wKnight, wBishop, wQueen, wKing, wBishop, wKnight, wRook]
    ];

    updateBoard();
    whiteTurn = true;
}

function checkGameOver(){
    
    const winnerDisplay = document.getElementById('winner');

    let whiteKing = false;
    let blackKing = false;

    for(let i = 0; i < 8; i++){
        for(let j = 0; j < 8; j++){
            if(board[i][j] == bKing){
                blackKing = true;
                break;
            }
            if(board[i][j] == wKing){
                whiteKing = true;
                break;
            }
        }
    }
    if(whiteKing && blackKing){
        return;
    } else {
        container.style.opacity = 0.3;
        gameOverText.style.display = 'block';

        if(blackKing){
            winnerDisplay.textContent = "Black Wins!";
        } else {
            winnerDisplay.textContent = "White Wins!";
        }

        setTimeout(function(){
            resetGame();
            container.style.opacity = 1;
            gameOverText.style.display = 'none';
        }, 5000);
        
    }
}