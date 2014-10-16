/* 
 * Written by Diego Martínez AKA Huron
 */
var game = new Phaser.Game(1224, 520, Phaser.AUTO, 'game', { preload: preload, create: create, update: update });

//  The Google WebFont Loader will look for this object, so create it before loading the script.
WebFontConfig = {
    active: function() { game.time.events.add(Phaser.Timer.SECOND, createText, this); },
    google: {
      families: ['Oswald::latin','Berkshire+Swash::latin']
    }

};

function preload() {
    
    //  Load the Google WebFont Loader script
    game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1/webfont.js');
    
    //  Imágenes
    game.load.image('intro', 'assets/images/intro.jpg');
    game.load.image('background', 'assets/images/fondo.jpg');
    game.load.image('concreto', 'assets/images/concrete.png');
    game.load.image('canasta', 'assets/images/canasta.png');
    game.load.image('ipod', 'assets/images/ipod.png');
    game.load.image('extintor', 'assets/images/extintor.png');
    game.load.image('pesas', 'assets/images/pesas.png');
    
    game.load.image('repisa', 'assets/images/repisa.png');
    game.load.image('casilla', 'assets/images/spot.png');
    
    //  Sprites
    game.load.spritesheet('ant', 'assets/images/ant_sheet1.png', 114, 166);
    game.load.spritesheet('button', 'assets/images/start-button.png', 129, 54);
    game.load.spritesheet('ready', 'assets/images/ready-button.png', 148.5, 100);
    game.load.spritesheet('smile', 'assets/images/smile.png', 71, 71);
    game.load.spritesheet('explosion', 'assets/images/explosions.png', 64, 70);
    
    //  Audio
    game.load.audio('fxDie', 'assets/audio/smb_mariodie.wav');
    game.load.audio('fxWin', 'assets/audio/smb_stage_clear.wav');
    game.load.audio('fxCoin', 'assets/audio/smb_coin.wav');
    game.load.audio('fxStomp', 'assets/audio/smb_stomp.wav');
    game.load.audio('fxBomb', 'assets/audio/bomb.wav');
    
}

//  Elementos del juego
var jefe, ingeniero, fit, hipster, desk, obsequios, plataformas, explosion, casillas, boton, ready, counterText, scoreText, loadText, explainText, intro;
var aciertos = [];
var dragged = false;
var moving = false;

var fxDie,fxWin,fxCoin,fxStomp,fxBomb;

var die = false;
var score = 0;

var snap = false;
var lapso = 0;
var stoppedTime = 0;
var myCountdownSeconds, mySeconds;


function createText() {
    
    //  Estilos
    var textStyle1 = {font:'20px Oswald',fill: '#fff'};
    var textStyle2 = {font:'30px Oswald',fill: '#fff'};
    var textStyle3 = {font:'18px Oswald',fill: '#333'};
    
    //  The counter
    counterText = game.add.text(game.world.width-170, 20, 'Tiempo restante \n 30 segundos', textStyle1);
        
    //  The score
    scoreText = game.add.text(game.world.width-170, 100, 'score: 0', textStyle2);
    
    var text = "Ubica en cada \n casilla el \n regalo adecuado \n para tu cliente \n arrastrándolo \n con el mouse.";
    explainText = game.add.text(game.world.width - 180, 180, text, textStyle1);
        
    textRendered = true;

}

function loadStart() {
    loadText = game.add.text(32, 32, 'Cargando...', { fill: '#ffffff' });
    console.log('Carga iniciada');
}

function loadComplete() {
    loadText.visible = 0;
    console.log('Carga finalizada');
}

function countDownTimer() {
  
    var timeLimit = 30;

    if(moving){
        mySeconds = game.time.totalElapsedSeconds();
        if(!snap){
            lapso = game.time.totalElapsedSeconds() - stoppedTime;
            snap = true;
        }
        myCountdownSeconds = timeLimit + lapso - mySeconds;
        if(textRendered){
            counterText.text = 'Tiempo restante \n '+Math.floor(myCountdownSeconds)+' segundos';
        }
    }
    if (myCountdownSeconds <= 0){
        // time is up
        counterText.text = 'Tiempo agotado!';
        if(moving){
            stopMove();
            enviar();
        }
    }
}

function startMove(){
    moving = true;
    boton.visible = false;
    boton.visible = false;
    intro.visible = false;
}

function stopMove(){
    moving = false;
}

function startDrag(elem) {
// You can't have a sprite being moved by physics AND input, so we disable the physics while being dragged
elem.body.moves = false;
dragged = true;
}

function stopDrag(elem) {
// And re-enable it upon release
setTimeout(function(){
    elem.body.moves = true;
},100);
dragged = false;
}

function enviar(){
    var i = 0;
    explainText.visible = 0;
    obsequios.forEach(function(obsequio){
        if (obsequio.ok){
            switch(obsequio.index){
                case 0:
                    var smile0 = game.add.sprite(120, 10, 'smile', 1);
                    break;
                case 1:
                    var smile1 = game.add.sprite(490, 320, 'smile', 8);
                    break;
                case 2:
                    var smile2 = game.add.sprite(465, 35, 'smile', 2);
                    break;
                case 3:
                    var smile3 = game.add.sprite(125, 290, 'smile', 16);
                    break;
            }
            score += 10;
            i++;
        }else{
            switch(obsequio.index){
                case 0:
                    var bad0 = game.add.sprite(120, 10, 'smile', 5);
                    break;
                case 1:
                    var bad1 = game.add.sprite(490, 320, 'smile', 3);
                    break;
                case 2:
                    var bad2 = game.add.sprite(465, 35, 'smile', 6);
                    break;
                case 3:
                    var bad3 = game.add.sprite(125, 290, 'smile', 14);
                    break;
            }
            scoreText.text = 'score: '+score;
        }
    });
    var style = { font: "20px Berkshire Swash", fill: "#fff", align: "center" };
    if(i<4){
        die = true;
        fxDie.play();
        var text = "¡Juego terminado! \n ¡Los obsequios \n no gustaron!";
        var t = game.add.text(game.world.width - 180, 180, text, style);
        player.animations.play('cry',1, true);
        
        setTimeout(function(){
            player.visible = 0;
            explosion = game.add.sprite(game.world.width - 380, game.world.height - 165, 'explosion');
            explosion.scale.setTo(1,2);
            explosion.animations.add('explotar', [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],10, false);
            explosion.play('explotar');
            fxBomb.play();
        },3500);
        
    }else{
        fxWin.play();
        var text = "¡Juego terminado! \n ¡Has enamorado \n a tus clientes!";
        var t = game.add.text(game.world.width - 180, 180, text, style);
    }
    stopMove();
    ready.visible = 0;
}
    
function checkTarget(obsequio, blanco){
    if(obsequio.index === blanco.index){
        obsequio.ok = true;
    }else{
        obsequio.ok = false;
    }
}

function create() {
 
    //	You can listen for each of these events from Phaser.Loader
    game.load.onLoadStart.add(loadStart, this);
    game.load.onLoadComplete.add(loadComplete, this);
    game.load.start();

    //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //  A simple background for our game
    game.add.sprite(0, 0, 'background');

    //  Plataformas
    plataformas = game.add.group();
    plataformas.enableBody = true;
    var repisa = plataformas.create(game.world.width - 495, 280, 'repisa');
    repisa.scale.setTo(0.5,0.5);
    repisa.body.immovable = true;
    
    var concreto = plataformas.create(0, 255, 'concreto');
    concreto.scale.setTo(2.95,0.5);
    concreto.body.immovable = true;
        
    //  Casillas
    casillas = game.add.group();
    casillas.enableBody = true;
    
    var xpos = 0;
    var ypos = 0;
    for(i=0;i<4;i++){
        switch(i){
            case 0://pesas
                xpos = 0;
                ypos = 0;
                break;
            case 1://ipod
                xpos = 0;
                ypos = 265;
                break;
            case 2://extintor
                xpos = 358;
                ypos = 0;
                break;
            case 3://canasta
                xpos = 358;
                ypos = 265;
                break;
        }
        var casilla = casillas.create(xpos, ypos, 'casilla');
        casilla.scale.setTo(1.75,1.28);
        casilla.index = i;
    }
    
    //Obsequios
    var piezas = [{nombre:'extintor',posicion:game.world.width - 470,index:2},
                  {nombre:'pesas',posicion:game.world.width - 440,index:0},
                  {nombre:'ipod',posicion:game.world.width - 345,index:1},
                  {nombre:'canasta',posicion:game.world.width - 310,index:3}];
    obsequios = game.add.group();
    obsequios.enableBody = true;
    
    piezas.forEach(function(pieza){
        var obsequio = obsequios.create(pieza.posicion, 150, pieza.nombre, 'draggable');
        obsequio.scale.setTo(0.3,0.3);
        obsequio.body.gravity.y = 300;
        obsequio.body.bounce.y = 0.5;
        obsequio.body.bounce.x = 0.5;
        obsequio.body.collideWorldBounds = true;
        obsequio.inputEnabled = true;
        obsequio.input.enableDrag(false, true);
        obsequio.events.onDragStart.add(startDrag, this);
        obsequio.events.onDragStop.add(stopDrag, this);
        obsequio.index = pieza.index;
    });

    //  Player
    player = game.add.sprite(game.world.width - 410, game.world.height - 200, 'ant');
    player.animations.add('die', [1], 1, true);
    player.animations.add('cry', [3,4,3], 1, true);
    player.animations.add('stand', [0, 1, 2], 10, true);
    
    //  Creación de sprites de sonido
    fxBell = game.add.audio('fxBell');
    fxRideElevator = game.add.audio('fxRideElevator');
    fxDie = game.add.audio('fxDie');
    fxWin = game.add.audio('fxWin');
    fxCoin = game.add.audio('fxCoin');
    fxStomp = game.add.audio('fxStomp');
    fxBomb = game.add.audio('fxBomb');
    
    ready = game.add.button(game.world.width - 423, 73, 'ready', enviar, this, 0, 1, 2);
    
    //  Pantalla de intro
    intro = game.add.sprite(0, 0, 'intro');
    
    //  El botón de inicio
    boton = game.add.button(game.world.width - 160, game.world.height - 100, 'button', startMove, this, 0, 1, 2);
 
}

function update() {
    
    countDownTimer();
    
    game.physics.arcade.collide(obsequios, plataformas);
    game.physics.arcade.overlap(obsequios, casillas, checkTarget, null, this);
    
    if(!die){
        // Animación del personaje
        if ((game.rnd.integerInRange(1,100))%51 === 0){
            player.animations.play('stand',10, false);
        }
    }
    
}