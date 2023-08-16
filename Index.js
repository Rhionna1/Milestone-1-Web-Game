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

        //players score display
        this.context.fillText(
            this.player.score.toString(),
            (this.canvas.width / 2) - 300,
            200
        );
        //paddle score
        this.context.fillText(
            this.ai.score.toString(),
            (this.canvas.width / 2) + 300, 
            200
        );

        //change size of text for center score board
        this.context.font = '30px Courier New';

        //winning score in the middle
        this.context.fillText(
            'Round' + (Pong.round + 1),
            (this.canvas.width / 2),
            35
        );
        //font size for center score
        this.context.font = '40px Courier';

        //draw current number
        this.context.fillText(
            rounds[Pong.round] ? rounds[Pong.round] : rounds[Pong.round - 1],
            (this.canvas.width / 2),
            100
        );
    },
    loop: function(){
        Pong.update();
        Pong.draw();

        //draw next frame, game is not over
       if (!Pong.over) requestAnimationFrame(Pong.loop); 
    },

    listen: function(){
        document.addEventListener('keydown', function (key){
            //press any key to begin
            if (Pong.running === false) {
                Pong.running = true;
                window.requestAnimationFrame (Pong.loop);
            }

            //up arrow and w key events
            if (key.keyCode === 38 || key.keyCode === 87) Pong.player.move = DIRECTION.UP;
            //down arrow and s key events
            if (key.keyCode === 40 || key.keyCode === 83) Pong.player.move = DIRECTION.DOWN;
        });
        //keep the player still when not moving
        document.addEventListener('keyup', function (key) { Pong.player.move = DIRECTION.IDLE; });
    },
    //reset ball location, before next round
    _resetTurn: function(victor, loser) {
        this.ball = Ball.new.call(this, this.ball.speed);
        this.turn = loser;
        this.timer = (new Date()).getTime();

        victor.score++;
    },
    _turnDelayIsOver: function(){
        return ((new Date()).getTime() - this.timer>= 1000);
    },
    _generateRoundColor: function(){
        var newColor = colors[Math.floor(Math.random() * colors.length)];
        if (newColor === this.color) return Pong._generateRoundColor();
        return newColor;
    }
};

var Pong = Object.assign({}, Game);
Pong.initialize();