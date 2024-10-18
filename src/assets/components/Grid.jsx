import React, { useEffect, useState } from 'react';

const Grid = ({ grid, setGrid, setScore, setMoves, gameMode, symbols }) => {
  const [selectedElement, setSelectedElement] = useState(null);
  const [hoveredElement, setHoveredElement] = useState(null);
  const [removingElements, setRemovingElements] = useState([]);

  const checkMatches = (newGrid) => {
    let scoreIncrease = 0;
    const toRemove = new Set();

    // Check for horizontal matches
    for (let r = 0; r < newGrid.length; r++) {
      for (let c = 0; c < newGrid[r].length - 2; c++) {
        if (
          newGrid[r][c] !== ' ' &&
          newGrid[r][c] === newGrid[r][c + 1] &&
          newGrid[r][c] === newGrid[r][c + 2]
        ) {
          scoreIncrease++;
          toRemove.add(`${r},${c}`);
          toRemove.add(`${r},${c + 1}`);
          toRemove.add(`${r},${c + 2}`);
        }
      }
    }

    // Check for vertical matches
    for (let c = 0; c < newGrid[0].length; c++) {
      for (let r = 0; r < newGrid.length - 2; r++) {
        if (
          newGrid[r][c] !== ' ' &&
          newGrid[r][c] === newGrid[r + 1][c] &&
          newGrid[r][c] === newGrid[r + 2][c]
        ) {
          scoreIncrease++;
          toRemove.add(`${r},${c}`);
          toRemove.add(`${r + 1},${c}`);
          toRemove.add(`${r + 2},${c}`);
        }
      }
    }

    // Set elements to remove
    setRemovingElements(Array.from(toRemove));

    // Clear matched symbols
    toRemove.forEach((pos) => {
      const [r, c] = pos.split(',').map(Number);
      newGrid[r][c] = ' ';
    });

    return { newGrid, scoreIncrease };
  };

  // const applyGravity = (newGrid) => {
  //   for (let c = 0; c < newGrid[0].length; c++) {
  //     let emptySpaces = 0;
  //     for (let r = newGrid.length - 1; r >= 0; r--) {
  //       if (newGrid[r][c] === ' ') {
  //         emptySpaces++;
  //       } else if (emptySpaces > 0) {
  //         newGrid[r + emptySpaces][c] = newGrid[r][c];
  //         newGrid[r][c] = ' ';
  //       }
  //     }
  //     // Add new random elements to the top
  //     for (let r = 0; r < emptySpaces; r++) {
  //       newGrid[r][c] = Math.random() < 0.3 ? 'X' : symbols[Math.floor(Math.random() * symbols.length)];
  //     }
  //   }
  // };

  // const processMatches = (newGrid) => {
  //   let { newGrid: updatedGrid, scoreIncrease } = checkMatches(newGrid);

  //   if (scoreIncrease > 0) {
  //     setScore((prevScore) => prevScore + scoreIncrease);
  //     applyGravity(updatedGrid);
  //     setGrid([...updatedGrid]);
  //     // Recursively process matches until no more matches are found
  //     processMatches(updatedGrid);
  //   }
  // };
  const applyGravity = (newGrid) => {
    for (let c = 0; c < newGrid[0].length; c++) {
      let emptySpaces = 0;
      for (let r = newGrid.length - 1; r >= 0; r--) {
        if (newGrid[r][c] === ' ') {
          emptySpaces++;
        } else if (emptySpaces > 0) {
          newGrid[r + emptySpaces][c] = newGrid[r][c];
          newGrid[r][c] = ' ';
        }
      }
      // Add new random elements to the top
      for (let r = 0; r < emptySpaces; r++) {
        newGrid[r][c] = Math.random() < 0.3 ? 'X' : symbols[Math.floor(Math.random() * symbols.length)];
      }
    }
    // Make sure to update the grid state after gravity is applied
    setGrid([...newGrid]);
  };
  
  const processMatches = (newGrid) => {
    const { newGrid: updatedGrid, scoreIncrease } = checkMatches(newGrid);
    if (scoreIncrease > 0) {
      setScore((prevScore) => prevScore + scoreIncrease);
      applyGravity(updatedGrid);
      setTimeout(() => processMatches([...updatedGrid]), 300); // Allow for the re-render before checking again
    }
  };
  

  // const handleElementDrop = (row, col) => {
  //   if (selectedElement) {
  //     const newGrid = [...grid];
  //     const [selectedRow, selectedCol] = selectedElement;

  //     // Check if the dropped element is adjacent
  //     const isAdjacent =
  //       (Math.abs(selectedRow - row) === 1 && selectedCol === col) ||
  //       (Math.abs(selectedCol - col) === 1 && selectedRow === row);

  //     if (isAdjacent) {
  //       // Swap elements
  //       const temp = newGrid[row][col];
  //       newGrid[row][col] = newGrid[selectedRow][selectedCol];
  //       newGrid[selectedRow][selectedCol] = temp;

  //       // Reset selected and hovered elements
  //       setSelectedElement(null);
  //       setHoveredElement(null);

  //       // Process matches recursively
  //       processMatches(newGrid);

  //       if (gameMode === 'moves') {
  //         setMoves((prev) => prev - 1);
  //       }
  //     }
  //   }
  // };

  const handleElementDrop = (row, col) => {
    if (selectedElement) {
      const newGrid = [...grid];
      const [selectedRow, selectedCol] = selectedElement;
  
      // Check if the dropped element is adjacent
      const isAdjacent =
        (Math.abs(selectedRow - row) === 1 && selectedCol === col) ||
        (Math.abs(selectedCol - col) === 1 && selectedRow === row);
  
      if (isAdjacent) {
        // Make a copy of the current grid state
        const originalGrid = JSON.parse(JSON.stringify(newGrid));
  
        // Swap elements
        const temp = newGrid[row][col];
        newGrid[row][col] = newGrid[selectedRow][selectedCol];
        newGrid[selectedRow][selectedCol] = temp;
  
        // Check for matches
        const { scoreIncrease } = checkMatches(newGrid);
  
        if (scoreIncrease > 0) {
          // If matches are found, process them
          setSelectedElement(null);
          setHoveredElement(null);
          processMatches(newGrid);
  
          if (gameMode === 'moves') {
            setMoves((prev) => prev - 1);
          }
        } else {
          // If no matches are found, revert to the original grid
          setGrid(originalGrid);
        }
      }
    }
  };
  
  return (
    <div className="flex flex-col justify-center items-center my-7">
      {grid.map((row, rowIndex) => (
        <div key={rowIndex} className="flex ">
          {row.map((symbol, colIndex) => (
            <div
              key={colIndex}
              className={`w-16 rounded-xl bg-black text-white text-4xl select-none h-16 font-bold text-3xl p-6 gap-3 border-4 flex items-center justify-center text-sm 
                ${removingElements.includes(`${rowIndex},${colIndex}`) ? 'animate-fadeOut' : ''}
                ${hoveredElement && hoveredElement[0] === rowIndex && hoveredElement[1] === colIndex ? 'bg-blue-500' : ''}
                ${(rowIndex + colIndex) % 2 === 0 ? 'bg-black' : 'bg-gray-800 text-white'}`}
              draggable
              onDragStart={() => setSelectedElement([rowIndex, colIndex])}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleElementDrop(rowIndex, colIndex)}
              onMouseEnter={() => setHoveredElement([rowIndex, colIndex])}
              onMouseLeave={() => setHoveredElement(null)}
            >
              {symbol}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Grid;
