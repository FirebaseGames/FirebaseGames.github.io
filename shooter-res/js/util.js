var keys = {};
var playing = 0;
var lose = 1;
var win = 2;
var gameState = playing;

var bullets = new Bullets();
var spreadshots = new SpreadShot();
var chasingEnemies = new ChasingEnemy();
var blocking = new BlockingShot();
var revolver = new RevolverShot();


var speed = 4.5;
var friction = 0.9;

var canvas;
var context;
var requestid = "";

var roomidPC;
var roomidM;
var gamestart = false;
var numCurrPlayers = 0;
var jRadius = 200;

function drawCircle(x, y, r, color, opacity) {
    context.globalAlpha = opacity;
    context.beginPath();
    context.arc(x, y, r, 0, 2 * Math.PI, false);
    context.fillStyle = color;
    context.fill();
    context.globalAlpha = 1;
}

function resetGame() {
    player.reset();
    boss1.reset();
    bullets.reset();
    chasingEnemies.reset();
    blocking.reset();
    spreadshots.reset();
    revolver.reset();
}

function clearBullets() {
    bullets.reset();
    chasingEnemies.reset();
    blocking.reset();
    spreadshots.reset();
    revolver.reset();
}