import React, { useState, useEffect } from "react";
import "./App.css";
import Grid from "./assets/components/Grid";

const App = () => {
  const [grid, setGrid] = useState([]);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(10);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameOver, setGameOver] = useState(false);
  const [hintCount, setHintCount] = useState(0);
  const [lastSwap, setLastSwap] = useState(null);
  const [gameMode, setGameMode] = useState("moves");
  const [targetScore, setTargetScore] = useState(100);

  const elementTypes = ["🍎", "🍌", "🍇", "🍉", "🍒", "🍍"];
  const bombSymbol = "💣";
  const rocketSymbol = "🚀";

  useEffect(() => {
    resetGame();
  }, []);

  const resetGame = () => {
    setGrid(generateNonMatchingGrid());
    setScore(0);
    setMoves(10);
    setTimeLeft(60);
    setGameOver(false);
    setHintCount(0);
    setLastSwap(null);
  };
  const startGame = () => {
    if (gameMode === "time") {
      setTimeLeft(60); // Start with 60 seconds
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            setGameOver(true);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    resetGame();
  };

  // Utility function to check if swapping two elements will result in a match
  const canSwapAndMatch = (fromRow, fromCol, toRow, toCol) => {
    let tempGrid = [...grid];
    [tempGrid[fromRow][fromCol], tempGrid[toRow][toCol]] = [
      tempGrid[toRow][toCol],
      tempGrid[fromRow][fromCol],
    ];
    return hasMatches(tempGrid);
  };

  const generateGrid = () => {
    let newGrid = [];
    for (let row = 0; row < 8; row++) {
      let currentRow = [];
      for (let col = 0; col < 8; col++) {
        const randomElement =
          elementTypes[Math.floor(Math.random() * elementTypes.length)];
        currentRow.push(randomElement);
      }
      newGrid.push(currentRow);
    }
    return newGrid;
  };

  const generateNonMatchingGrid = () => {
    let newGrid;
    do {
      newGrid = generateGrid();
    } while (hasMatches(newGrid));
    return newGrid;
  };

  const hasMatches = (grid) => {
    // Check for horizontal and vertical matches
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 6; col++) {
        if (
          grid[row][col] === grid[row][col + 1] &&
          grid[row][col] === grid[row][col + 2]
        ) {
          return true;
        }
      }
    }
    for (let col = 0; col < 8; col++) {
      for (let row = 0; row < 6; row++) {
        if (
          grid[row][col] === grid[row + 1][col] &&
          grid[row][col] === grid[row + 2][col]
        ) {
          return true;
        }
      }
    }
    return false;
  };

  const updateGridAndCheckMatches = (newGrid) => {
    setGrid(newGrid);
    checkForMatches(newGrid);
  };

  const handleSwap = (fromRow, fromCol, toRow, toCol) => {
    let newGrid = [...grid];
    [newGrid[fromRow][fromCol], newGrid[toRow][toCol]] = [
      newGrid[toRow][toCol],
      newGrid[fromRow][fromCol],
    ];
    // Save last swap for reverting if no matches are found
    setLastSwap({ fromRow, fromCol, toRow, toCol });
    updateGridAndCheckMatches(newGrid);
  };

  const checkForMatches = (grid) => {
    let matchesFound = false;

    // Check horizontal matches
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 6; col++) {
        let matchLength = 1;

        while (
          col + matchLength < 8 &&
          grid[row][col] === grid[row][col + matchLength]
        ) {
          matchLength++;
        }

        if (matchLength >= 3) {
          matchesFound = true;
          setScore((prevScore) => prevScore + 3 * (matchLength === 4 ? 2 : 1));

          for (let i = 0; i < matchLength; i++) {
            grid[row][col + i] = matchLength === 5 ? bombSymbol : null;
          }
        }

        col += matchLength - 1;
      }
    }

    // Check vertical matches
    for (let col = 0; col < 8; col++) {
      for (let row = 0; row < 6; row++) {
        let matchLength = 1;

        while (
          row + matchLength < 8 &&
          grid[row][col] === grid[row + matchLength][col]
        ) {
          matchLength++;
        }

        if (matchLength >= 3) {
          matchesFound = true;
          setScore((prevScore) => prevScore + 3 * (matchLength === 4 ? 2 : 1));

          for (let i = 0; i < matchLength; i++) {
            grid[row + i][col] = matchLength === 5 ? bombSymbol : null;
          }
        }

        row += matchLength - 1;
      }
    }

    if (matchesFound) {
      setGrid([...grid]);
      setTimeout(() => dropElements(grid), 300);
    } else {
      // If no matches found, revert the last swap
      if (lastSwap) {
        const { fromRow, fromCol, toRow, toCol } = lastSwap;
        let revertedGrid = [...grid];
        [revertedGrid[fromRow][fromCol], revertedGrid[toRow][toCol]] = [
          revertedGrid[toRow][toCol],
          revertedGrid[fromRow][fromCol],
        ];
        setGrid(revertedGrid);
        setMoves(moves - 1); // Decrement moves
        setLastSwap(null); // Reset last swap
      }
    }

    if (moves <= 0) {
      setGameOver(true);
    }
  };

  const dropElements = (grid) => {
    for (let col = 0; col < 8; col++) {
      for (let row = 7; row >= 0; row--) {
        if (grid[row][col] === null) {
          for (let r = row; r > 0; r--) {
            grid[r][col] = grid[r - 1][col];
          }
          grid[0][col] =
            elementTypes[Math.floor(Math.random() * elementTypes.length)];
        }
      }
    }

    setGrid([...grid]);

    setTimeout(() => checkForMatches(grid), 500);
  };

  // const handleHint = () => {
  //   if (hintCount < 2) {
  //     setHintCount(hintCount + 1);
  //     alert("Hint used!");
  //   } else {
  //     alert("You have used the maximum number of hints.");
  //   }
  // };
  const handleHint = () => {
    if (hintCount < 2) {
      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
          const element = grid[row][col];
          // Check adjacent elements for a possible match
          if (
            row < 7 &&
            grid[row + 1][col] &&
            canSwapAndMatch(row, col, row + 1, col)
          ) {
            alert(`Hint: Swap (${row}, ${col}) with (${row + 1}, ${col})`);
            return;
          }
          if (
            col < 7 &&
            grid[row][col + 1] &&
            canSwapAndMatch(row, col, row, col + 1)
          ) {
            alert(`Hint: Swap (${row}, ${col}) with (${row}, ${col + 1})`);
            return;
          }
        }
      }
      alert("No valid hints available!");
    } else {
      alert("You have used the maximum number of hints.");
    }
  };

  return (
    <main className="bg-gray-200 h-screen">
      <div className=" text-center p-4">
        <h1 className="text-4xl font-bold mb-4">Match Master</h1>
      </div>
      <div className="flex gap-10  items-center justify-center  ">
        <div className="flex flex-col gap-3">
          <h2>Select Game Mode</h2>
          <select
            value={gameMode}
            onChange={(e) => setGameMode(e.target.value)}
          >
            <option value="moves">Moves</option>
            <option value="time">Time</option>
          </select>

          <h2>Select Target Score</h2>
          <input
            type="number"
            value={targetScore}
            onChange={(e) => setTargetScore(Number(e.target.value))}
          />

          <button
            className="bg-blue-600 p-2 rounded-lg text-white font-bold"
            onClick={startGame}
          >
            Start Game
          </button>
        </div>
        <div className="">
          <div className="text-xl mb-4">Score: {score}</div>
          <div className="text-xl mb-4">Moves: {moves}</div>
          <div className="text-xl mb-4">Time Left: {timeLeft}s</div>
        </div>

        <Grid grid={grid} handleSwap={handleSwap} gameOver={gameOver} />

        <button
          className={`bg-blue-600 p-2 rounded-lg text-white font-bold ${
            gameOver || hintCount >= 2 || moves <= 0 || timeLeft <= 0
              ? "cursor-not-allowed opacity-50"
              : ""
          }`}
          onClick={handleHint}
          disabled={gameOver || hintCount >= 2 || moves <= 0 || timeLeft <= 0}
        >
          Hint ({hintCount}/2)
        </button>
      </div>
    </main>
  );
};

export default App;
