'use strict';
var game = new Phaser.Game(1400, 670, Phaser.AUTO, '', { preload: preload, create: create, update: update });


function preload() {
	game.load.image('space', 'images/space.jpg');
  game.load.image('bullet', 'images/bullet.png');
	game.load.image('player1', 'images/player1.png');
	game.load.image('player2', 'images/player2.png');
	game.load.image('asteroid', 'images/asteroid.png');
  game.load.spritesheet('explosionimg', 'images/explosion.png', 64, 64);
  game.load.audio('explosion', 'sound/explosion.ogg');
  game.load.audio('shot', 'sound/shot.wav');

}

var asteroids=[];
var shotSound
var player1upKey;
var player1downKey;
var player1leftKey;
var player1rightKey;
var player1shootKey;
var player2upKey;
var player2downKey;
var player2leftKey;
var player2rightKey;
var player2shootKey;
var bullet;
var bullet2;
var bullets;
var bullets2;
var bulletTime = 0;
var bulletTime2 = 0;
var player1;
var player2;
var explosionimg;
var shotSound;
var stateText;

function create() {

    shotSound = this.game.add.audio('shot');

    this.explosionSound = this.game.add.audio('explosion');

    this.space = this.game.add.tileSprite(0, 0, 2000, 2000, 'space');
    this.space.autoScroll(-20, 0);

   	player1 = game.add.sprite(10, 100, 'player1');
   	player1.scale.setTo(0.4);
    game.physics.enable(player1, Phaser.Physics.ARCADE);
    player1.body.collideWorldBounds= true;
    player1.health = 100;

   	player2 = game.add.sprite(1350, 500, 'player2');
   	player2.scale.setTo(0.4);
    game.physics.enable(player2, Phaser.Physics.ARCADE);
    player2.body.collideWorldBounds= true;
    player2.health = 100;

    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;
    bullets.createMultiple(30, 'bullet');
    bullets.setAll('anchor.x', 0.5);
    bullets.setAll('anchor.y', 1);
    bullets.setAll('outOfBoundsKill', true);
    bullets.setAll('checkWorldBounds', true);

    for (var i = 0; i < 12; i++)
    {
        asteroids[i] = game.add.sprite(game.world.randomX, game.world.randomY, 'asteroid');
        asteroids[i].scale.setTo(0.4);
        game.physics.enable(asteroids[i], Phaser.Physics.ARCADE);
        asteroids[i].body.setSize(150, 150, 20, 20);
        asteroids[i].body.immovable = true;
    }
    //player1
    player1upKey = game.input.keyboard.addKey(Phaser.Keyboard.Z);
    player1downKey = game.input.keyboard.addKey(Phaser.Keyboard.S);
    player1leftKey = game.input.keyboard.addKey(Phaser.Keyboard.Q);
    player1rightKey = game.input.keyboard.addKey(Phaser.Keyboard.D);
    player1shootKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    //player2
    player2upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
    player2downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
    player2leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    player2rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    player2shootKey = game.input.keyboard.addKey(Phaser.Keyboard.CONTROL);

    stateText = game.add.text(game.world.centerX,game.world.centerY, ' ', { font: '84px Arial', fill: '#fff' });
    stateText.anchor.setTo(0.5, 0.5);
    stateText.visible = false;
}

function update() {

    //collisions sprite vs sprite
     for (var i = 0; i < 12; i++)
    {
        game.physics.arcade.collide(player1, asteroids[i], collisionHandler2, 0, this);
        game.physics.arcade.collide(player2, asteroids[i], collisionHandler2, 0, this);
        game.physics.arcade.overlap(bullets, player1, collisionHandler, 0, this);
        game.physics.arcade.overlap(bullets, player2, collisionHandler3, 0, this);
        game.physics.arcade.overlap(bullets, asteroids[i], hitasteroid, 0, this);
    }
    game.physics.arcade.collide(player1, player2, collisionHandler2, 0, this);

    player1.body.velocity.x = 0;
    player1.body.velocity.y = 0;


    player2.body.velocity.x = 0;
    player2.body.velocity.y = 0;

    //player1
    if (player1.alive) {

        if (player1leftKey.isDown) {
            player1.body.velocity.x = -330;
        }
        else if (player1rightKey.isDown) {
            player1.body.velocity.x = 330;
        }

        if (player1upKey.isDown) {
            player1.body.velocity.y = -330;
        }
        else if (player1downKey.isDown) {
            player1.body.velocity.y = 330;
        }
        if (player1shootKey.isDown) {
            fireBullet();
        }
    }
    //player2
    if (player2.alive) {

        if (player2leftKey.isDown) {
            player2.body.velocity.x = -330;
        }
        else if (player2rightKey.isDown) {
            player2.body.velocity.x = 330;
        }

        if (player2upKey.isDown) {
            player2.body.velocity.y = -330;
        }
        else if (player2downKey.isDown) {
            player2.body.velocity.y = 330;
        }
        if (player2shootKey.isDown) {
            fireBullet2();
        }
    }
   //game.debug.body(player1);
    //game.debug.body(player2);
}

function fireBullet () {

    //  To avoid them being allowed to fire too fast we set a time limit
    if (game.time.now > bulletTime)
    {
        //  Grab the first bullet we can from the pool
        bullet = bullets.getFirstExists(false);

        if (bullet)
        {
            //  And fire it
            bullet.reset(player1.x+130, player1.y + 35);
            bullet.body.velocity.x += 1000;
            bulletTime = game.time.now + 300;
            shotSound.play();
        }
    }
}

function fireBullet2 () {
    //  To avoid them being allowed to fire too fast we set a time limit
    if (game.time.now > bulletTime2)
    {
        //  Grab the first bullet we can from the pool
        bullet2 = bullets.getFirstExists(false);

        if (bullet2)
        {
            //  And fire it
            bullet2.reset(player2.x-30, player2.y +25);
            bullet2.body.velocity.x -= 1000;
            bulletTime2 = game.time.now + 300;
            shotSound.play();
        }
    }
}


function collisionHandler (bullet, player1) {

    explosionimg = game.add.sprite(player1.x-110, player1.y-45,'explosionimg')
    explosionimg.animations.add('explosion', [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24], 50, false);
    this.explosionSound.play();
    explosionimg.animations.play('explosion');
    bullet.kill();
    stateText.text = " You Won, \n Click to restart";
    stateText.visible = true;
    game.input.onTap.addOnce(restart,this);
}

function collisionHandler2(bullet, target1){
     //bullet.kill();
}

function collisionHandler3 (bullet, player2) {

    explosionimg = game.add.sprite(player2.x+20, player2.y-30,'explosionimg')
    explosionimg.animations.add('explosion', [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24], 50, false);
    this.explosionSound.play();
    explosionimg.animations.play('explosion');
    bullet.kill();
    stateText.text = " You Won, \n Click to restart";
    stateText.visible = true;
    game.input.onTap.addOnce(restart,this);
}

function hitasteroid(target1, bullet){
    bullet.kill();
}

function restart () {
    //revives the player
    player1.revive();
    player2.revive();
    //hides the text
    stateText.visible = false;

}
