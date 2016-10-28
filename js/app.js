/**--------------------------------GLOBAL VARIABLES---------------------------------**/
var HERO = "char-pink-girl",
    numberEnemies = 4,
    gameLost = false,
    gameWon = false,
    currentLifes = 5,
    previousX = [],
    previousY = [],
    startX = 202,
    startY = 390;

/**
 *@function Creates random numbers
 *@param {number} highSpeed - High speed of an object(enemy or player)
 *@param {number} lowSpeed -Low speed of an object(enemy or player)
 **/
var randomNumber = function(highSpeed, lowSpeed) {
    return Math.floor(Math.random() * (highSpeed - lowSpeed) + 1) + lowSpeed;
};

/*------------------------ENEMIES---------------------------------*/

/**
 *@class Creates Enemy Class
 *@description Create enemies our players must avoid
 *@param {number} x-x position of the enemy
 *@param {number} y-y position of the enemy
 *@param {boolean} headingRight-If the enemy is heading right
 *@param {number} startPosition-Start x position of the enemy
 *@param {number} endPosition-End s position of the enemy
 **/
var Enemy = function(x, y, headingRight, startPosition, endPosition) {
    this.x = x;
    this.y = y;
    this.headingRight = headingRight;
    this.startPosition = startPosition;
    this.endPosition = endPosition;

    this.speed = randomNumber(550, 0);
    this.sprite = 'images/enemy-bug.png';
};

/**
 *@function Updates enemy position
 *@param {number} dt-Time delta between ticks
 **/
Enemy.prototype.update = function(dt) {
    /*Updates the position of the enemy according it's heading right or not*/
    this.x += this.speed * dt;

    /* If the Enemy goes off screen, we reset the position to start again */
    if (this.x > 505) {
        this.x = Math.random() * -1200;
    }
};

/**
 *@function Renders the enemy
 **/
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/*Creates an Array to collect Enemy objects*/
var allEnemies = [];

/*Creates an Array initialing Enemy objects' Y axis*/
var enemyY = [59, 142, 215, 298];

/**
 *@function Reset enemies position
 *@description Reset enemies position in the begining of
 *@description the game or when the player collides the
 *@description bugs
 **/
var enemyReset = function() {
    for (var i = 0; i < numberEnemies; i++) {
        allEnemies.push(new Enemy(-randomNumber(500, 100), enemyY[i % 5], true, 0, 808));
    }
};

enemyReset();

/*--------------------------------------ITEMS--------------------------------------------------*/

/**
 *@class Create items for collecting
 *@descriptrion For now,I just put star in Items
**/
var Items = function(x, y, sprite, item) {
    this.x = x;
    this.y = y;
    this.sprite = 'images/' + sprite + '.png';
    this.item = item;
};

/**
 *@function Render items on the canvas
**/
Items.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/**
 *@Array Define an array of items such as star for more fun
**/
var allItems = [new Items(303, 80, 'Star', 'star')];

/*--------------------------------------PLAYER-------------------------------------------------*/

/**
 *@class Create Player Class that we control with direction keys
 *@description A player class that play bug.wav when touches any bug
 *@param {number} x-Set the player's initial x axis
 *@param {number} y-Set the player's initial y axis
 **/
var Player = function(x, y) {
    this.x = x;
    this.y = y;

    this.sprite = 'images/' + HERO + '.png';
    this.audio = {
        muted: false,
        bug: new Audio('audio/bug.wav')
    }
};

/**
 *@function Update player's position
 *@description Update player's position when we click position keys
 *@description and check whether the player and any bugs collides
 **/
Player.prototype.update = function() {
    this.x = this.x;
    this.y = this.y;
    checkCollisions();
};

/**
 *@function Render player's image
 *@description Render player on canvas
 **/
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/**
 *@function Play the audio
 *@descriprion Turn on the bug radio when player collides bugs
 **/

Player.prototype.playSound = function() {
    if (!this.audio.muted) {
        this.audio.bug.play();
    }
};

/**
 *@function Handlw keyboard event
 *@description Change player's position when we click the keyboard
 *@param {string} allowedKeys - The code of the clicked keys
 **/
Player.prototype.handleInput = function(allowedKeys) {

    /*Check if the player is still alive*/
    if (currentLifes > 0) {

        switch (allowedKeys) {
            case 'left':
                /*If the player clicks "left" keys then descrease the x axis of the player object*/
                if (this.x > 0) {
                    this.x -= 101;
                }
                break;

            case 'up':
                /*If the player clicks "up" keys then descrease the y axis of the player object*/
                if (this.y > 101) {
                    this.y -= 83;
                }
                break;

            case 'right':
                /*If the player clicks "right" keys then increase the x axis of the player object*/
                if (this.x < 404) {
                    this.x += 101;
                }
                break;

            case 'down':
                /*If the player clicks "down" keys then increase the y axis of the player object**/
                if (this.y < 390) {
                    this.y += 83;
                }
                break;

            case 'M':
                // Toggle muted
                player.audio.muted = !player.audio.muted;
        }

    } else {
        /* The player has 0 lifes, it is game_over. So, if he/she presses Enter --> we reset the game */
        if (allowedKeys === 'enter') {
            enemyReset();
            this.x = startX;
            this.y = startY;
            gameLost = false;
            currentLifes = 5;
        }
    }
};

/**
 *@function Reset the player state
 *@descriptrion reset the player when the player is dead or collides any bugs
 **/
Player.prototype.reset = function() {
    currentLifes = currentLifes - 1;
    if (currentLifes === 0) {
        player.gameOver();
    } else {
        this.x = startX;
        this.y = startY;
    }
};

/**
 *@function Gameover when the player is dead
 *@descriptrion If the player is dead then set gameLost status to true
 **/
Player.prototype.gameOver = function() {
    gameLost = true;
    allEnemies = [];
};

Player.prototype.gameFinal = function () {
    gameWon = true;
    allEnemies = [];
};
/*Create a new player with startX and startY defined in the global variables*/
var player = new Player(startX, startY);


var checkCollisions = function() {

    /*Create a rectangle class to represent the player or enemy*/
    var Rectangle = function(left, top) {
        this.left = left + 35;
        this.top = top + 20;
        this.right = this.left + 65;
        this.bottom = this.top + 22;
    };

    /*Check whether the player and bugs collides each other*/
    function checkCollision(player, obstacle) {
        return !(
            player.left > obstacle.right ||
            player.right < obstacle.left ||
            player.top > obstacle.bottom ||
            player.bottom < obstacle.top
        );
    }

    var playerRectangle = new Rectangle(player.x, player.y);

    /* Check collision with enemy bugs */
    for (var i = 0; i < allEnemies.length; i++) {
        var enemyRectangle = new Rectangle(allEnemies[i].x, allEnemies[i].y);
        if (checkCollision(playerRectangle, enemyRectangle)) {
            /* If player collides with bug, reset position of player */
            player.playSound('bug');
            player.reset();
        }
    }

    for (var j = 0; j < allItems.length; j++) {
        var itemRectangle = new Rectangle(allItems[j].x, allItems[j].y);
        if (checkCollision(playerRectangle, itemRectangle)) {
            switch (allItems[j].item) {
                case 'star':
                    allItems.splice(j, 1);
                    player.gameFinal();
            }
        }
    }
};

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        13: 'enter'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
