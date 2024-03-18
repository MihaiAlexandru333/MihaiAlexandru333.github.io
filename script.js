const gameTile = document.getElementsByClassName("board_tile");
const oponentSelector = document.getElementById("oponent");
const difficultySelector = document.getElementById("difficulty");
const playerIndicator = document.getElementById("player_indicator");
const gameBoard = document.getElementById("board");
const reset = document.getElementById("reset");
const start = document.getElementById("start");
const difficultyDiv = document.getElementById("difficulty-div");

let difficulty = "";
let playerTurn = true;
let sign = "";
let computer = false;
let oponent = computer ? "computer" : "human";
let board = [
	["", "", ""],
	["", "", ""],
	["", "", ""],
];
let winStatus = false;
let playerName = "Select an Oponent";
let gameStarted = false;

if (oponent === "human") {
	difficultyDiv.setAttribute("hidden", true);
}

let whichComputer = () => {
	if (difficulty === "hard") {
		return computerHardPlay();
	}
	return computerRandomPlay();
};
playerIndicator.innerText = playerName;

function handleOponentSelect(e) {
	oponent = e.target.value;
	computer = oponent === "computer" ? true : false;
	oponent === "computer"
		? difficultyDiv.removeAttribute("hidden")
		: difficultyDiv.setAttribute("hidden", true);

	gameStarted = true;
}

function handleStart() {
	oponentSelector.setAttribute("disabled", true);
	difficultySelector.setAttribute("disabled", true);
	start.setAttribute("disabled", true);
}

start.addEventListener("click", handleStart);

function handleReset() {
	location.reload();
}

reset.addEventListener("click", handleReset);

oponentSelector.addEventListener("change", handleOponentSelect);

function handleDifficultySelect(e) {
	difficulty = e.target.value;
}

difficultySelector.addEventListener("change", handleDifficultySelect);

function addChildOnClick(event, sign) {
	if (!gameStarted) {
		alert("Select an oponent first");
		return;
	}

	let maxChildren = 1;
	const parentElement = event.target;
	let childElement = document.createElement("h1");
	if (
		parentElement.children.length < maxChildren &&
		childElement.children.length < maxChildren
	) {
		childElement.setAttribute("class", "inner-child");
		childElement.innerText = sign;
		parentElement.appendChild(childElement);
		console.log("chilndren", maxChildren);
		maxChildren = 2;
		playerTurn = !playerTurn;
		childElement.style.pointerEvents = "none";
		updatePlayerName();
		handleStart();
	} else {
		console.log("Maximum number of children reached");
	}
}

function updatePlayerName() {
	console.log("dificulty", difficulty);
	console.log("diffff", whichComputer);
	if (oponent === "human" && playerTurn && !computer) {
		playerName = "Player One's Turn";
	} else if (oponent === "human" && !playerTurn && !computer) {
		playerName = "Player Two's Turn";
	} else if (playerTurn && computer) {
		playerName = "Human's turn";
	} else if (!playerTurn && computer) {
		playerName = "Computer's turn";
		playerName = "Computer's turn : Thinking...";
		console.log("which computer", whichComputer);
		setTimeout(whichComputer, 1500);
	}
	playerIndicator.innerText = playerName;
}

Array.from(gameTile).forEach((element, index) => {
	element.addEventListener("click", (event) => {
		const sign = playerTurn ? "X" : "O";
		addChildOnClick(event, sign);
		const row = Math.floor(index / 3);
		const col = index % 3;
		board[row][col] = sign;
		const winStatus = checkWin(sign);
		console.log(winStatus);
		checkWhoWon(sign);
		// console.log("board", isBoardFull());
		// if (!checkWhoWon(sign) && isBoardFull()) {
		// 	alert(`Both players lost...DRAW.`);
		// }
	});
});

function checkWin(player) {
	//rows
	for (let i = 0; i < 3; i++) {
		if (
			board[i][0] === player &&
			board[i][1] === player &&
			board[i][2] === player
		) {
			return true;
		}
	}
	//columns
	for (let i = 0; i < 3; i++) {
		if (
			board[0][i] === player &&
			board[1][i] === player &&
			board[2][i] === player
		) {
			return true;
		}
	}
	//diagonals
	if (
		board[0][0] === player &&
		board[1][1] === player &&
		board[2][2] === player
	) {
		return true;
	}
	if (
		board[0][2] === player &&
		board[1][1] === player &&
		board[2][0] === player
	) {
		return true;
	}
	return false;
}

function getAvailableTiles() {
	const availableTiles = Array.from(gameTile).filter((tile) => {
		return !tile.hasChildNodes();
	});
	console.log(availableTiles);
	return availableTiles;
}

function computerRandomPlay() {
	console.log("easy Mode");
	const availableTiles = getAvailableTiles();
	if (availableTiles.length > 0) {
		const randomTile =
			availableTiles[Math.floor(Math.random() * availableTiles.length)];
		randomTile.click();
	}
}

function isBoardFull() {
	for (let i = 0; i < board.length; ++i) {
		for (let j = 0; j < board[i].length; ++j) {
			if (board[i][j] == "") {
				return false;
			}
		}
	}
	return true;
}

function checkWhoWon(player) {
	const winner = checkWin(player);
	if (winner) {
		setTimeout(() => {
			alert(`Game over ${player} won`);
		}, 100); // Delay alert for 100 milliseconds to update the board first
	} else if (isBoardFull()) {
		setTimeout(() => {
			alert(`Both players lost...DRAW.`);
		}, 100); // Delay alert for 100 milliseconds to update the board first
	}
}

function bestMove(board, isMaximizing) {
	function minimax(board, depth, isMaximizing) {
		if (checkWin("O")) {
			return { score: 10 - depth };
		} else if (checkWin("X")) {
			return { score: depth - 10 };
		} else if (isBoardFull()) {
			return { score: 0 };
		}

		let bestScore = isMaximizing ? -Infinity : Infinity;
		let move = null;

		for (let i = 0; i < 3; i++) {
			for (let j = 0; j < 3; j++) {
				if (board[i][j] === "") {
					board[i][j] = isMaximizing ? "O" : "X";
					let score = minimax(board, depth + 1, !isMaximizing).score;
					board[i][j] = "";

					if (isMaximizing) {
						if (score > bestScore) {
							bestScore = score;
							move = { i, j };
						}
					} else {
						if (score < bestScore) {
							bestScore = score;
							move = { i, j };
						}
					}
				}
			}
		}

		return { score: bestScore, move: move };
	}

	let result = minimax(board, 0, isMaximizing);
	return result.move;
}

function computerHardPlay() {
	console.log("Hard Mode");
	const move = bestMove(board, true);
	if (move) {
		const tile = gameTile[move.i * 3 + move.j];
		tile.click();
	}
}
