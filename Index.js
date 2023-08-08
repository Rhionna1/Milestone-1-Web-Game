//declaring constant variables

const gameBoard = document.querySelector (#gameBoard);
const ctx = gameBoard.getContext ("2d");
const scoreText = document.querySelector("#scoreText");
const resetBtn = document.querySelector("#resetBtn");
const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;
const boardBackground = "forestgreen";
const paddle1Color = "lightblue"; 
const paddle2Color = "red"; 
const paddleBoarder = "black";
const ballColor = "yellow";
const ballBoarderColor: "black";
const ballRadius = 12.5;
const paddleSpeed = 60;
//constant variables end here
//declaring other variables start here
let intervalID; 
let ballSpeed = 1;
let ballX = gameWidth / 2;
let ballY = gameHeight / 2;
let ballXDirection = 0;
let ballYDirection = 0;
let player1Score = 0;
let player2Score =0;
//declaring other variables end here
//paddle 1 position starts here
let paddle1 = {
    width:
}
//paddle 1 position ends here
//paddle 2 position starts here
//paddle 2 position ends here
