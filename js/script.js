
//GAME



//Model
//==============================================================

//variables
var ScreenInfo = {height: 500, width: 1000, top: 0, left: 0};


var screenw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
var screenh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

var maxw = ScreenInfo.left + ScreenInfo.width;
var maxh = ScreenInfo.top + ScreenInfo.height;
var minh = ScreenInfo.top;
var minw = ScreenInfo.left;

var gameStarted = false;

var deathCount = 0; //deaths this session



var randomw = function(){
    return Math.floor(Math.random() * ((maxw-minw) + 1));
};

var randomh = function(){
    return Math.floor(Math.random() * ((maxh-minh) + 1));
};

var randomhRare = function(size){
    return Math.floor(Math.random() * (((maxh + size)-minh) + 1));
};

var rareSize = function(){
    return maxh/(1.1* SCALEFACTOR);
}


//var randomw1 = function(){return Math.floor(Math.random() * ((maxw-10) + 1));};
//var randomh1 = function(){return Math.floor(Math.random() * ((maxh-10) + 1));};

/*var randomSpeed = function(){
    var xdir = Math.random(0, MAXSPEED * 2 + 1) - MAXSPEED;
    var ydir = Math.random(0, MAXSPEED * 2 + 1) - MAXSPEED;
}*/

var randsize = function(){return Math.floor(Math.random()* (MAXSIZE + 1));};
var randFoeSize = function(){return Math.floor(Math.random()* (MAXFOESIZE + 1));}; 


//CONSTANTS
//var DEFAULTDOTWIDTH = 20; //width of dot in css
var SCALEFACTOR = 10; //used for sizing Dots
var FOEARRAYSIZE = 20;
var FOODARAYSIZE = 10;
var MAXSPEED = 5;
var MAXSIZE = 10;
var MAXFOESIZE = 11; //some foes (bigger than MAXSIZE) can never be eaten 
var MAXREGENDELAY = 400; //max time for a foe to regenerate after being eaten

//constructors
var Dot = function(posX, posY, size, color, kind){
  this.posX = posX;
  this.posY = posY;
  this.size = size;
  this.color = color;
  this.kind = kind; //food, foe, or player (same name as css class)
  this.score = 0;
 
  this.toString = function(){
      return "[" + this.kind + ", size: " + this.size + ", loc: (" + this.posX + ", " + this.posY +")" + "]";
  };
};


var Foe = function(posX, posY, size, color, kind, xvel, yvel){
    Dot.call(this, posX, posY, size, color, kind);
    this.xvel = xvel;
    this.yvel = yvel;
}

Foe.prototype = Object.create(Dot.prototype);

//instantiate

//declare hero globally
var heroDot = new Dot();

//called in startGame() to instantiate hero
var makeHero = function(){
   heroDot = new Dot(maxw/2, maxh/2, 1, "blue", "player");
   heroDot.score = 0;
}

//food array
var foods = new Array();
//make foods

var makeFoods = function(){
    foods = new Array();
    for (var i = 0; i < FOODARAYSIZE; i++){
    foods.push(new Dot(randomw(), randomh(), 1, "teal", "food"));
    }
}


//foes array    
var foes = new Array();

//make foes;

var makeFoes = function(){
    foes = new Array();
    for (var i = 0; i < FOEARRAYSIZE; i++){
    addRandomFoe();
    }
    console.log("made a new set of foes");
};

//move foes

Dot.prototype.movedown = function(){
    //this.posX = (this.posX + this.xvel) % maxw;
  // this.posY = (this.posY + this.yvel) % maxh;
    this.posX = (this.posX + MAXSPEED) % maxw;
    this.posY = (this.posY + Math.sin(2*Math.PI*(this.posX/5))*4)  % maxh;
  
};

var moveRare = function(){
    rareDot.posX += MAXSPEED;
    if (rareDot.posY > maxh){
         rareDot.posY -= MAXSPEED;
    }
    if(rareDot.posY < minh){
        rareDot.posY += MAXSPEED;
    }
}

Dot.prototype.runAway = function(){
    this.posX = (this.posX + (MAXSPEED  *3));
    this.posY = (this.posY + (Math.sin(2*Math.PI*(this.posX/5))*4)  *3);
}

//move foods

Dot.prototype.moveover = function(){
    //this.posX = (this.posX + this.xvel) % maxw;
  // this.posY = (this.posY + this.yvel) % maxh;
    this.posX = (this.posX + 0.1)% maxw;
    this.posY = (this.posY + Math.cos(2*Math.PI*(this.posX/5))*4)  % maxh;
  
};
   

/*Dot.prototype.evolve = function(){
    if (this.size == 1){
            this.color = "blue"; 
    }
    else if(this.size == 2){
          this.color = "lime"; 
    }
    else if(this.size == 3){
          this.color = "yellow"; 
    }
    else if(this.size == 4){
          this.color = "orange"; 
    }
    else if(this.size == 5){
          this.color = "red"; 
    }     
}*/

 
//collision

var isColliding = function(foecheck, foodcheck, rarecheck){
    //check for foe collison
   if(foecheck){
    var i = 0;
    for (i = 0; i < foes.length; i++){
        
    //console.log("looking at foe " + i);
     var adot = foes[i];
    
    var dist = Math.sqrt(( (heroDot.posX-adot.posX)*(heroDot.posX-adot.posX) )+ 
    ((heroDot.posY-adot.posY)*(heroDot.posY-adot.posY)));
     //console.log("dist = " + dist);
        if(dist <= (adot.size*SCALEFACTOR/2)+(heroDot.size*SCALEFACTOR/2)){
            
            
            if(adot.size > heroDot.size){
                console.log("Hero " + heroDot.toString() + " was eaten by foe " + adot.toString());
                eatHero();
                console.log("Hero died :(");
                 var audio = new Audio('sounds/bomb2.wav');
            audio.play();
            }
            else{
            adot.eaten = true;           
            eatFoe(i);
            
            
            var audio = new Audio('sounds/Sonic_Ring.mp3');
            audio.play();
            }
        }
        else{};
    }
   }
   
   //check for food collison 
   if(foodcheck){
    var j = 0;
    for(j=0; j < foods.length; j++){ 
       // console.log("looking at food " + j);
        var adot = foods[j];
        var dist = Math.sqrt( ((heroDot.posX-adot.posX)*(heroDot.posX-adot.posX)) +
        ((heroDot.posY-adot.posY)*(heroDot.posY-adot.posY)));
        if(dist <= ((adot.size*SCALEFACTOR)/2)+((heroDot.size*SCALEFACTOR)/2) ){
            //console.log("--- collided with a food: " + adot.toString());
            eatFood(j);
            var audio = new Audio('sounds/Sonic_Ring.mp3');
            audio.play();
        }
        else {}
    }
   }
   
   //check for rareDot collison
   if(rarecheck){
       var dist = Math.sqrt(( (heroDot.posX-rareDot.posX)*(heroDot.posX-rareDot.posX) )+ 
    ((heroDot.posY-rareDot.posY)*(heroDot.posY-rareDot.posY)));
        //if intersecting with rareDot
        if(dist <= (rareDot.size*SCALEFACTOR/2)+(heroDot.size*SCALEFACTOR/2)){
            eatHero();
            rareAteHero = true;
            console.log("rareDot ate hero");
        }
   }
    
}



//Hero eats food dot
var eatFood = function(i){
        //delete food dot
        foods .splice(i,1);
        heroDot.size +=0.5;
        heroDot.score +=1;
        //heroDot.evolve();
}


//Hero eats foe dot
var eatFoe = function(i){
        //delete foe dot
        foes.splice(i,1);
        heroDot.size +=0.5;
        heroDot.score +=1;
        var delay = Math.random(0, MAXREGENDELAY * 2 + 1) - MAXREGENDELAY;
        setTimeout(addRandomFoe, delay);
        //heroDot.evolve();
}

//Hero dot is eaten by foe
var eatHero = function(){
    circleGame.keepPlaying = false;
}

Dot.prototype.offScreen = function(){
    var radius = (this.size * SCALEFACTOR/2);
    return (this.posX - radius > maxw || this.posY - radius > maxh || this.posY + radius < minh);
}

Foe.prototype.loop = function(){
    //if foe offscreen NOT to left, put it offscreen to the left
    var radius = (this.size * SCALEFACTOR/2);
   if(this.posX - radius > maxw || this.posY - radius > maxh || this.posY + radius < minh) {
     //if(this.offScreen()){
        this.regenerate();
    }
}

//puts an existing foe offscreen to left
Foe.prototype.regenerate = function(){
    this.posX = randomw() * -3;
    this.posY = randomh();
}

//adds a new random foe offscreen to the left
var addRandomFoe = function(){
    var xdir = Math.random(0, MAXSPEED * 2 + 1) - MAXSPEED;
    var ydir = Math.random(0, MAXSPEED * 2 + 1) - MAXSPEED;
    var size = randFoeSize();
    var color = "black";
    if (size > MAXSIZE){ //foes that can never be eaten 
        color = "#000026";
    }
    var newfoe = new Foe(randomw()*-3, randomh(), size, color, "foe", xdir, ydir);
    //newfoe.evolve(); //sets color according to size
    foes.push(newfoe);
}

//RARE DOT STUFF
var rareDot = new Foe(rareSize()*-1.5, randomhRare(rareSize()), rareSize(), "rarePepe", "foe", 
Math.random(0, MAXSPEED * 2 + 1) - MAXSPEED, Math.random(0, MAXSPEED * 2 + 1) - MAXSPEED);

var beginFlee = false;
var rareDotLaunched = false;
var rareAteHero = false;
var rareDone = false; //true if rareDot is finished (left screen or killed hero)

var runAwayAll = function(){
    beginFlee = true;
}

//returns true if all foes are off screen
var allFoesOffScreen = function(){
    var allOff = true;
    foes.forEach(function(each){
        //console.log(each.toString() + " OFF??? " + each.offScreen());
        allOff = each.offScreen() && allOff;
    });
    return allOff;
}


var updateGame = function(gameInfo){
    //if the rare dot has not appeared in this session
    if(!rareDone && !beginFlee && !rareDotLaunched && (deathCount == 6) && circleGame.keepPlaying){
        var maxdelay = 5*60*1000;
        var mindelay = 2*60*1000;
        var delay = (Math.random() * ((maxdelay-mindelay) + 1));
        console.log("delay: " + delay);
        setTimeout(runAwayAll, delay);
        rareDotLaunched = true;
    }
    
  // 1) if time to flee & path cleared, let rare dot enter & move
  if(allFoesOffScreen() && beginFlee && !rareDone){
      isColliding(false, true, true);
      //if rare dot is gone, bring back foes after a delay
      if((rareDot.offScreen() || rareAteHero)){
         resetFoes();
         rareDone = true;
         setTimeout(function(){
             beginFlee = false;//STOP FLEEING
         }, 400);
         console.log("-----rareDot has passed");
      }
      else{
        rareDotLaunched = true;
        moveRare();
        //console.log("------rareDot launched");
      }
  }
  // 2) if time to flee & path unclear, keep fleeing
  else if(beginFlee && !allFoesOffScreen() && !rareDone){
      // console.log("fleeing");
      isColliding(false, true, false);
       foes.forEach(function(each){
        each.runAway();
    });
  }
  //3) if NOT time to flee, move normally
  else{
    //update all foes
      foes.forEach(function(each){
        each.movedown();
        each.loop();
    });
    
    //update all foods  
        foods.forEach(function(each){
        each.moveover();
        });
  
    //check for normal (food/foe) collisions & update accordingly
    isColliding(true, true, false);
  }
  
};

//View
//==============================================================
//Draw Screen
//screen



var drawGame = function(gameInfo){
    //clear screen and redraw everything with updates
    $screen.innerHTML = "";
    drawScore();
    drawHighScore();
   //draw all foes and foods
    foes.forEach(function(each){
        each.drawDot();
    });

    foods.forEach(function(each){
        each.drawDot();
    });
   //draw Player 
    drawPlayer();
    
    if(rareDotLaunched && beginFlee){
        rareDot.drawDot();
        //console.log("drew raredot " + rareDot.toString());
    }
}


// make screen
 var $screen = document.querySelector('#field');
 $screen.style.backgroundColor = "papayawhip";
 $screen.style.width = ScreenInfo.width + "px";
  $screen.style.height= ScreenInfo.height + "px";
  $screen.style.position = "relative";
  $screen.style.top = ScreenInfo.top + "px";
  $screen.style.left = ScreenInfo.left + "px";
 

//functions

Dot.prototype.sizing = function(disp){
    if (this.size > MAXSIZE && this.kind == "player"){
        this.size = MAXSIZE;
         //console.log("TOO BIGGGGGG");
    }
        var dispSize = this.size * SCALEFACTOR
        disp.style.width = dispSize + "px";
        disp.style.height = dispSize + "px";
        disp.style.transform = "translateX(-" + dispSize/2 + "px) translateY(-" + dispSize/2 + "px)";
        //console.log(this.size * 10 + "px");
        this.size = this.size;
    
}





  //_________
  


//draw a single dot, giving it the correct class, size, and (x,y)
Dot.prototype.drawDot = function(){
    var $dot = document.createElement('div');
    $dot.className = this.kind;
    $dot.style.left = this.posX+"px";
    $dot.style.top = this.posY+"px";
    if(this.color == "rarePepe"){
        $dot.id = this.color; 
    }
    else{
        $dot.style.backgroundColor = this.color;
    }
    
    $screen.appendChild($dot);
   // console.log("drew a dot");
    this.sizing($dot);
}


    
var drawPlayer = function(){ //HEY hey hey hey hey he
    //player 1
var $p1 = document.createElement('div');
    $p1.id = "player1";
    $p1.setAttribute('id', 'player1');
    $p1.style.left = heroDot.posX + "px";
    $p1.style.top = heroDot.posY + "px";
    $p1.style.backgroundColor = heroDot.color;
    heroDot.sizing($p1);
    
    $screen.appendChild($p1);
}


var $quitB = document.querySelector("#quit-button");
var $startB = document.querySelector("#start-button");
var drawUI = function(){
    $quitB.innerHTML ="i quit";
     $startB.innerHTML ="start";

}



    
 

//controller____________________________________

//ui controls

var pressStart = function(){
        if(!gameStarted){
        startGame();//should make it so we can't start if there is an existing game running.. also speed??? D:
        $screen.style.cursor = "none";
    }
}

var pressQuit = function(){
      if(gameStarted){
        gameStarted = false;
        circleGame.keepPlaying = false;
        $screen.style.cursor = "default";
      }
}


var $soundControl = document.getElementById('music');
//$soundControl.style.backgroundImage = "url(\"img/Speaker_Icon.svg\")";
  document.getElementById('soundon').style.display = 'block';
document.getElementById('soundoff').style.display = 'none';
$soundControl.addEventListener("click", function(ev){
    //document.getElementById('player').muted=!document.getElementById('player').muted;
    if(document.getElementById('player').muted == true){
        document.getElementById('player').muted = false;
        //$soundControl.style.backgroundImage = "url(\"img/Speaker_Icon.svg\")";
         
           document.getElementById('soundon').style.display = 'block';
        document.getElementById('soundoff').style.display = 'none';
        
        
    }else{
        document.getElementById('player').muted = true;
        //$soundControl.style.backgroundImage = "url(\"img/Mute_Icon.svg\")";
      document.getElementById('soundoff').style.display = 'block';
        document.getElementById('soundon').style.display = 'none';
    }
    
})


$startB.addEventListener("click", function(event){
    pressStart()
});

$quitB.addEventListener("click", function(event){
    pressQuit();
});



window.addEventListener("keypress", function(ev){
    if(ev.keyCode == "32"){
    document.body.style.backgroundColor="lavender";
     pressStart();
        
    }else if(ev.keyCode == "81" || ev.keyCode == "90"){ // why is this not working ? doesn't work with keyCodes other than space........
       
      document.body.style.backgroundColor = "LightSeaGreen";
      
        
    }else{
        document.body.style.backgroundColor="lavender";
        pressQuit();
         //circleGame.keepPlaying = false;
       // $screen.style.cursor = "default";
        
    }
});

/*
if(circleGame.keepPlaying == true){
$quitB.innerHTML = "IAOIAOSIODA";
}else{
$quitB.innerHTML = "just kidding";
$quitB.addEventListener("click", function(event){
    circleGame.keepPlaying = true;
});
}*/



//move mouse for player 1


$screen.addEventListener('mousemove', function(event){
    heroDot.posX = event.clientX;
    heroDot.posY = event.clientY;
 

});

var highS = 0;


//---- Casual Connections 2.0
var drawScore = function(){
    var score = heroDot.score;
    var $points = document.querySelector("#pointn");
    $points.innerHTML = score;
}


var drawHighScore = function(){
    var score = heroDot.score;
    var $highP = document.querySelector("#high-points");
    
    if(highS <= score){
        highS = score;
    }else{
        highS = highS;
    };
    $highP.innerHTML = "high score: " + highS;
}

var Game = function(){
    
this.keepPlaying = true;
  var gameInfo = this;

  this.quit = function(){
    this.keepPlaying = false;
  };
};

drawUI();
var circleGame;

//make all foes offscreen to left
var resetFoes = function(){
    foes.length = 0; //clear old foes
    setTimeout(makeFoes, 400); //new foes enter after a delay
}

var startGame = function(){
    circleGame = new Game();
    gameStarted = true;
    makeFoods();
    makeHero();
    resetFoes();
//add controller stuff

/*document.querySelector('#quit').addEventListener('click', function(){
    circleGame.quit();
  });*/
  
 var endGame = function(){
     console.log("GAME OVER!!!!!!!!!!!!!!!!!!!!!!");
        deathCount ++;
        gameStarted = false;
        var $end = document.createElement('div');
        $end.className = "gameOver";
        $end.setAttribute('className', 'gameOver');
        $end.innerHTML = "...bruh";
        
        if(deathCount == 5){
            $end.id = "angryPepe";
            $end.setAttribute('id', 'angryPepe');
            $end.innerHTML = "FIVE DEATHS!!!"
        }
        
        $screen.appendChild($end);
        $screen.style.cursor="default" ;
 };
 
   var mainLoop = function(){
       //alert("AHH");
    if (circleGame.keepPlaying && gameStarted){
      updateGame(circleGame);
      drawGame(circleGame);
      window.setTimeout(mainLoop, 20);
      
  // update - game braain
  // get dipsay
        }
    //game over D:
    else{
        endGame();
        }
    }
    
    mainLoop();
}



//document.addEventListener("DOMContentLoaded", startGame);
//startGame();













