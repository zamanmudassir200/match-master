import React, { useState } from "react";

const Grid = ({ grid, handleSwap, gameOver }) => {
  const [selectedElement, setSelectedElement] = useState(null);
  const [selectedCoords, setSelectedCoords] = useState(null);

  const handleDragStart = (rowIndex, colIndex) => {
    if (!gameOver) {
      setSelectedElement(grid[rowIndex][colIndex]);
      setSelectedCoords({ row: rowIndex, col: colIndex });
    }
  };

  const handleDrop = (rowIndex, colIndex) => {
    if (!gameOver && selectedCoords) {
      const { row, col } = selectedCoords;
      const isAdjacent =
        (Math.abs(rowIndex - row) === 1 && colIndex === col) ||
        (Math.abs(colIndex - col) === 1 && rowIndex === row);

      if (isAdjacent) {
        handleSwap(row, col, rowIndex, colIndex);
      }

      // Reset selected element
      setSelectedElement(null);
      setSelectedCoords(null);
    }
  };

  return (
    <div className="grid grid-cols-8 bg-gray-800 p-4 rounded-lg gap-2">
      {grid.map((row, rowIndex) => (
        <div key={rowIndex} className="flex flex-col">
          {row.map((element, colIndex) => (
            <div
              key={colIndex}
              className={`w-16 h-16 text-4xl flex items-center justify-center bg-white border border-gray-300 rounded ${
                gameOver ? "cursor-not-allowed" : "cursor-pointer"
              }`}
              draggable={!gameOver}
              onDragStart={() => handleDragStart(rowIndex, colIndex)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(rowIndex, colIndex)}
            >
              {element}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Grid;
