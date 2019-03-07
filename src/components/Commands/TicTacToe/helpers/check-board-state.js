import { GAME_OVER, GAME_ON } from '../constants';

const WINNING_COMBOS = [
  [0, 1, 2], // top row, straight across
  [0, 3, 6], // left col, straight down
  [0, 4, 8], // upper-left, lower-right diagonal
  [1, 4, 7], // middle col, straight down
  [2, 5, 8], // right col, straight down
  [2, 4, 6], // upper-right, lower-left diagonal
  [3, 4, 5], // middle row, straight across
  [6, 7, 8], // bottom row, straight across
];

export default (board) => {
  for (let [a,b,c] of WINNING_COMBOS) {
    const owners = [board[a], board[b], board[c]].join('');
    if (owners === '111' || owners === '222') {
      return { status: GAME_OVER, winner: board[a], combo: [a,b,c] };
    }
  }

  const openCells = board.some(i => i === 0);
  const status = openCells ? GAME_ON : GAME_OVER;
  return { status };
}
