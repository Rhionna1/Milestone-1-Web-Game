//declaring variables
var DIRECTION = {
    IDLE: 0,
    UP: 1,
    DOWN: 2, 
    LEFT: 3, 
    RIGHT: 4
};

var rounds = [5,5,3,3,2];
var colors = ['#12104B', '#237A1B', '#AA66DD', '#8c52ff', '#2ecc71'];

//function for ball
var Ball = {
    new: function (incrementedSpeed) {
        return {
            width: 18,
            height: 18,
            x: (this.canvas.width /2)-9,
            y: (this.canvas.height /2)-9,
            moveX: DIRECTION.IDLE, 
            moveY: DIRECTION.IDLE,
            speed: incrementedSpeed || 7
        };
    }
};

//Function for the two lines that move up and down
var Ai = {
    new: function (side){
        return {
            width: 18,
            height: 180, 
            x: side === 'left' ? 150: this.canvas.width -150, 
            y: (this.canvas.height / 2) - 35, 
            score: 0, 
            move: DIRECTION.IDLE, 
            speed: 8

        };
    }
};
// function that creates the gameboard
var Game = {
    initialize: function () {
        this.canvas = document.querySelector('canvas');
        this.context = this.canvas.getContext('2d');

        this.canvas.width = 1400;
        this.canvas.height =1000;

        this.canvas.style.width = (this.canvas.width / 2) + 'px';
        this.canvas.style.height = (this.canvas.height / 2) + 'px';

        this.player = Ai.new.call(this, 'left');
        this.ai = Ai.new.call(this, 'right');
        this.ball = Ball.new.call(this); 

        this.ai.speed = 5;
        this.running = this.over = false; 
        this.turn = this.ai;
        this.timer = this.round = 0; 
        this.color = '#8c52ff';

        Pong.menu();
        Pong.listen();
    }
//at the end of the game the canva, font size, and color will change
    endGameMenu: function(text) {

    }
};




// // document.addEventListener('DOMContentLoaded', function(){
// //declaring constant variables
// const gameBoard = document.querySelector("#gameBoard");
// const gameContainer = document.querySelector("#gameContainer");
// const ctx = gameBoard.getContext("2d");
// const scoreText = document.querySelector("#scoreText");
// const resetBtn = document.querySelector("#resetBtn");
// const gameWidth = gameBoard.width;
// const gameHeight = gameBoard.height;
// const boardBackground = "forestgreen";
// const paddle1Color = "lightblue"; 
// const paddle2Color = "red"; 
// const paddleBoarder = "black";
// const ballColor = "yellow";
// const ballBoarderColor = "black";
// const ballRadius = 12.5;
// const paddleSpeed = 50;
// //constant variables end here
// //declaring other variables start here
// let intervalID; 
// let ballSpeed =1;
// let ballX = gameWidth / 2;
// let ballY = gameHeight / 2;
// let ballXDirection = 0;
// let ballYDirection = 0;
// let player1Score = 0;
// let player2Score =0;
// //declaring other variables end here
// //paddle 1 position starts here
// let paddle1 = {
//     width: 25,
//     height: 100,
//     x: 0,
//     y: 0
// };
// //paddle 1 position ends here
// //paddle 2 position starts here
// let paddle2 = {
//     width: 25,
//     height: 100,
//     x: gameWidth -25,
//     y: gameHeight -100
// };
// //paddle 2 position ends here

// //Event listenter for Keydown and reset button start here
// window.addEventListener("keydown", changeDirection);
// resetBtn.addEventListener("click", resetGame);
// //Event listenter for Keydown and reset button ends here

// //all functions start here
// gameStart();
// drawPaddles();

// // gamestart function starts here
// function gameStart(){
//     createBall();
//     nextTick();
// };
// // gameStart function ends here
// //nexTick function starts here
// function nextTick(){
//     intervalID = setTimeout (() => {
//         clearBoard();
//         drawPaddles();
//         moveBall();
//         drawBall(ballX, ballY);
//         checkCollision();
//         nextTick();
//     }, 10)
// };
// //nexTick function ends here
// //clearBoard function starts here
// function clearBoard(){
//     ctx.fillstyle = boardBackground; 
//     ctx.fillRect(0, 0, gameWidth, gameHeight);
// };
// //clearBoard function ends here
// //paddle design function starts here
// function drawPaddles(){
//     ctx.strokeStyle = paddleBoarder;

//     ctx.fillstyle = paddle1Color;
//     ctx.fillRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height);
//     ctx.strokeRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height);

//     ctx.fillstyle = paddle2Color;
//     ctx.fillRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height);
//     ctx.strokeRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height);
// };
// //paddle design function ends here
// //createBall function starts here
// function createBall(){
//     ballSpeed = 1;
//     if(Math.round(Math.random()) ==1){
//         ballXDirection = 1;
//     }
//     else{
//         ballXDirection = -1;  
//     }
//     if(Math.round(Math.random()) ==1){
//         ballYDirection = 1;
//     }
//     else{
//         ballYDirection = -1;  
//     }
//     ballX = gameWidth / 2;
//     ballY = gameHeight / 2; 
//     drawBall(ballX, ballY);  
// };
// //createBall function ends here
// //moveBall function starts here
// function moveBall(){
//     ballX += (ballSpeed * ballXDirection);
//     ballY += (ballSpeed * ballYDirection);
// };
// //moveBall function ends here
// //drawBall function starts here
// function drawBall(ballX, ballY){
//     ctx.fillstyle = ballColor;
//     ctx.strokeStyle = ballBoarderColor;
//     ctx.lineWidth = 2;
//     ctx.beginPath ();
//     ctx.arc(ballX, ballY, ballRadius, 0, 2 * Math.PI);
//     ctx.stroke();
//     ctx.fill();
// };
// //drawBall function ends here
// //checkCollision function starts here
// function checkCollision(){
//     if(ballY <= 0 + ballRadius){
//         ballYDirection *= -1;
//     }
//     if (ballY >= gameHeight - ballRadius){
//         ballYDirection *= -1;
//     }
//     if (ballX <= 0){
//         player2Score+=1;
//         updateScore();
//         createBall();
//         return;
//     }
//     if (ballX >= gameWidth){
//         player1Score+=1;
//         updateScore();
//         createBall();
//         return;
//     }
//     //ball bouncing off paddles IF statement starts here
//     if (ballX <= (paddle1.x + paddle1.width + ballRadius)){
//         if(ballY > paddle1.y && ballY < paddle1.y + paddle1.height){
//             ballX = (paddle1.x + paddle1.width) + ballRadius; //if ball gets stuck
//             ballXDirection *= -1;
//             ballSpeed += 1;
//         }
//     }
//     if (ballX >= (paddle2.x - ballRadius)){
//         if(ballY > paddle2.y && ballY < paddle2.y + paddle2.height){
//             ballX = paddle2.x - ballRadius; //if ball gets stuck
//             ballXDirection *= -1;
//             ballSpeed += 1;
//         }
//     }
//     //ball bouncing off paddles IF statement ends here
// };
// //checkCollision function ends here
// //changeDirection function starts here
// function changeDirection(event){
//     const keyPressed = event.keyCode;
//     console.log(keyPressed);
//     const paddle1Up = 87;
//     const paddle1Down = 83;
//     const paddle2Up =38;
//     const paddle2Down = 40;
// //press "S" to move down press "W" to move up for user
//     //up and down paddle1 abilities start here
//     switch(keyPressed){
//         case(paddle1Up):
//             if(paddle1.y > 0){
//             paddle1.y -= paddleSpeed;
//             }
//             break;
//         case(paddle1Down):
//             if (paddle1.y < gameHeight - paddle1.height){
//             paddle1.y += paddleSpeed;
//             }
//             break;
//          //up and down paddle1 abilities end here
//         //paddle 2 up and down controls start here
//         case(paddle2Up):
//             if (paddle2.y > 0){
//             paddle2.y -= paddleSpeed;
//             }
//             break;
//         case(paddle2Down):
//             if (paddle2.y < gameHeight - paddle2.height){
//             paddle2.y += paddleSpeed;
//             }
//             break;
//         //paddle2 up/down controls end here

//     }
// };
// //changeDirection function ends here
// //updateScore function starts here
// function updateScore(){
//     scoreText.textContent = '${player1Score} : {player2Score}';
// };
// //updateScore function ends here
// //reset game function starts here
// function resetGame(){
//     player1Score = 0;
//     player2Score =0;
//     paddle1 = {
//         width: 25,
//         height: 100,
//         x: 0,
//         y: 0
//     };
//     paddle2 = {
//         width: 25,
//         height: 100,
//         x: gameWidth -25,
//         y: gameHeight -100
//     };
//     ballSpeed = 1; 
//     ballX = 0; 
//     ballY = 0;
//     ballXDirection = 0; 
//     ballYDirection = 0;
//     updateScore();
//     clearInterval(intervalID);
//     gameStart();
// };
// //reset game function ends here
// //all functions end here