var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false,
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update,
    }
};
var helpme = false;
var titleT;
var spaceBar
var gameOver = false;
var pipes;
var PipeDelay = 2500
var Score = 0
var Ammo = 2
var Cooldown1 = false
var Use1
var game = new Phaser.Game(config);
function preload() {
    this.load.image('sky', 'http://labs.phaser.io/assets/skies/background1.png')
    this.load.image('menutext', 'http://labs.phaser.io/assets/sprites/button-text.png');
    this.load.image('flappy', 'http://labs.phaser.io/assets/sprites/ufo.png')
    this.load.image('floor', 'http://labs.phaser.io/assets/sprites/platform.png')
    this.load.audio('playerded', 'http://labs.phaser.io/assets/audio/SoundEffects/player_death.wav')
    this.load.image('Boom', 'http://labs.phaser.io/assets/sprites/shmup-boom.png');
    this.load.image('pipe', 'http://labs.phaser.io/assets/sprites/gem.png')
    this.load.image('blue', 'http://labs.phaser.io/assets/sprites/orb-blue.png')
    this.load.image('green', 'http://labs.phaser.io/assets/sprites/orb-green.png')
    this.load.image('red', 'http://labs.phaser.io/assets/sprites/orb-red.png')
    this.load.image('mine', 'http://labs.phaser.io/assets/sprites/mine.png')
    this.load.image('PEW', 'http://labs.phaser.io/assets/sprites/bullets/bullet1.png')
    this.load.audio('pew', 'http://labs.phaser.io/assets/audio/SoundEffects/pistol.wav');
    this.load.audio('powerup', 'http://labs.phaser.io/assets/audio/SoundEffects/key.wav');
    this.load.audio('MissleBoom', 'http://labs.phaser.io/assets/audio/SoundEffects/sentry_explode.wav');
    this.load.audio('Cooldown', 'http://labs.phaser.io/assets/audio/SoundEffects/need_cells.wav');

};
function create() {
    Use1 = 0
    scoreText = this.add.text(40, 46, 'Score: 0', { fontSize: '32px', fill: '#0f0' }).setDepth(5);
    ammoText = this.add.text(40, 78, 'Ammo: 2', { fontSize: '32px', fill: '#0f0' }).setDepth(5);
    background = this.add.image(400, 300, 'sky');
    titleT = this.add.image(400, 300, 'menutext').setInteractive();
    titleT.setDepth(1);
    spawn = titleT.on('pointerdown', function () {
        helpme = true;
        setTimeout(() => {
        });
    });
    //-----------------------------------------------------------
    this.physics.pause();
    spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    player = this.physics.add.sprite(100, 300, 'flappy').setDepth(1).setScale(2);
    player.setCollideWorldBounds(true)
    //-----------------------------------------------------------
    DeathFloor = this.physics.add.staticGroup();
    Explosion = this.physics.add.group();
    PipePair1 = this.physics.add.group();
    PipePair2 = this.physics.add.group();
    PipePair3 = this.physics.add.group();
    PipePair4 = this.physics.add.group();
    PipePair5 = this.physics.add.group();
    PipePair6 = this.physics.add.group();
    PipePair7 = this.physics.add.group();
    PipePair8 = this.physics.add.group();
    PipePair9 = this.physics.add.group();
    FakePipe = this.physics.add.group();
    TimeSlow = this.physics.add.group();
    GoUp = this.physics.add.group();
    Points = this.physics.add.group();
    Boom = this.physics.add.group();
    EmergencyPew = this.physics.add.group();
    //-----------------------------------------------------------
    DeathFloor.create(600, 600, 'floor')
    DeathFloor.create(200, 600, 'floor')
    this.physics.add.collider(DeathFloor, player, DeathofPlayer, null, this);
    this.physics.add.collider(PipePair1, player, DeathofPlayer, null, this);
    this.physics.add.collider(PipePair2, player, DeathofPlayer, null, this);
    this.physics.add.collider(PipePair3, player, DeathofPlayer, null, this);
    this.physics.add.collider(PipePair4, player, DeathofPlayer, null, this);
    this.physics.add.collider(PipePair5, player, DeathofPlayer, null, this);
    this.physics.add.collider(PipePair6, player, DeathofPlayer, null, this);
    this.physics.add.collider(PipePair7, player, DeathofPlayer, null, this);
    this.physics.add.collider(PipePair8, player, DeathofPlayer, null, this);
    this.physics.add.collider(PipePair9, player, DeathofPlayer, null, this);
    this.physics.add.collider(EmergencyPew, PipePair1, PipeNo1, null, this);
    this.physics.add.collider(EmergencyPew, PipePair2, PipeNo2, null, this);
    this.physics.add.collider(EmergencyPew, PipePair3, PipeNo3, null, this);
    this.physics.add.collider(EmergencyPew, PipePair4, PipeNo4, null, this);
    this.physics.add.collider(EmergencyPew, PipePair5, PipeNo5, null, this);
    this.physics.add.collider(EmergencyPew, PipePair6, PipeNo6, null, this);
    this.physics.add.collider(EmergencyPew, PipePair7, PipeNo7, null, this);
    this.physics.add.collider(EmergencyPew, PipePair8, PipeNo8, null, this);
    this.physics.add.collider(EmergencyPew, PipePair9, PipeNo9, null, this);
    this.physics.add.overlap(TimeSlow, player, MoreTime, null, this);
    this.physics.add.overlap(GoUp, player, GoForward, null, this);
    this.physics.add.overlap(Points, player, GetPoints, null, this);
    this.physics.add.overlap(Boom, player, Death, null, this);

}
function update() {
    if (gameOver) {
        return;
    }
    if (helpme == true) {
        titleT.setVisible(false);
        this.physics.resume();
        helpme = false;
        GameStart()
        setInterval(() => {
            SpawnAPowerUp()
        }, 100);
        setInterval(() => {
            if (player.x > 110) {
                player.setVelocityX(-10)
            }
        }, 5000);
    }
    if (spaceBar.isDown) {
        player.setVelocityY(-150)
    }
    if (keyE.isDown) {
        if (Use1 == 0) {
            if (Cooldown1 == false) {
                Use1 += 1;
                Ammo -= 1;
                ammoText.setText('Ammo: ' + Ammo)
                const Shoot = this.sound.add('pew');
                Shoot.play();
                EmergencyMissle()
                Cooldown1 = true
                setTimeout(() => {
                    Cooldown1 = false
                }, 10000);
            }
        } else if (Use1 == 1) {
            if (Cooldown1 == false) {
                Use1 += 1;
                Ammo -= 1;
                ammoText.setText('Ammo: ' + Ammo)
                const Shoot = this.sound.add('pew');
                Shoot.play();
                EmergencyMissle()
                Cooldown1 = true
                setTimeout(() => {
                    Cooldown1 = false
                }, 10000);
            }
        }
    }
    if (Ammo == 3) {
        Use1 -= 1;
        Ammo -= 1;
        ammoText.setText('Ammo: ' + Ammo)
    }
}
function DeathofPlayer(player, DeathFloor) {
    Explosion.create(player.x, player.y, 'Boom').setDepth(2).setScale(2);
    const collide = this.sound.add('playerded');
    collide.play();
    this.physics.pause();
    player.setTint(0xff0000);
    let gameOverText = this.add.text(game.config.width / 2.5,
        game.config.height / 3,
        'GAME OVER',
        { fontSize: '32px', fill: '#fff' });
    gameOverText.setDepth(1);
    gameOver = true;
}
function GameStart() {
    setInterval(() => {
        GetRandomPipes()
    }, PipeDelay);
}