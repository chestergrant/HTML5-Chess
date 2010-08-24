var context, elem,tempContext, tempCanvas;
var gameBoard = new Array(8);
var msgBox;
var start = false;
var intel=Math.floor(Math.random()*2);
var widthTile = 60;
/*var y_off = 10;
var scr_height = 400;
var scr_width = 660;
var lineWidth =10;
var lineHeight = scr_height-2*y_off;
var x_off = (scr_width - lineHeight)/2;
var space = lineHeight/3;
var lastHover =-1;
var turn = 1;

var gameBoard = new Array(3);
var msgBox;
var start = false;
var firstPlay = true;
var numPlays;
var worker = new Worker('commons.js');

worker.onmessage = function (evt) {
        play(evt.data);
};

worker.onerror = function (evt) {
        alert("An error has occur!");
};*/

window.addEventListener('load', function () {

function init(){
  elem = document.getElementById('myCanvas');
  msgBox = document.getElementById('status');
  if (!elem || !elem.getContext) {
    alert("Error can't get context");
    return;
  }

  // Get the canvas 2d context.
  context = elem.getContext('2d');
  if (!context) {
      alert("Error can't get context");
    return;
  }
  //TO DO, add your application code
  var container = elem.parentNode;
  var tempCanvas = document.createElement('canvas');
  if(!tempCanvas||!tempCanvas.getContext){
      return;
  }
  tempCanvas.id ='tempView';
  tempCanvas.width = elem.width;
  tempCanvas.height = elem.height;
  container.appendChild(tempCanvas);
  tempContext = tempCanvas.getContext('2d');
  restartGame();
  /*elem.addEventListener('click', mouseclick, false);
  elem.addEventListener('mousemove', mousehover, false);
  tempCanvas.addEventListener('click', mouseclick, false);
  tempCanvas.addEventListener('mousemove', mousehover, false);*/
 }

init();
}, false);
/*function convertData(board, piece){
var data = new Array(4);

for(var i=0; i<3;i++){
    data[i] = new Array(3);
    for(var j=0; j<3;j++){
        data[i][j] = board[i][j];
    }
}
data[3] = new Array(3);
data[3][0]= piece
return data;
}*/
function reset(){
    for(var i = 0; i< gameBoard.length;i++){
        gameBoard[i] = new Array(gameBoard.length);
        for(var j = i; j < gameBoard.length; j++){
            gameBoard[i][j] = -1;
        }
        
    }
}
function msg(theMsg){
    var str='<span class="green">Status:&nbsp;</span>';
    msgBox.innerHTML=str+' '+theMsg;
}
/*function xPos(pos){
    return (pos-1)%3;
}
function yPos(pos){
    return Math.floor((pos-1)/3);
}*/

/*
function mousehover(ev){

   if((turn == getOpponent(intel))&&(start)){
    var x,y;
    // Get the mouse position relative to the canvas element.
    if (ev.layerX || ev.layerX == 0) { // Firefox
      x = ev.layerX;
      y = ev.layerY;
    } else if (ev.offsetX || ev.offsetX == 0) { // Opera
      x = ev.offsetX;
      y = ev.offsetY;
    }

    var pos = position(x,y);

    if(pos != -1){
        if(lastHover != pos){
            if(gameBoard[yPos(pos)][xPos(pos)]==-1){
                drawHighlight(pos);
                lastHover = pos;
            }
        }
    }
   }
}

function drawHighlight(pos){

    var xBegin = getCorr(pos,1);
    var yBegin = getCorr(pos, 2);
    var xEnd = getCorr(pos,3);
    var yEnd = getCorr(pos,4);
    tempContext.fillStyle = '#7bc00a';
    tempContext.strokeStyle = '#7bc00a';

    tempContext.clearRect(0, 0, 660, 400);
    tempContext.fillStyle = 'rgba(123,192,10,0.5)';

    tempContext.strokeStyle = '#7bc00a';
    tempContext.lineWidth = 1;

    tempContext.fillRect(xBegin,yBegin,xEnd-xBegin, yEnd-yBegin );

}
function mouseclick(ev){

    var x,y;
    // Get the mouse position relative to the canvas element.
    if (ev.layerX || ev.layerX == 0) { // Firefox
      x = ev.layerX;
      y = ev.layerY;
    } else if (ev.offsetX || ev.offsetX == 0) { // Opera
      x = ev.offsetX;
      y = ev.offsetY;
    }
    if((start)&&(turn == getOpponent(intel))){
        var pos = position(x,y);


        if(pos != -1){
            play(pos);
        }
    }

}*//*
function play(pos){

   var x = xPos(pos);
   var y = yPos(pos);

   if(gameBoard[y][x]==-1){
       gameBoard[y][x] = turn;
       firstPlay = false;
       tempContext.clearRect(0, 0, elem.width, elem.height);

    if(turn == 1){
        turn = 0;
        drawX(pos);
    }else{
        turn =1;
        drawO(pos);

    }

   if(gameOver(gameBoard)){
      msg(whoWon());
      start = false;
      return;
   }

   computerPlay();

   }

}
function whoWon(){
    if(checkWin(gameBoard,1)){
if(getOpponent(intel)==1){
            return "Congrats you won!!!";
        }
        return "Sorry the computer won.";
    }
    if(checkWin(gameBoard,0)){
if(getOpponent(intel)==0){
            return "Congrats you won!!!";
        }
        return "Sorry the computer won.";
    }

    return "The Game was Drawn";
}
*/
function restartGame(){
    start= true;
    tempContext.clearRect(0, 0, elem.width, elem.height);
    context.clearRect(0, 0, elem.width, elem.height);
    intel=Math.floor(Math.random()*2);
    drawChessBoard();
    reset();
    //computerPlay();

}/*
function computerPlay(){

    if(start){
      if(turn == intel){
           msg("Computer turns to play");
           if(firstPlay){play(5); return;}

           worker.postMessage(convertData(gameBoard,intel));//minimax(gameBoard,intel);


        }else{
           msg("Your turn to play");
        }
    }
}
function drawO(pos){
    var xBegin = getCorr(pos,1);
    var yBegin = getCorr(pos, 2);
    var xEnd = getCorr(pos,3);
    var yEnd = getCorr(pos,4);
    var buffer = 20;
    var r = (xEnd - xBegin)/2;
    r = r- buffer;
    var x_cen = xBegin+ ((xEnd - xBegin)/2);
    var y_cen = yBegin+ ((yEnd-yBegin)/2);
    var buffer =10;
    r -= buffer;
    context.lineWidth = lineWidth;
    context.fillStyle = '#FFFFFF';
    context.strokeStyle = '#FFFFFF';
    context.beginPath();
    context.arc(x_cen,y_cen,r,0,Math.PI*2,true);
    context.closePath();
    context.stroke();

}
function drawX(pos){


    var buffer = 20;
    var xBegin = getCorr(pos,1);
    var yBegin = getCorr(pos, 2);
    var xEnd = getCorr(pos,3);
    var yEnd = getCorr(pos,4);
    var sin45 = 0.850903525;
    var o = sin45* lineWidth;

    //draw one side of the x
    context.lineWidth = lineWidth;
    context.fillStyle = '#FFFFFF';
    context.strokeStyle = '#FFFFFF';
    context.beginPath();
    context.moveTo(xBegin+buffer,yBegin+buffer);
    context.lineTo(xEnd-buffer,yEnd-buffer);

    //draw other side of x

    context.moveTo(xBegin+buffer,yEnd-buffer);

    context.lineTo(xEnd-buffer,yBegin+buffer);

    context.stroke();
    context.closePath();



}*//*
function getCorr(pos, type){
    var start_x = (pos-1)%3;
    var start_y = ((pos-(start_x +1))/3);
    //alert(start_x+" "+start_y);
    var addCorr = space;//+lineWidth;

    var xBegin = (addCorr *start_x) + x_off;
    var xEnd = xBegin+space;
    var yBegin = (addCorr *start_y) + y_off;
    var yEnd = yBegin+space;
    if(type==1){
        return xBegin;
    }else if(type == 2){
        return yBegin;
    }else if(type == 3){
        return xEnd;
    }else{
        return yEnd;
    }
}
function position(x,y){
    for(var i=1; i<10;i++){
        if(checkBox(i,x,y)){
            return i;
        }

    }
    return -1;
}
function checkBox(i, x, y){


    var xBegin = getCorr(i,1);
    var yBegin = getCorr(i,2);
    var xEnd = getCorr(i,3);
    var yEnd = getCorr(i,4);

    if((x>=xBegin)&&(x<=xEnd)){
        if((y>=yBegin)&&(y<=yEnd)){
            return true;
        }
    }

    return false;
}*/
function getTileX(i){
    return (i%8)*widthTile;
}
function getTileY(i){
    return (Math.floor(i / 8))*widthTile;
}
function drawTile(i){
    var x_begin = getTileX(i);
    var y_begin = getTileY(i);
    var oddY = false;
    var oddX = false;
    var row = Math.floor(i / 8);
    var col = (i+1)%8;
    if( (row + 1)%2 == 1){
        oddY = true;
    }
    if(col%2 ==1){
        oddX = true;
    }
    if((oddY && oddX)||(!oddY &&!oddX)){
        context.fillStyle = '#C1C1C1';
    }else{
        context.fillStyle = '#000000';
    } 
    context.fillRect(x_begin,y_begin,widthTile,widthTile);
}
function drawChessBoard(){
    for(var i = 0; i<64; i++){
        drawTile(i);
    }
  /*context.fillStyle = '#7bc00a';
  context.strokeStyle = '#7bc00a';
  context.lineWidth = 1;
  context.fillRect(x_off+space,y_off,lineWidth, lineHeight );
  context.fillRect(x_off+2*space,y_off,lineWidth, lineHeight );
  context.fillRect(x_off,y_off+(lineHeight/3),lineHeight, lineWidth );
  context.fillRect(x_off,y_off+2*(lineHeight/3),lineHeight, lineWidth );*/

}