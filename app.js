var origBoard;
const huPlayer = 'O'; //human player play with O
const aiPlayer = 'X'; // ai agent play with X
let stop = false;
// all possible case of winning 
const winCombos = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[6, 4, 2]
]

//get all cells of the board
const cells = document.querySelectorAll('.cell');
// this function will start the game
startGame();

function startGame() {
    // stop to false
    stop = false;
    // hide the annoncement of the the winner if there is previous game
	document.querySelector(".winner").style.display = "none";
    // [1,2,3,.....,8]
	origBoard = Array.from(Array(9).keys());
	for (var i = 0; i < cells.length; i++) {
		cells[i].innerText = '';
        cells[i].style.backgroundColor = "#264653";
        // if the player click one of the cells the call the turnClick function
		cells[i].addEventListener('click', turnClick, false);
	}
}

function turnClick(square) {
    if (typeof (origBoard[square.target.id]) == 'number' ) {
        turn(square.target.id, huPlayer)
        if (!checkTie() && stop == false) turn(bestSpot(), aiPlayer);
    }
}

function turn(squareId, player) {
	origBoard[squareId] = player;
    console.log(origBoard);
	document.getElementById(squareId).innerText = player;
    let finish = checkWin(origBoard, player)
    if (finish!= null) gameOver(finish);
}

function checkWin(board, player){
    // all indexes of cells where the content is ether X or O
    let play = board.reduce((a, e, i) =>  (e === player) ? a.concat(i) : a, []);
    console.log(play)
    let gameWon = null;
    for (let [index, win] of winCombos.entries()){
        if (win.every(elem => play.indexOf(elem) > -1)) {
            gameWon =  {indexWin: win, player: player};
            break;
        }
    }
    return gameWon
}

function gameOver(gameWon){
    for (let index of gameWon.indexWin){
        document.getElementById(index).style.backgroundColor = "#1B9C85";
    }
    cells.forEach(cell => cell.removeEventListener("click", turnClick, false));
    stop = true;
    declarestatue(gameWon.player);
}

function emptySquares(){
    return origBoard.filter(cell => typeof cell == 'number');
}

function declarestatue(winner){
    document.querySelector(".winner").style.display = "block";
    if (winner != 'No Winner'){
        document.querySelector(".winner").innerText = `${winner} win`
    }else{
        document.querySelector(".winner").innerText = winner

    }
}

function checkTie(){
    if (emptySquares().length == 0){
        cells.forEach(cell => removeEventListener('click', turnClick, false));
        declarestatue("No Winner");
        return true;
    }
    return false;
}

function bestSpot(){
    return minimax(origBoard, aiPlayer).index;
}

function minimax(newBoard, player) {
	var availSpots = emptySquares();

	if (checkWin(newBoard, huPlayer)) {
		return {score: -10};
	} else if (checkWin(newBoard, aiPlayer)) {
		return {score: 10};
	} else if (availSpots.length === 0) {
		return {score: 0};
	}
	var moves = [];
	for (var i = 0; i < availSpots.length; i++) {
		var move = {};
		move.index = newBoard[availSpots[i]];
		newBoard[availSpots[i]] = player;

		if (player == aiPlayer) {
			var result = minimax(newBoard, huPlayer);
			move.score = result.score;
		} else {
			var result = minimax(newBoard, aiPlayer);
			move.score = result.score;
		}

		newBoard[availSpots[i]] = move.index;

		moves.push(move);
	}

	var bestMove;
	if(player === aiPlayer) {
		var bestScore = -10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	} else {
		var bestScore = 10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}

	return moves[bestMove];
}