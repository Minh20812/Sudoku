import React, { useRef, useEffect, useState } from "react";
import generateSudokuPuzzle from "./generateSudokuPuzzle";

const App = () => {
  const canvasRef = useRef(null);
  const gridSize = 50;
  const gridLength = 9;
  const [gameData, setGameData] = useState(() => {
    const initialGameData = generateSudokuPuzzle();
    return {
      ...initialGameData,
      originalPuzzle: initialGameData.puzzle.map((row) => [...row]),
    };
  }); // Lưu cả puzzle và solution
  const [selectedCell, setSelectedCell] = useState(null);

  const { puzzle, solution, originalPuzzle } = gameData;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    drawGrid(ctx, selectedCell); // Truyền `selectedCell` để vẽ hiệu ứng
    drawNumbers(ctx, puzzle); // Vẽ lại số
  }, [puzzle, selectedCell]);

  const resetPuzzle = () => {
    setGameData({ ...gameData, puzzle: originalPuzzle.map((row) => [...row]) });
  };

  // Vẽ lại ô và hiệu ứng khi được chọn
  const drawHighlights = (ctx, selectedCell) => {
    if (!selectedCell) return;

    const { row, col } = selectedCell;

    ctx.fillStyle = "#e0f7fa"; // Màu nền của ô được chọn
    ctx.fillRect(col * gridSize, row * gridSize, gridSize, gridSize);

    // Tô màu hàng và cột
    ctx.fillStyle = "#f1f8e9";
    for (let c = 0; c < gridLength; c++) {
      if (c !== col) {
        ctx.fillRect(c * gridSize, row * gridSize, gridSize, gridSize);
      }
    }

    for (let r = 0; r < gridLength; r++) {
      if (r !== row) {
        ctx.fillRect(col * gridSize, r * gridSize, gridSize, gridSize);
      }
    }

    // Tô màu vùng 3x3
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    ctx.fillStyle = "#fffde7";
    for (let r = startRow; r < startRow + 3; r++) {
      for (let c = startCol; c < startCol + 3; c++) {
        if (r !== row || c !== col) {
          ctx.fillRect(c * gridSize, r * gridSize, gridSize, gridSize);
        }
      }
    }
  };

  const drawGrid = (ctx, selectedCell) => {
    const canvasSize = gridSize * gridLength;
    ctx.clearRect(0, 0, canvasSize, canvasSize);
    ctx.strokeStyle = "#000";

    // Vẽ hiệu ứng trước
    drawHighlights(ctx, selectedCell);

    // Vẽ các đường lưới
    for (let i = 0; i <= gridLength; i++) {
      ctx.lineWidth = i % 3 === 0 ? 2 : 1;
      ctx.beginPath();
      ctx.moveTo(i * gridSize, 0);
      ctx.lineTo(i * gridSize, canvasSize);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, i * gridSize);
      ctx.lineTo(canvasSize, i * gridSize);
      ctx.stroke();
    }
  };

  const drawNumbers = (ctx, puzzle) => {
    ctx.font = `${gridSize / 2}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    for (let row = 0; row < gridLength; row++) {
      for (let col = 0; col < gridLength; col++) {
        const num = puzzle[row][col];
        if (num !== 0) {
          const isGiven = solution[row][col] === num; // Kiểm tra số gốc
          ctx.fillStyle = isGiven
            ? "#000" // Màu đen cho số gốc
            : "#ff5722"; // Màu cam cho số người chơi nhập
          ctx.fillText(
            num,
            col * gridSize + gridSize / 2,
            row * gridSize + gridSize / 2
          );
        }
      }
    }
  };

  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const col = Math.floor(x / gridSize);
    const row = Math.floor(y / gridSize);

    setSelectedCell({ row, col });
  };

  const handleKeyDown = (e) => {
    if (!selectedCell) return;

    const { row, col } = selectedCell;

    // Ngăn người chơi thay đổi số gốc
    if (puzzle[row][col] !== 0 && puzzle[row][col] === solution[row][col]) {
      alert("Bạn không thể thay đổi số gốc!");
      return;
    }

    const num = parseInt(e.key);

    if (!isNaN(num) && num >= 1 && num <= 9) {
      const newPuzzle = puzzle.map((row) => row.slice());
      newPuzzle[row][col] = num;
      setGameData({ ...gameData, puzzle: newPuzzle });
    }
  };

  const checkResult = () => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (puzzle[row][col] !== solution[row][col]) {
          alert("Sai rồi! Thử lại nhé.");
          return;
        }
      }
    }
    alert("Chúc mừng! Bạn đã hoàn thành đúng.");
  };

  const showSolution = () => {
    setGameData({ ...gameData, puzzle: solution });
  };

  return (
    <div
      className="flex flex-col items-center gap-6 p-4 bg-gray-100 rounded-lg"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <h1 className="text-2xl font-bold text-gray-800">Sudoku</h1>
      <canvas
        ref={canvasRef}
        width={gridSize * gridLength}
        height={gridSize * gridLength}
        className="border-4 border-gray-300 rounded-md shadow-md"
        onClick={handleCanvasClick}
      ></canvas>
      <div className="flex gap-4">
        <button
          className="px-4 py-2 text-white bg-green-500 rounded-lg shadow hover:bg-green-600"
          onClick={checkResult}
        >
          Kiểm tra kết quả
        </button>
        <button
          className="px-4 py-2 text-white bg-blue-500 rounded-lg shadow hover:bg-blue-600"
          onClick={showSolution}
        >
          Xem kết quả đúng
        </button>
        <button
          className="px-4 py-2 text-white bg-red-500 rounded-lg shadow hover:bg-red-600"
          onClick={() => setGameData(generateSudokuPuzzle())}
        >
          Đổi Map
        </button>
        <button
          className="px-4 py-2 text-white bg-yellow-500 rounded-lg shadow hover:bg-yellow-600"
          onClick={resetPuzzle}
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default App;
