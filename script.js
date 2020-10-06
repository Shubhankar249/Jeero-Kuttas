let origBoard, gameEnds=false;
const human='X';
const comp='O';
const winComb=[
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6],
];

let human_score = [0,0];
let computer_score = [0,0];


const cells=document.querySelectorAll('.cell');
startGame();

function startGame() {
    document.querySelector('.endgame').style.display="none";
    origBoard=Array.from(Array(9).keys());

    for (let i=0; i<cells.length; i++) {
        cells[i].innerText='';
        cells[i].style.removeProperty('background-color');
        cells[i].addEventListener('click', turnClick, false);
    }
    gameEnds=false; 
}

function turnClick(square) {
    if (typeof origBoard[square.target.id]=="number") {
        turn(square.target.id, human);

        setTimeout(()=>{
            if (!checkTie() && !gameEnds)
                turn(bestSpot(), comp);
        }, 300);
    }
}

function turn(squareId, player) {
    origBoard[squareId]=player;
    document.getElementById(squareId).innerText=player;

    let gameWon=checkWin(origBoard, player);
    if (gameWon) gameOver(gameWon);
}

function checkWin(board, player) {
    let plays= board.reduce((a, e, i) => (e===player)? a.concat(i) : a, []);
    let gameWon=null;
    for (let [index, win] of winComb.entries()) {
        if (win.every(el=> plays.indexOf(el)>-1)) {
            gameWon={index: index, player:player};
            break;
        }
    }
    return gameWon;
}

function gameOver(gameWon) {
    for (let ind of winComb[gameWon.index]) {
        document.getElementById(ind.toString()).style.backgroundColor = gameWon.player === human ? "blue" : "red";
    }

    for (let i = 0; i < cells.length; i++)
        cells[i].removeEventListener('click', turnClick, false);

    if(gameWon.player === human){
        human_score[0]++;
        computer_score[1]++;
        declareWinner('You win!');
    }
    else{
        computer_score[0]++;
        human_score[1]++;
        declareWinner('You lose!');
    }
    gameEnds=true;
}

function declareWinner(who) {
    document.querySelector(".endgame").style.display = "block";
    document.querySelector('.endgame .text').innerText = who;

    document.getElementById("replay_button").onclick = function(){      //   event handler displays scores of each after replay button click

        document.getElementById("human_wins").innerHTML = human_score[0];
        document.getElementById("human_losses").innerHTML = human_score[1];

        document.getElementById("computer_wins").innerHTML = computer_score[0];
        document.getElementById("computer_losses").innerHTML = computer_score[1];

        startGame();
    };
}

function emptySquares() {
    return origBoard.filter(s=> typeof s=== 'number');
}

function bestSpot() {
    return minimaxAlgo(origBoard, comp).index;
}

function checkTie() {
    if (!emptySquares().length && !gameEnds) {
        for (let i = 0; i < cells.length; i++) {
            cells[i].style.backgroundColor="green";
            cells[i].removeEventListener('click', turnClick, false);
        }

        declareWinner('Tie Game!');
        return true;
    }
    return false;
}

function minimaxAlgo(newBoard, player) {
    if (checkWin(newBoard, human))
        return {score: -10};
    if (checkWin(newBoard, comp))
        return {score: 10};
    if (!emptySquares(newBoard).length)
        return {score: 0};

    let availSpots=emptySquares(newBoard);
    let moves=[];
    for (let i=0; i<availSpots.length; i++) {
        let move={};
        move.index=newBoard[availSpots[i]];
        newBoard[availSpots[i]]=player;
        if (player===comp)  move.score=minimaxAlgo(newBoard, human).score;
        else move.score=minimaxAlgo(newBoard, comp).score;
        newBoard[availSpots[i]]=move.index;
        moves.push(move);
    }
    let bestMove;
    if (player===human) {
        let minScore=10000;
        for (let i of moves) {
            if (i.score<minScore) {
                minScore=i.score;
                bestMove=i;
            }
        }
    }
    else {
        let maxScore=-10000;
        for (let i of moves) {
            if (i.score>maxScore) {
                maxScore=i.score;
                bestMove=i;
            }
        }
    }
    return bestMove;
}
