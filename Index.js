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
const ballBoarderColor = "black";
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
    width: 25,
    height: 100,
    x: 0,
    y: 0
};
//paddle 1 position ends here
//paddle 2 position starts here
let paddle2 = {
    width: 25,
    height: 100,
    x: gameWidth -25,
    y: gameHeight -100
};
//paddle 2 position ends here

//Event listenter for Keydown and reset button start here
window.addEventListener("keydown", changeDirection);
resetBtn.addEventListener("click", resetGame);
//Event listenter for Keydown and reset button ends here

//all functions start here
gameStart ();

// gamestart function starts here
function gameStart(){
    createBall();
    nextTick();
};
// gameStart function ends here
//nexTick function starts here
function nextTick(){
    intervalID = setTimeout (() => {
        clearBoard ();
        drawPaddles();
        moveBall();
        drawBall(ballX, ballY);
        checkCollision();
        nextTick();
    }, 10)
};
//nexTick function ends here
//clearBoard function starts here
function clearBoard(){
    ctx.fillstyle = boardBackground; 
    ctx.fillRect(0, 0, gameWidth, gameHeight);
};
//clearBoard function ends here
//paddle design function starts here
function drawPaddles(){
    ctx.strokeStyle = paddleBoarder;

    ctx.fillstyle = paddle1Color;
    ctx.fillRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height);
    ctx.strokeRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height);

    ctx.fillstyle = paddle2Color;
    ctx.fillRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height);
    ctx.strokeRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height);

};
//paddle design function ends here
//createBall function starts here
function createBall(){
    ballSpeed = 1;
    if()
};
//createBall function ends here
//moveBall function starts here
function moveBall(){};
//moveBall function ends here
//drawBall function starts here
function drawBall(ballX, ballY){
    ctx.fillstyle = ballColor;
    ctx.strokeStyle = ballBoarderColor;
    ctx.lineWidth = 2;
    ctx.beginPath ();
    ctx.arc(ballX, ballY, ballRadius, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();
};
//drawBall function ends here
function checkCollision(){};
//changeDirection function starts here
function changeDirection(event){
    const keyPressed = event.keyCode;
    const paddle1Up = 87;
    const paddle1Down = 83;
    const paddle2Up =38;
    const paddle2Down = 40;
//press "S" to move down press "W" to move up for user
    //up and down paddle1 abilities start here
    switch(keyPressed){
        case(paddle1Up):
            if(paddle1.y > 0){
            paddle1.y -= paddleSpeed;
            }
            break;
        case(paddle1Down):
            if (paddle1.y < gameHeight - paddle1.height){
            paddle1.y += paddleSpeed;
            }
            break;
         //up and down paddle1 abilities end here
        //paddle 2 up and down controls start here
        case(paddle2Up):
            if (paddle2.y > 0){
            paddle2.y -= paddleSpeed;
            }
            break;
        case(paddle2Down):
            if (paddle2.y < gameHeight - paddle2.height){
            paddle2.y += paddleSpeed;
            }
            break;
        //paddle2 up/down controls end here

    }
};
//changeDirection function ends here
function updateScore(){};
function resetGame(){};
//all functions end here

