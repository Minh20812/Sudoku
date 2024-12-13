const generateSudokuPuzzle = () => {
  const puzzle = Array(9)
    .fill(null)
    .map(() => Array(9).fill(0));

  const isValid = (board, row, col, num) => {
    for (let i = 0; i < 9; i++) {
      if (board[row][i] === num || board[i][col] === num) return false;
    }
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[startRow + i][startCol + j] === num) return false;
      }
    }
    return true;
  };

  const fillSudoku = (board) => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === 0) {
          const numbers = Array.from({ length: 9 }, (_, i) => i + 1).sort(
            () => Math.random() - 0.5
          );
          for (const num of numbers) {
            if (isValid(board, row, col, num)) {
              board[row][col] = num;
              if (fillSudoku(board)) return true;
              board[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  };

  fillSudoku(puzzle);

  const solution = puzzle.map((row) => [...row]); // Lưu lại lời giải
  for (let i = 0; i < 40; i++) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);
    puzzle[row][col] = 0;
  }

  return { puzzle, solution };
};

export default generateSudokuPuzzle;
