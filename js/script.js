var turncnt; // tracks the total number of turns used (by both players)]
var opponent; // tracks whether opponent is computer or live player
var p1Image = "images/tictac.png";
var p2Image = "images/to.png";
var board = [];
var turnX;
var gameOn;
var reset = document.getElementById("reset");
var opps = document.getElementsByName("opponent");
var p1Icon = document.getElementsByName("p1Icon");
var title = document.getElementById("title");
var status1 = document.getElementById("status");
var gameboard = document.getElementById("gameboard");
var boardwidth;
var boardlength;
var maxturns;

// eventListener function
// handles the logic for what do do when a square/cell is clicked
function clickSquare(event)
{
	var result;

	// game is over so display message and exit
	if (isGameOver(isWinner()))
	{
		status1.innerHTML = "The game is over.  Click reset to start a new game.";
		return;
	}

	// game isn't over but square already has a value, show status message and exit
	if (event.target.value != "")
	{
		status1.innerHTML = "That square has already been selected.  Please choose another square."
		return;
	}

	// if we got here then everything is ok so clear the status
	status1.innerHTML = "&nbsp;";

	// ok finally time to handle the player's move
	if (turnX)
	{
		event.target.value = "X";
		event.target.style.backgroundImage = "url(" + p1Image + ")";
		turnX = !turnX;
		turncnt++;
		result = isWinner();

		// make sure there isn't already a winner or cat's game and opponent is computer
		if (result === "" && !isGameOver(result) && opponent === "computer")
		{
			makeComputerMove();
			turnX = !turnX;
			turncnt++;
			result = isWinner();
		}
	}
	else
	{
		event.target.value = "O";
		event.target.style.backgroundImage = "url(" + p2Image + ")";
		turnX = !turnX;
		turncnt++;
		result = isWinner();
	}
	// check the results at the end of each turn and update the status as necessary
	if (result != "")
	{
		status1.innerHTML = "Player " + result + " is the winner!!!!!";
	}
	else if (isGameOver(result) && !result)
	{
		status1.innerHTML = "The game is a tie.";
	}
}

function makeComputerMove()
{
	// computer is always toe/player2, so if we got into this function there will always be an open square for it
	// just keep picking random squares until we find an open one
	var rnd;
	var square;

	rnd = Math.floor(Math.random() * boardwidth*boardlength + 1);
	square = "square" + rnd;
	while (document.getElementById(square).value != "")
	{
		rnd = Math.floor(Math.random() * boardwidth*boardlength + 1);
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
	var ok;

	// check horizontals
	for (var i=0; i<boardlength; i++)
	{
		ok = true;
		for (var j=0; j<boardwidth-1; j++)
		{
			if (board[i][j].value != board[i][j+1].value)
			{
				ok = false;
			}
		}
		if (ok)
		{
			// if i got down here then all cells match so any one sure they're not all blank
			if (board[i][0].value != "")
			{
				highlightWinner(i,"row");
				return board[i][0].value;
			}
		}
	}

	// check verticals
	for (i=0; i<boardwidth; i++)
	{
		ok = true;
		for (j=0; j<boardlength-1; j++)
		{
			if (board[j][i].value != board[j+1][i].value)
			{
				ok = false;
			}
		}
		if (ok)
		{
			// if i got down here then all cells match so any one sure they're not all blank
			if (board[0][i].value != "")
			{
				highlightWinner(i,"col");
				return board[0][i].value;
			}
		}

	}

	// check diagonal 1
	ok = true;
	for (i=0;i<boardlength-1;i++)
	{
		if (board[i][i].value != board[i+1][i+1].value)
		{
			ok = false;
		}

	}
	if (ok)
	{
		// if i got down here then all cells match so any one sure they're not all blank
		if (board[0][0].value != "")
		{
			highlightWinner(0,"diag");
			return board[0][0].value;
		}
	}

	// check diagonal 2
	ok = true;
	for (i=boardlength-1; i>0; i--)
	{
		if (board[i][boardlength-i-1].value != board[i-1][boardlength-i].value)
		{
			ok = false;
		}

	}
	if (ok)
	{
		// if i got down here then all cells match so any one sure they're not all blank
		if (board[boardwidth-1][0].value != "")
		{
			highlightWinner(boardlength-1,"diag");
			return board[boardlength-1][0].value;
		}
	}

	return "";
}

// determines if there is a winner or tie game to prevent player from continuously clicking and changing the squares
function isGameOver(result)
{
	return (result != "" || turncnt >=maxturns);
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
			if (start===0)
			{
//				board[boardwidth-1][0].style.animationIterationCount = ( board[1][1].style.animationIterationCount = ( board[0][2].style.animationIterationCount = "infinite"));
				for (i=boardlength-1; i>=0; i--)
				{
						board[i][i].style.animationIterationCount = "infinite";
				}
			}
			else if (start===boardlength-1)
			{
//				board[0][0].style.animationIterationCount = (board[1][1].style.animationIterationCount = (board[2][2].style.animationIterationCount = "infinite"));
				for (i=boardlength-1; i>=0; i--)
				{
						board[i][boardlength-i-1].style.animationIterationCount = "infinite";
				}
			}
			break;
	}
}

///////////////////////////////////////////
// this section does the setup/cleanup
///////////////////////////////////////////

function drawBoard()
{
	var i,j;
	var board = "";

	for (i=1; i<=boardwidth; i++)
	{
		board += "<div class='row'>"
		for (j=1; j<=boardlength; j++)
		{
			board += "<div class='square bevel' id='square" + (((i-1)*boardwidth) + j) + "'></div>";
		}
		board += "</div><div class='div-clear'></div>"
	}
	document.getElementById('gameboard').innerHTML = board;
}

function initializeGame(boardsize)
{
	var cnt=1;
	var i, j;
	boardwidth = boardlength = boardsize;
	drawBoard();
	opponent = "player";
	for (i=0; i<boardwidth; i++)
	{
		board[i] = [];
		for (j=0; j<boardlength; j++)
		{
			board[i][j] = "";
		}
	}
	maxturns = boardwidth * boardlength;


	// add the same eventListener for both mouseup and mouseleave in case the user clicks down and moves off the div before clicking up
	for (var i=0; i< 3;i++)
	{
		boardSize[i].addEventListener("click", function(event){initializeGame(event.target.value)})
	}
	reset.addEventListener("click", resetBoard);
	reset.addEventListener("mousedown", simulateMouseDown);
	reset.addEventListener("mouseup", simulateMouseUp);
	reset.addEventListener("mouseleave", simulateMouseUp);

	opps[0].addEventListener("click", selectOpponent);
	opps[1].addEventListener("click", selectOpponent);

	title.addEventListener("click", function(event) { status1.innerHTML = "Clicking the title won't accomplish anything useful."; });

	gameboard.addEventListener("click", clickSquare);

	for (var i=0; i< p1Icon.length;i++)
	{
		p1Icon[i].addEventListener("click", changeIcon)
	}

	for (var i=0;i<board.length;i++)
	{
		for (var j=0;j<board[i].length;j++)
		{
			board[i][j] = document.getElementById("square" + cnt++); // do this first otherwise rest of assignments have no value
			board[i][j].value = ""; 	// create a variable value to use to compare the value of each square
			board[i][j].style.backgroundImage = "";
			board[i][j].style.animationIterationCount = "";
			board[i][j].style.backgroundSize = "150px 150px";
		}
	}

	opponent = "player";
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
	turnX = true;	// makes sure game always starts with player X.  not a requirement but doing it just because
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
	// assign new image to active image
	p1Image = event.target.value;

	// check if there are any values on the board and change all existing instances of the icon, even if the game is over
	for (i in board)
	{
		for (j in board[i])
		{
			if (board[i][j].value === "X")
			{
				board[i][j].style.backgroundImage = "url(" + event.target.value + ")"
			}
		}
	}
}

// eventListener function
function simulateMouseDown(event)
{
	event.target.style.backgroundColor = "#895998";
}

function simulateMouseUp(event)
{
	event.target.style.backgroundColor = "#c0c0c0";
}

/////////////////////////////////////////
// main
/////////////////////////////////////////

initializeGame(3);


