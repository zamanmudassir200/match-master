import React, { useState, useEffect } from 'react';
import Grid from './assets/components/Grid';

function App() {
  const [grid, setGrid] = useState([]);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(10);
  const [time, setTime] = useState(60);
  const [gameMode, setGameMode] = useState('moves');
  const [hintUsed, setHintUsed] = useState(false); // Track if hint has been used
  const [busterUsed, setBusterUsed] = useState(false); // Track if buster has been used
  const symbols = ["*", "|", "/", "@", "$"];

  // const initializeGrid = () => {
  //   const newGrid = Array.from({ length: 8}, () =>
  //     Array.from({ length: 8 }, () => symbols[Math.floor(Math.random() * symbols.length)])
  //   );
  //   setGrid(newGrid);
  // };
  const initializeGrid = () => {
    let newGrid;
  
    // Helper function to check for matches
    const hasMatches = (grid) => {
      for (let r = 0; r < grid.length; r++) {
        for (let c = 0; c < grid[r].length - 2; c++) {
          if (grid[r][c] !== ' ' && grid[r][c] === grid[r][c + 1] && grid[r][c] === grid[r][c + 2]) {
            return true;
          }
        }
      }
  
      for (let c = 0; c < grid[0].length; c++) {
        for (let r = 0; r < grid.length - 2; r++) {
          if (grid[r][c] !== ' ' && grid[r][c] === grid[r + 1][c] && grid[r][c] === grid[r + 2][c]) {
            return true;
          }
        }
      }
  
      return false;
    };
  
    // Generate new grids until one without matches is created
    do {
      newGrid = Array.from({ length: 8 }, () =>
        Array.from({ length: 8 }, () => symbols[Math.floor(Math.random() * symbols.length)])
      );
    } while (hasMatches(newGrid));
  
    setGrid(newGrid);
  };
  

  useEffect(() => {
    initializeGrid();
  }, []);

  useEffect(() => {
    if (gameMode === 'time' && time > 0) {
      const timer = setInterval(() => setTime((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    }
    if (time === 0 || moves === 0) endGame();
  }, [time, moves]);

  const endGame = () => {
    alert(`Game Over! Your Score: ${score}`);
    initializeGrid();
    setScore(0);
    setMoves(10);
    setTime(60);
    setHintUsed(false); // Reset hint usage
    setBusterUsed(false); // Reset buster usage
  };

  const useHint = () => {
    if (!hintUsed) {
      let foundHint = false;
      for (let r = 0; r < grid.length; r++) {
        for (let c = 0; c < grid[r].length; c++) {
          // Try swapping adjacent elements and checking for matches
          if (!foundHint && c + 1 < grid[r].length && grid[r][c] === grid[r][c + 1]) {
            alert(`Hint: Try swapping at (${r},${c})`);
            foundHint = true;
            break;
          }
        }
        if (foundHint) break;
      }
      setHintUsed(true);
    } else {
      alert('You have already used your hint!');
    }
  };
  

  const useBuster = () => {
    if (!busterUsed) {
      const newGrid = [...grid];
      const randomRow = Math.floor(Math.random() * 8);
  
      // Clear a random row
      for (let c = 0; c < newGrid[0].length; c++) {
        newGrid[randomRow][c] = ' ';
      }
  
      // Clear the same column
      for (let r = 0; r < newGrid.length; r++) {
        newGrid[r][randomRow] = ' ';
      }
  
      // Apply gravity and re-check for matches
      applyGravity(newGrid);
      processMatches(newGrid);
  
      // Mark buster as used
      setBusterUsed(true);
    } else {
      alert('You have already used your buster!');
    }
  };
  

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-5">Match Master Game</h1>
      <h2>Score: {score} | Moves: {moves} | Time: {time}</h2>
      <Grid grid={grid} setGrid={setGrid} setScore={setScore} setMoves={setMoves} gameMode={gameMode} symbols={symbols} />
      <button onClick={useHint} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">Use Hint</button>
      <button onClick={useBuster} className="mt-4 bg-red-500 text-white px-4 py-2 rounded">Use BUSTER</button>
    </div>
  );
}

export default App;
