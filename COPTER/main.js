
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var mouseDown = 0;
var font = "36 verdana";
var textColor = "rgb(255,255,255)";
var initialUpSpeed = 1.0;
var initialDownSpeed = 1.5; 
var gravity = .5 
var liftFactor = .08; 
var terminalVelocity = 5; 
var obstacleV = 6; // brick velocity
var obstacleInterval = 40; // difficulty level 
var obstacleHeight = 80;
var obstacleWidth = 40;
var obstacleColor = "rgb(255,0,0)";
var copterHeight =31 ;
var copterWidth = 81;
var copter = new Image();
copter.src = "COPTER.png"
var backgroundHeight = 350;
var backgroundWidth = 702;
var backgroundV = 2; // background scroll velocity
var background = new Image();
background.src = "bg.jpg"
var copterX;
var copterY;
var iterationCount;
var obstacleList;

var gameState;
var score;
var scrollVal;
var Upacc;
var Downacc;


window.onload = function () {  var backgroundmusic = new sound("tone.mp3");
    backgroundmusic.play(); setup(); }

function setup() {
  
    gameState = "pause";
    clearScreen();
    copter.src = "COPTER.png";
    obstacleList = new Array();
    copterX = 100;
    copterY = 175;
    Downacc = initialDownSpeed;
    Upacc = initialUpSpeed;
    iterationCount = 0;
    score = 0;
    scrollVal = 0;
    ctx.font = font;
    addobstacle();
    ctx.drawImage(background, 0, 0, backgroundWidth, backgroundHeight);
    ctx.drawImage(copter, copterX, copterY, copterWidth, copterHeight);
    ctx.fillStyle = textColor;
}
function play() {
    if(gameState == "pause") {
        intervalId = window.requestAnimationFrame(draw, canvas); 
        gameState = "play";
    }
}
function pause() { 
    if(gameState == "play") {
        gameState = "pause";
    }
}
function stop() {
    gameState = "stop"
}
function draw() {
    if(gameState == "play") {
        clearScreen();
        animateBackground();
        animateCopter();
        animateobstacle();
        ctx.font ='italic 15pt Calibri';
        ctx.fillStyle = textColor;
        ctx.fillText('Press spacebar to play/pause', 10, 15);
        ctx.fillText('Score:'+ score, 600, 15);
        collisionCheck();
        window.requestAnimationFrame(draw, canvas);
         }
}
function drawCrash() { 
    copter.src = "BLAST.png";
    ctx.drawImage(copter, copterX, copterY, copterWidth, copterHeight);
    ctx.font = " Bold 22pt Verdana";
    ctx.fillStyle="brown";
    ctx.fillText('Your Score Is:'+ score, 220, 250);
    ctx.fillText("PRESS ENTER TO PLAY!!!", 170, 280);
    ctx.font = " Bold 26pt Verdana";
    ctx.fillStyle="black";
    ctx.fillText("GAME OVER!", 240, 150);
}

function animateCopter() {
    if(mouseDown) {
        Downacc = initialDownSpeed;
        copterY = copterY - Upacc;

        if(!(Upacc > terminalVelocity)) {
            Upacc += liftFactor;
        }
    } else {
        Upacc = initialUpSpeed;
        copterY = copterY + Downacc;
    
        if(!(Downacc > terminalVelocity)) {
            Downacc += gravity;
        }
    }
    if( (copterY < 0) || (copterY > (canvas.height-copterHeight)) ) {
        gameOver();
    }
    ctx.drawImage(copter, copterX, copterY, copterWidth, copterHeight);
   
}
function animateobstacle() {
    iterationCount++;
    for(var i=0; i<obstacleList.length; i++) {
        if(obstacleList[i].x < 0-obstacleWidth) {
            obstacleList.splice(i, 1); 
        } 
        else {
            obstacleList[i].x = obstacleList[i].x - obstacleV
            ctx.fillStyle = obstacleColor
            ctx.fillRect(obstacleList[i].x, obstacleList[i].y, obstacleWidth, obstacleHeight)
            
            
            if(iterationCount >= obstacleInterval) {
                addobstacle();
                iterationCount = 0;
                score=score+10;
            }
        }
    }
}



function animateBackground() {
    if(scrollVal >= canvas.width){
        scrollVal = 0;
    }
    scrollVal+=backgroundV;       
    ctx.drawImage(background, -scrollVal, 0, backgroundWidth, backgroundHeight);
    ctx.drawImage(background, canvas.width-scrollVal, 0, backgroundWidth, backgroundHeight);
}

function collisionCheck() {
    for(var i=0; i<obstacleList.length; i++) {
        if (copterX < (obstacleList[i].x + obstacleWidth) && (copterX + copterWidth) > obstacleList[i].x
                    && copterY < (obstacleList[i].y + obstacleHeight) && (copterY + copterHeight) > obstacleList[i].y ) {var lifelosssound = new sound("buzzer.mp3");
            lifelosssound.play();
            gameOver();
        }
    }
}

function gameOver() {
    stop();
    drawCrash();
}

function addobstacle() {
    newobstacle= {}
    newobstacle.x = canvas.width;
    newobstacle.y = Math.floor(Math.random() * (canvas.height-obstacleHeight))
    obstacleList.push(newobstacle);
}



function clearScreen() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}



document.body.onmousedown = function() { 
    if(!(mouseDown == 1)) {
        ++mouseDown;
    }
}
document.body.onmouseup = function() {
    if(mouseDown > 0) {
        --mouseDown;
    }
    if(gameState == "pause") {
        play();
    }
}
if ( !window.requestAnimationFrame ) {
    window.requestAnimationFrame = ( function() {
        return window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
       window.msRequestAnimationFrame ||
        function( callback,  element ) {
            window.setTimeout( callback, 25 );
        };
    } )();
}

document.body.onkeypress = function(e) {
    if(e.keyCode == 32) { // spacebar
        if(gameState == "pause") {
            play();
        } else {
            pause();
        }
    }
    if(e.keyCode ==13) {
        if(gameState != "play") {
            setup()
        }
    }
}

function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }
}



