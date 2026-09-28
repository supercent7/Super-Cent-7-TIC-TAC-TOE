 const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const restartButton = document.getElementById("restart");

const computerModeButton = document.getElementById("computerMode");
const twoPlayerModeButton = document.getElementById("twoPlayerMode");


// =========================
// GAME STATE
// =========================

let board = ["", "", "", "", "", "", "", ""];

let currentPlayer = "X";

let gameActive = true;

let vsComputer = true;

let computerThinking = false;


// =========================
// WINNING COMBINATIONS
// =========================

const winningPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],

    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],

    [0, 4, 8],
    [2, 4, 6]
];


// =========================
// CELL CLICK
// =========================

function handleCellClick(event) {

    const cell = event.target;

    const index = Number(cell.dataset.index);


    // Don't allow moves while computer is thinking

    if (computerThinking) {
        return;
    }


    // Don't allow occupied cells

    if (board[index] !== "" || !gameActive) {
        return;
    }


    // Computer mode:
    // Player can only control X

    if (vsComputer && currentPlayer !== "X") {
        return;
    }


    makeMove(index, currentPlayer);


    const result = checkGame();

    if (result) {
        return;
    }


    // Computer's turn

    if (vsComputer) {

        currentPlayer = "O";

        statusText.textContent = "Computer is thinking...";
        statusText.classList.add("thinking");

        computerThinking = true;


        // Small delay makes the computer feel more natural

        setTimeout(() => {

            computerMove();

        }, 450);

    } else {

        currentPlayer =
            currentPlayer === "X" ? "O" : "X";

        statusText.textContent =
            `Player ${currentPlayer}'s turn`;

    }
}


// =========================
// MAKE MOVE
// =========================

function makeMove(index, player) {

    board[index] = player;

    cells[index].textContent = player;

    cells[index].classList.add(
        player.toLowerCase()
    );
}


// =========================
// COMPUTER MOVE
// =========================

function computerMove() {

    if (!gameActive) {
        return;
    }


    // Find the best possible move

    const bestMove = getBestMove();


    if (bestMove !== -1) {

        makeMove(bestMove, "O");

    }


    computerThinking = false;

    statusText.classList.remove("thinking");


    const result = checkGame();

    if (result) {
        return;
    }


    currentPlayer = "X";

    statusText.textContent = "Your turn — X";
}


// =========================
// FIND BEST MOVE
// =========================

function getBestMove() {

    let bestScore = -Infinity;

    let move = -1;


    for (let i = 0; i < board.length; i++) {

        if (board[i] === "") {

            board[i] = "O";


            const score = minimax(
                board,
                0,
                false
            );


            board[i] = "";


            if (score > bestScore) {

                bestScore = score;

                move = i;

            }
        }
    }


    return move;
}


// =========================
// MINIMAX AI
// =========================

function minimax(position, depth, maximizing) {

    const result = getWinner(position);


    // Computer wins

    if (result === "O") {
        return 10 - depth;
    }


    // Player wins

    if (result === "X") {
        return depth - 10;
    }


    // Draw

    if (!position.includes("")) {
        return 0;
    }


    // Computer's turn

    if (maximizing) {

        let bestScore = -Infinity;


        for (let i = 0; i < position.length; i++) {

            if (position[i] === "") {

                position[i] = "O";


                const score = minimax(
                    position,
                    depth + 1,
                    false
                );


                position[i] = "";


                bestScore = Math.max(
                    bestScore,
                    score
                );
            }
        }


        return bestScore;

    }


    // Player's turn

    else {

        let bestScore = Infinity;


        for (let i = 0; i < position.length; i++) {

            if (position[i] === "") {

                position[i] = "X";


                const score = minimax(
                    position,
                    depth + 1,
                    true
                );


                position[i] = "";


                bestScore = Math.min(
                    bestScore,
                    score
                );
            }
        }


        return bestScore;
    }
}


// =========================
// FIND WINNER
// =========================

function getWinner(position) {

    for (const pattern of winningPatterns) {

        const [a, b, c] = pattern;


        if (
            position[a] !== "" &&
            position[a] === position[b] &&
            position[a] === position[c]
        ) {

            return position[a];

        }
    }


    return null;
}


// =========================
// CHECK GAME
// =========================

function checkGame() {

    const winner = getWinner(board);


    if (winner) {

        gameActive = false;


        // Highlight winning combination

        for (const pattern of winningPatterns) {

            const [a, b, c] = pattern;


            if (
                board[a] === winner &&
                board[b] === winner &&
                board[c] === winner
            ) {

                cells[a].classList.add("winner");
                cells[b].classList.add("winner");
                cells[c].classList.add("winner");

                break;
            }
        }


        if (vsComputer) {

            if (winner === "X") {

                statusText.textContent =
                    "🎉 You beat the computer!";

            } else {

                statusText.textContent =
                    "🤖 Computer wins!";

            }

        } else {

            statusText.textContent =
                `Player ${winner} wins!`;

        }


        return true;
    }


    // Draw

    if (!board.includes("")) {

        gameActive = false;

        statusText.textContent =
            "It's a draw!";

        return true;
    }


    return false;
}


// =========================
// RESTART GAME
// =========================

function restartGame() {

    board = [
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        ""
    ];

    currentPlayer = "X";

    gameActive = true;

    computerThinking = false;


    statusText.classList.remove("thinking");

    statusText.textContent =
        vsComputer
            ? "Your turn — X"
            : "Player X's turn";


    cells.forEach((cell) => {

        cell.textContent = "";

        cell.classList.remove(
            "x",
            "o",
            "winner"
        );

    });
}


// =========================
// CHANGE GAME MODE
// =========================

function setMode(computer) {

    vsComputer = computer;

    computerModeButton.classList.toggle(
        "active",
        computer
    );

    twoPlayerModeButton.classList.toggle(
        "active",
        !computer
    );


    restartGame();
}


// =========================
// EVENT LISTENERS
// =========================

cells.forEach((cell) => {

    cell.addEventListener(
        "click",
        handleCellClick
    );

});


restartButton.addEventListener(
    "click",
    restartGame
);


computerModeButton.addEventListener(
    "click",
    () => setMode(true)
);


twoPlayerModeButton.addEventListener(
    "click",
    () => setMode(false)
);