export const PLAYER_ONE = 1;
export const PLAYER_ONE_LABEL = 'X';

export const PLAYER_TWO = 2;
export const PLAYER_TWO_LABEL = 'O';

export const BOT = 'bot';
export const HUMAN = 'human';

export const MOVE_COMPLETE = 'moveComplete';

export const CELL_OWNERS = {
  0: '',  // empty square - no owner
  1: PLAYER_ONE_LABEL,
  2: PLAYER_TWO_LABEL
};

export const NEW_GAME = 'newGame';
export const GAME_ON = 'gameOn';
export const GAME_OVER = 'gameOver';
export const GAME_ERROR = 'error';
export const QUIT_GAME = 'quitGame';
export const RESTART_GAME = 'restartGame';
