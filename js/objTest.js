//document.addEventListener("DOMContentLoaded", startApp);


var player = {type:"Squirrel", xPos:"500", yPos:"500"};

//player.yPos
//player.xPos


//var fam = ["Andy", "Sara", "Simone"];
var $p1 = document.createElement('div');
$p1.id = "player1";
$p1.setAttribute('id', 'player1');
document.addEventListener('mousemove', function(event){
    player.xPos = event.pageX + "px";
    player.yPos = event.pageY + "px";
    //console.log(mxPos);
    $p1.style.left = player.xPos;
    $p1.style.top = player.yPos;
    //$p1.style.transorm = "translateX(-50px)";
    //$p1.style.transorm = "translateY(-50px)";
});



/*
fam.forEach(function(name){
  var $person = document.createElement('li');
  $person.innerHTML = name;
  $person.classList.add("person");
  $p1.appendChild($person);
});
*/
document.body.appendChild($p1);





