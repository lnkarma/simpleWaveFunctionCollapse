const chars = {
  " ": [0, 0, 0, 0],
  "├": [1, 1, 1, 0],
  "┬": [0, 1, 1, 1],
  "┤": [1, 0, 1, 1],
  "┴": [1, 1, 0, 1],
};
const dirs = [
  [-1, 0],
  [0, 1],
  [1, 0],
  [0, -1],
];

const possibleChars = [...Object.keys(chars)];

const dim = {
  rows: process.argv[2] || 10,
  columns: process.argv[3] || 10,
};

const interval = process.argv[4] || 25;

const grid = Array.from({ length: dim.rows }, () =>
  Array.from({ length: dim.columns }, () => ({
    isCollapsed: false,
    possibleChars: [...possibleChars],
  }))
);

let minEntropyArray = [];
const selectRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

const print = (grid) => {
  grid.forEach((row) => {
    const s = [];
    row.forEach((cell) =>
      s.push(cell.isCollapsed ? cell.possibleChars[0] : " ")
    );
    console.log(s.join(""));
  });
};

const timer = setInterval(() => {
  print(grid);
  minEntropyArray = listMinEntropyArray();
  if (minEntropyArray.length === 0) {
    clearInterval(timer);
    return;
  }

  process.stdout.write("\u001b[" + dim.rows + "A\u001b[1G");

  randomMinEntropyCellIndex = selectRandom(minEntropyArray);
  minEntropyCell =
    grid[randomMinEntropyCellIndex[0]][randomMinEntropyCellIndex[1]];
  minEntropyCell.isCollapsed = true;
  minEntropyCell.possibleChars = [selectRandom(minEntropyCell.possibleChars)];
  updateAdjacentCellMinEntropy(randomMinEntropyCellIndex);
}, interval);

function listMinEntropyArray() {
  let minEntropy = possibleChars.length;
  let minEntropyArray = [];
  grid.forEach((row, rowIndex) => {
    row.forEach((cell, cellIndex) => {
      if (cell.isCollapsed) return;
      if (minEntropy < cell.possibleChars.length) return;
      if (cell.possibleChars.length < minEntropy) {
        minEntropy = cell.possibleChars.length;
        minEntropyArray = [];
      }
      minEntropyArray.push([rowIndex, cellIndex]);
    });
  });
  return minEntropyArray;
}

function updateAdjacentCellMinEntropy([rowIndex, cellIndex]) {
  const cell = grid[rowIndex][cellIndex];
  dirs.forEach((dir, dirIndex) => {
    r = rowIndex + dir[0];
    c = cellIndex + dir[1];
    if (r < 0 || r >= dim.rows || c < 0 || c >= dim.columns) return;
    adjCell = grid[r][c];
    if (adjCell.isCollapsed) return;
    selectedChar = cell.possibleChars[0];

    valueAtDir = chars[selectedChar][dirIndex];
    adjCell.possibleChars = adjCell.possibleChars.filter(
      (c) => chars[c][(dirIndex + 2) % 4] === valueAtDir
    );
  });
}
