var context, elem,tempContext, tempCanvas, highlightCanvas, highlightContext;
var gameBoard = new Array(8);
var msgBox;
var gameOver = true;
var start = false;
var intel;
var widthTile = 60;
var storepieceSelected = -1;
var turn;
var scrWidth = 480;
var scrHeight= scrWidth;
var timeExpire;
var delay =  1000*60*2; //two minutes
var possibleMoves = new Array(32);
var transform = new Array(32);
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
  var highlightCanvas = document.createElement('canvas');
  if(!highlightCanvas || !highlightCanvas.getContext){
      return;
  }
  tempCanvas.id ='tempView';
  tempCanvas.width = elem.width;
  tempCanvas.height = elem.height;
  container.appendChild(tempCanvas);
  tempContext = tempCanvas.getContext('2d');

  highlightCanvas.id ='highlightView';
  highlightCanvas.width = elem.width;
  highlightCanvas.height = elem.height;
  container.appendChild(highlightCanvas);
  highlightContext = highlightCanvas.getContext('2d');
  restartGame();
  highlightCanvas.addEventListener('click', mousedown, false);
  highlightCanvas.addEventListener('mousemove', mousemove, false);
  /*elem.addEventListener('click', mouseclick, false);
  elem.addEventListener('mousemove', mousehover, false);
  tempCanvas.addEventListener('click', mouseclick, false);
  tempCanvas.addEventListener('mousemove', mousehover, false);*/
 }

init();
}, false);

function mousedown(){
    var x,y;
    // Get the mouse position relative to the canvas element.
    if (ev.layerX || ev.layerX == 0) { // Firefox
      x = ev.layerX;
      y = ev.layerY;
    } else if (ev.offsetX || ev.offsetX == 0) { // Opera
      x = ev.offsetX;
      y = ev.offsetY;
    }

    if((!gameOver) &&(turn != intel)){
        if(playerPieceSelected(turn, pos(turn,x,y))){
           if(storepieceSelected ==-1){
            highlightMoves(pos(turn,x,y));
            storepieceSelected == pos(turn,x,y);
           }else{
             if(validMove(storepieceSelected,pos(turn,x,y))){
                play(storepieceSelected, pos(turn,x,y));
             }
             storepieceSelected ==-1;
           }
        }
    }
}
function constructPossibleMoves(gameBoard){
    var moves = new Array(32);
    //Construct normal moves
    for(var i = 0; i < moves.length; i++){
        moves[i] = new Array[65];
        piecePos = findPiece(i);
        moves[i] = getMoves(i);
    }
    //Ensure king can't get check cause a piece moved

    //Ensure the king can't move into check position
    trimKing(moves,5,row(moves[5][64]), col(moves[5][64])); //Trim the black king
    trimKing(moves,29,row(moves[29][64]), col(moves[29][64])); //Trim the white king

    return moves;
}

function trimKing(moves, kingPos,i, j){
    var checkPos = getPosTranslate(i,j,-1,-1);
    moves = trimMove(move,checkPos,kingPos);
    checkPos = getPosTranslate(i,j,-1,0);
    moves = trimMove(move,checkPos,kingPos);
    checkPos = getPosTranslate(i,j,-1,1);
    moves = trimMove(move,checkPos,kingPos);

    checkPos = getPosTranslate(i,j,0,-2);
    moves = trimMove(move,checkPos,kingPos);
    checkPos = getPosTranslate(i,j,0,-1);
    moves = trimMove(move,checkPos,kingPos);

    checkPos = getPosTranslate(i,j,0,1);
    moves = trimMove(move,checkPos,kingPos);
    checkPos = getPosTranslate(i,j,0,2);
    moves = trimMove(move,checkPos,kingPos);

    checkPos = getPosTranslate(i,j,1,-1);
    moves = trimMove(move,checkPos,kingPos);
    checkPos = getPosTranslate(i,j,1,0);
    moves = trimMove(move,checkPos,kingPos);
    checkPos = getPosTranslate(i,j,1,1);
    moves = trimMove(move,checkPos,kingPos);
    return moves;
}

function trimMove(move, checkPos, kingPos){
    if(checkPos != -1){
        if(moves[kingPos][checkPos] == 1){
            var startPoint =getStartPoint(getOpponent(Math.floor(kingPos/16)));
            for(var i = startPoint; i< startPoint+16; i++ ){
                if(moves[i][checkPos]==1){
                    moves[kingPos][checkPos] = -1;
                    return moves;
                }
            }
        }
    }
    return moves;
}
function getPosTranslate(i,j,di,dj){
    i += di;
    j += dj;
    if((i<0)|| (i>7)){
        return -1;
    }
    if((j<0)|| (j>7) ){
        return -1;
    }
    return posRowCol(i,j);
}

function play(from, to){
    if(!gameOver){
        gameBoard = movePiece(gameBoard, from, to);
        possibleMoves = constructPossibleMoves(gameBoard);
        if(you != intel){
            if(turn == you){
                createTweet(from, to, you, you);
            }else{
                createTweet(from, to, you, intel);
            }
        }else{
            createTweet(from, to, intel, intel);
        }
        
        
        if(gameOverMethod()){
            msg(whoWon());
            gameOver = true;
            return;
        }
        if(inCheck(getOpponent(turn))){
            msg(checkMsg(getOpponent(turn)));
        }

        turn  = getOpponent(turn);
        resetTimer(turn);
        setTimeout(function(){msg(displayWhoTurn(turn));},5000);
        drawPiece(gameBoard);
    }
}
function isPawn(aPiece){
    if((aPiece>7)&&(aPiece<24)) {
        return true;
    }
    return false;
}
function isKing(aPiece){
    if( aPiece ==5){
        return true;
    }
    if(aPiece == 29){
        return true;
    }
    return false;
}
function getPromotionPiece(aPiece){
    return 6;
}
function onEnemyRank(aPiece, row){
        if((row==7)&&(aPiece>15)){
            return true;
        }
        if((row==1)&&(aPiece<16)){
            return true;
        }
        return false;
}
function movePiece(board, from, to){
    var aPiece = pieceIndex(from);
    var second = board[row(to)][col(to)];

    //enpasse check
    if(isPawn(aPiece)){
        if(col(from)!=col(to)){
            if(board[row(to)][col(to)]==-1){
                //an enpasse
                board[row(to)][col(to)]= aPiece;
                board[row(from)][col(from)]= -1;
                board[row(from)][col(to)] = -1;
                return board;
            }
        }
    }
    //Castling Check
    if(isKing(aPiece)){
        if(Maths.abs( col(to)- col(from) )> 1 ){
            if(col(to) > 5){
                //King side Castle
                board[row(to)][col(to)] = aPiece;
                board[row(to)][col(from)] = -1;
                board[row(to)][5] = board[row(to)][7];
                board[row(to)][7] = -1;

            }else{
                //Queen side Castle
                board[row(to)][col(to)] = aPiece;
                board[row(to)][col(from)] = -1;
                board[row(to)][3] = board[row(to)][0];
                board[row(to)][0] = -1;
            }
            return board;
        }

    }
    if(isPawn(aPiece)&&(onEnemyRank(aPiece, row(to)))){
        tranform[aPiece] = getPromotionPiece(aPiece);
    }
    //Straight forward moves
    board[row(to)][col(to)] = aPiece;
    board[row(from)][col(from)] = -1;
    return board;
}
function resetTimer(){
    timeExpire = getTime() + delay;

}
function inCheck(board,possibleMoves,tempTurn){
    var kingPosition = getKing(board,tempTurn);
    startPoint= getStartPoint(getOpponent(tempTurn));
    for(var i = startPoint; i<startPoint+16; i++){
        if(possibleMoves[i][kingPosition]==1){
            return true;
        }
    }
    return false;
}
function getStartPoint(tempTurn){
    if(tempTurn == 1){
        return 0;
    }
    return 16;
}
function getKing(board, tempTurn){
    if(tempTurn == 1){
        kingSymbol= 5;

    }else{
        kingSymbol = 29;
    }
    for(var i =0; i< board.length; i++){
        for(var j=0; j<board.length; j++){
           if(board[i][j] == kingSymbol){
               return posRowCol(i,j);
           }
        }
    }
    return -1;
}
function checkMsg(tempTurn){
    var msgCheck ="";
    if(you == tempTurn){
        if(you == intel){
            msgCheck = "The world is in check";
        }else{
            msgCheck = "You are in check";
        }
    }else{
        if(you == intel){
            msgCheck = player+" is in check";
        }else{
            msgCheck = " The world is in check";
        }
    }
    return msgCheck;
}
function gameOverMethod(){
    if(((checkDraw(turn)))||(checkDraw(getOpponent(turn)))){
        return true;
    }
    if(checkWin(turn)){
        return true;
    }
    if(checkWin(getOpponent(turn))){
        return true;
    }
    return false;
}
function whoWon(){
    var winStr = "The Game was a draw";
    if(checkWin(you)){
        if(you == intel){
           winStr = "Congrats the world won!!!";
           return winStr;
        }
        winStr = "Congrats you just beat the world!!!";
        return winStr;
    }


    if(checkWin(getOpponent(you))){
        if(you == intel){
           winStr = "Sorry the world lost";
           return winStr;
        }
        winStr = "Sorry you lost against the world";
        return winStr;
    }
    return winStr;
}
function displayWhoTurn(turn){
    var whoStr = "";
    
    if(turn == you){
        if(you == intel){
            whoStr = "It is your turn to play on befhalf of the world ";
        }else{
            whoStr = "It is your turn to play";
        }
        
    }else{
        if(you == intel){
            whoStr = "It is "+player+" turn to play ";
        }else{
            whoStr = "It is the world's turn to play";
        }
        
    }
    return whoStr;
}
function getOpponent(turn){
    if(turn == 1){
        return 0;
    }
    return 1;
}
function validMove(from, to){
    if(to == -1){ return false;}
    if(sameTeam(from, to)){return false;}
    if(possibleMoves[pieceIndex(from)][to] == -1){return false;}
    return true;
}
function pieceIndex(pos){
    var aPiece = gameBoard[row(pos)][col(pos)];
    if(aPiece < 100){
        return aPiece;
    }else{
        return aPiece - 100;
    }
}
function sameTeam(from, to){
    if( (gameBoard[row(from)][col(from)]<100)&&(gameBoard[row(to)][col(to)]<100)){
        return true;
    }
     if( (gameBoard[row(from)][col(from)]>100)&&(gameBoard[row(to)][col(to)]>100)){
        return true;
    }
    return false;
}
function pos(turn, x, y){
    if((x<0)&&(x>scrWidth)){
        return -1;
    }
    if((y<0)&&(y>scrHeight)){
        return -1;
    }
    var x_offset = Math.floor(x/60);
    var y_offset = Math.floor(y/60);
    var upsidePos = posRowCol(x_offset,y_offset);
    var reversePos = 64-(upsidePos-1);
    if(turn  == 1){        
        return upsidePos;
    }else{

        return reversePos;
    }
    
}
function playerPieceSelected(turn, pos){
    if((pos >= 1)&&( pos<=64)){
        var thePiece = gameBoard[row(pos)][col(pos)];
        if(thePiece == -1){ return false;}
        if((thePiece<100)&&(turn ==0)){
            return true;
        }
        if((thePiece > 100)&&(turn ==1)){
            return true;
        }
    }
    return false;
}
function row(pos){
    return Math.floor((pos-1)/8);
}
function col(pos){
    return (pos-1)%8;;
}
function posRowCol(i, j){
    return (i*8)+(j+1);
}
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