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
    },

    endGameMenu: function(text) {
        //at the end of the game the canva, font size, and color will change
        Pong.context.font = '45px Courier New';
        Pong.context.fillStyle = this.color;

        //make a box behind user instructions text
        Pong.context.fillRect(
            Pong.canvas.width / 2 - 350, 
            Pong.canvas.height / 2 -48,
            700, 
            100
        );

        //changing the background color on canvas
        Pong.context.fillStyle = '#ffffff';
        
        //add text to the end of the game
        Pong.context.fillText(text, 
            Pong.canvas.width / 2, 
            Pong.canvas.height / 2 + 15
        );

        setTimeout(function (){
            Pong = Object.assign({}, Game);
            Pong.initialize();
        }, 3000);
    },

    menu: function (){
      Pong.draw();
      
      //changing the font size and color
      this.context.font = '50px Courier New';
      this.context.fillStyle = this.color;
      
     //draw the rectangle behind the user instruction text to make functionality consistent
        this.context.fillRect(
            this.canvas.width / 2 - 350, 
            this.canvas.height / 2 -48,
            700, 
            100
        );
      //changing the background color on canvas
     this.context.fillStyle = '#ffffff';

     //'press any key to begin' text 
        this.context.fillText('Press any key to begin',
            this.canvas.width / 2,
            this.canvas.height / 2 + 15
        );

    },

    //updates to move the player, ball..etc
    update: function() {
        if (!this.over){
            //if the ball touches the edges of the gameboard
            if(this.ball.x <=0) Pong._resetTurn.call(this, this.ai, this.player);
            if(this.ball.x >= this.canvas.width - this.ball.width) Pong._resetTurn.call(this, this.player, this.ai);
            if(this.ball.y <= 0) this.ball.moveY = DIRECTION.DOWN;
            if(this.ball.y >= this.canvas.height - this.ball.height) this.ball.moveY = DIRECTION.UP;

            //move the player when triggered by keyboard event
            if(this.player.move === DIRECTION.UP) this.player.y -= this.player.speed;
            else if(this.player.move === DIRECTION.DOWN) this.player.y += this.player.speed;

            //move the ball to the correct side at the start of a new level
            //make direction of the ball random 
            if(Pong._turnDelayIsOver.call (this) && this.turn){
                this.ball.moveX = this.turn === this.player ? DIRECTION.LEFT : DIRECTION.RIGHT;
                this.ball.moveY = [DIRECTION.UP, DIRECTION.DOWN] [Math.round(Math.random())];
                this.ball.y = Math.floor(Math.random() * this.canvas.height - 200) + 200;
                this.turn = null;
            }

            //player collides with bounds of game, update the x/y coordinates
            if(this.player.y <= 0) this.player.y = 0;
            else if(this.player.y >= (this.canvas.height - this.player.height)) this.player.y = (this.canvas.height - this.player.height);

            //move the ball in the direction it is supposed to go
            if(this.ball.moveY === DIRECTION.UP) this.ball.y -= (this.ball.speed / 1.5);
            else if(this.ball.moveY === DIRECTION.DOWN) this.ball.y += (this.ball.speed / 1.5);
            if(this.ball.moveX === DIRECTION.LEFT) this.ball.x -= this.ball.speed;
            else if(this.ball.moveX === DIRECTION.RIGHT) this.ball.x += this.ball.speed;

            //movements for cpu
            if (this.ai.y > this.ball.y - (this.ai.height / 2)){
                if (this.ball.moveX === DIRECTION.RIGHT) this.ai.y -= this.ai.speed / 1.5;
                else this.ai.y -= this.ai.speed / 4;
            }
            if (this.ai.y < this.ball.y - (this.ai.height / 2)){
                if (this.ball.moveX === DIRECTION.RIGHT) this.ai.y += this.ai.speed / 1.5;
                else this.ai.y += this.ai.speed / 4;
            }

            //cpu wall collision
            if (this.ai.y >= this.canvas.height - this.ai.height) this.ai.y = this.canvas.height - this.ai.height;
            else if (this.ai.y <= 0) this.ai.y = 0;

            //player1 ball collisions
            if(this.ball.x - this.ball.width <= this.player.x && this.ball.x >= this.player.x - this.player.width){
                if(this.ball.y <= this.player.y + this.player.height && this.ball.y >= this.player.x - this.player.width){
                    this.ball.x = (this.player.x + this.ball.width);
                    this.ball.moveX = DIRECTION.RIGHT;
                }
            }
            //cpu ball collisions
            if(this.ball.x - this.ball.width <= this.ai.x && this.ball.x >= this.ai.x - this.ai.width){
                if(this.ball.y <= this.ai.y + this.ai.height && this.ball.y + this.ball.height >= this.ai.y){
                    this.ball.x = (this.ai.x - this.ball.width);
                    this.ball.moveX = DIRECTION.LEFT;
                }
            }
            
        }
        //if the player won the end of the round.
        if(this.player.score === rounds [this.round]) {
          //check for any more levels and display winner screen
          if(!rounds[this.round + 1]) {
            this.over = true;
            setTimeout(function () { Pong.endGameMenu('CONGRATZ, YOU WON!'); }, 1000);
            //if we still have rounds to go then we reset everything and change the round number
          } else {
            this.color = this._generateRoundColor();
            this.player.score = this.ai.score = 0;
            this.player.speed += 0.5;
            this.ai.speed += 1;
            this.ball.speed += 1;
            this.round += 1;
          }
        }
        //check to see if cpu won the round/game
        else if (this.ai.score === rounds[this.round]) {
            this.over = true; 
            setTimeout (function (){ Pong.endGameMenu ('You Suck!'); }, 1000);
        }
    },
    //putting objects on to the canvas 
    draw: function () {
        //clears canvas
        this.context.clearRect(
            0,
            0,
            this.canvas.width,
            this.canvas.height
        );
        //fill style = black
        this.context.fillStyle = this.color;

        //makes background on canvas
        this.context.fillRect (
            0,
            0,
            this.canvas.width,
            this.canvas.height
        );

        //fill color for paddles and balls, currently white
        this.context.fillStyle = '#ffffff';

        //draw player1 paddle
        this.context.fillRect (
            this.player.x,
            this.player.y,
            this.player.width, 
            this.player.height
        );
        //draw cpu paddle
        this.context.fillRect (
            this.ai.x,
            this.ai.y,
            this.ai.width, 
            this.ai.height
        );

        //draw the ball
        if (Pong._turnDelayIsOver.call(this)) {
            this.context.fillRect (
                this.ball.x,
                this.ball.y,
                this.ball.width,
                this.ball.height
            );
        }
        //draw dotted line down the middle
        this.context.beginPath();
        this.context.setLineDash([7, 15]);
        this.context.moveTo((this.canvas.width / 2), this.canvas.height -140);
        this.context.lineTo((this.canvas.width / 2), 140);
        this.context.lineWidth = 10;
        this.context.strokeStyle = '#ffffff';
        this.context.stroke();

        //default background
        this.context.font = '100px Courier New';
        this.context.textAlign = 'center';

        
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