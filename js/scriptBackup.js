var turncnt = 0; // tracks the total number of turns used (by both players)]
var opponent = "";
var p1Image = "images/tictac.png";
var p2Image = "images/to.png";
var board = [["","",""],["","",""],["","",""]];
var turnX = true;
var gameOn = true;
var reset = document.getElementById("reset");
var opps = document.getElementsByName("opponent");
var p1Icon = document.getElementsByName("p1Icon");
var title = document.getElementById("title");
var status1 = document.getElementById("status");

// eventListener function
// handles the logic for what do do when a square/cell is clicked
function clickSquare(event)
{
	var result;

	// if game is over then display message and exit
	if (isGameOver(isWinner()))
	{
		status1.innerHTML = "The game is over.  Click reset to start a new game.";
		return;
	}
	
	// if square already has a value, show status message and exit
	if (event.target.value != "")
	{
		status1.innerHTML = "That square has already been selected.  Please choose another square."
		return;
	}

	// if we got here then everything is ok so clear the status
	status1.innerHTML = "&nbsp;";

	if (turnX)
	{
//		console.log('player X turn')
//		console.log('setting tictac ' + event.target.id)
		event.target.value = "X";
		event.target.style.backgroundImage = "url(" + p1Image + ")";
		turnX = false;
		turncnt++;		
//		console.log('checking for winner...')
		result = isWinner();
//		console.log('result is ' + result)
		// make sure there isn't already a winner or cat's game before letting computer have a turn
		if (result === "" && !isGameOver(result))
		{
//			console.log("computer move")
			if (opponent === "computer")
			{
				makeComputerMove();
				turnX = true;
				turncnt++;
			}
			result = isWinner();
		}
	}
	else
	{
		event.target.value = "O";
		event.target.style.backgroundImage = "url(" + p2Image + ")";
		turnX = true;
		turncnt++;		
		result = isWinner();
	}
//	console.log('turncnt is ' + turncnt)
	if (isGameOver(result) && !result)
	{
		status1.innerHTML = "The game is a tie!";		
	}
}

function makeComputerMove()
{
	// computer is always toe/player2, so if we got into this function there will always be an open square for it
	// just keep picking random squares until we find an open one
	var rnd;
	var square;

	rnd = Math.floor(Math.random() * 9 + 1);
	square = "square" + rnd;
	while (document.getElementById(square).value != "")
	{
		rnd = Math.floor(Math.random() * 9 + 1);
		square = "square" + rnd;
	}

	if ( document.getElementById(square).value === "")
	{
		document.getElementById(square).value = "O";
		document.getElementById(square).style.backgroundImage = "url(" + p2Image + ")";
		return;
	}
}

// checks for a winner.  return which player won or empty string
function isWinner()
{
	var boardwidth = 3;
	var boardlength = 3;

	// check horizontals
	for (var i=0; i<boardlength; i++)
	{
		if ( board[i][0].value == board[i][1].value && board[i][1].value== board[i][2].value && board[i][0].value != "")
		{
			highlightWinner(i,"row");
			return board[i][0].value;
		}
	}

	// check verticals
	for (i=0; i<boardwidth; i++)
	{
		if ( board[0][i].value == board[1][i].value && board[1][i].value == board[2][i].value && board[0][i].value != "")
		{
			highlightWinner(i,"col")
			return board[0][i].value;
		}
	}

	// check diagonals
	if ( board[0][0].value == board[1][1].value && board[1][1].value == board[2][2].value && board[0][0].value != "")
	{
		highlightWinner(0,"diag")
		return board[0][0].value;
	}
	else if ( board[2][0].value == board[1][1].value && board[1][1].value == board[0][2].value && board[2][0].value != "")
	{
		highlightWinner(2,"diag")
		return board[2][0].value;
	}

	return "";
}

// determines if there is a winner or tie game and sets a flag that keeps track of whether the game is still going or not
// to prevent player from continuously clicking and changing the squares
function isGameOver(result)
{
	/*
	if (result == "X")
	{
		gameOn = false;
	}
	else if (result == "O")
	{
		gameOn = false;
	}
	else if (turncnt == 9)
	{
		document.getElementById("status").innerHTML = "The game is a tie!";
		gameOn = false;
	}
	*/
	return (result != "" || turncnt >=9);
}

// this performs some action that shows who the winner is.  right now that action is to highlight the row with flashing colors
function highlightWinner(start,direction)
{
	switch (direction)
	{
		case "row":
			for (var j in board[start])
			{
				board[start][j].style.animationIterationCount = "infinite";
			}
			break;
		case "col":
			for (var i in board[start])
			{
				board[i][start].style.animationIterationCount = "infinite";
			}
			break;
		case "diag":
			if (start===2)
			{
				board[2][0].style.animationIterationCount = ( board[1][1].style.animationIterationCount = ( board[0][2].style.animationIterationCount = "infinite"));
			}
			else if (start===0)
			{
				board[0][0].style.animationIterationCount = (board[1][1].style.animationIterationCount = (board[2][2].style.animationIterationCount = "infinite"));
					}
			break;
	}
}

///////////////////////////////////////////
// this section does the setup/cleanup
///////////////////////////////////////////

function initializeGame()
{
	var cnt=1;

	opponent = "player";

	for (var i=0;i<board.length;i++)
	{
		for (var j=0;j<board[i].length;j++)
		{
			board[i][j] = document.getElementById("square" + cnt++); // do this first otherwise rest of assignments have no value
			board[i][j].value = ""; 	// create a variable value to use to compare the value of each square
//			board[i][j].addEventListener("click", clickSquare);
			board[i][j].style.backgroundImage = "";
			board[i][j].style.animationIterationCount = "";
			board[i][j].style.backgroundSize = "150px 150px";
		}
	}

	turncnt = 0;
	turnX = true;	// makes sure game alwasy starts with player X.  not a requirement but doing it just because
	gameOn = true;
}

// eventListener function
function resetBoard(event)
{
	for(i in board)
	{
		for (j in board[i])
		{
			board[i][j].value = "";
			board[i][j].style.backgroundImage = "";
			board[i][j].style.animationIterationCount = "";
		}
	}
	status1.innerHTML = "&nbsp;";
	turncnt = 0;
	turnX = true;	// makes sure game alwasy starts with player X.  not a requirement but doing it just because
	gameOn = true;
}


//////////////////////////////////////////

// eventListener function
function selectOpponent(event)
{
	opponent = event.target.value;
	switch (opponent)
	{
		case "player":
			p2Image = "images/to.png";
			break;
		case "computer":
			p2Image = "images/toe.png";
			break;
	}

	// in case opponent changes mid-game, check the board and change the icon as necessary
	for (i in board)
	{
		for (j in board[i])
		{
			if (board[i][j].value === "O")
			{
				board[i][j].style.backgroundImage = "url(" + p2Image + ")"
			}
		}
	}

	// also in case is now player 2's turn and the opponent changes from player to computer, need to get computer's turn going
	if (!turnX && !isGameOver(isWinner()))
	{
		makeComputerMove();
		turnX = true;
		turncnt++;
		result = isWinner();
	}
}

/////////////////////////////////////////

// eventListener function
function changeIcon(event)
{
	p1Image = event.target.value;
	console.log("p1Image is "+ p1Image)

	// check if a game is in progress and change all existing instances of the icon if necessary
	for (i in board)
	{
		for (j in board[i])
		{
			if (board[i][j].value === "X")
			{
				board[i][j].style.backgroundImage = "url(" + p1Image + ")"
			}
		}
	}
}

function clickBoard()
{
	console.log(event.target.id)
}

/////////////////////////////////////////
// main
/////////////////////////////////////////

initializeGame();

reset.addEventListener("click", resetBoard);

opps[0].addEventListener("click", selectOpponent);
opps[1].addEventListener("click", selectOpponent);

title.addEventListener("click", function(event) { status1.innerHTML = "Clicking the title won't accomplish anything useful."; });

var brd = document.getElementById("gameboard");
brd.addEventListener("click", clickBoard, true);

for (var i=0; i< p1Icon.length;i++)
{
	p1Icon[i].addEventListener("click", changeIcon)
}

