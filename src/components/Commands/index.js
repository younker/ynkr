import CommandNotFound from './CommandNotFound';
import Compgen from './Compgen';
import Man from './Man';
import TicTacToe from './TicTacToe';

export const publicCommands = {
  compgen: Compgen,
  man: Man,
  'tic-tac-toe': TicTacToe,
};

const cmds = {
  CommandNotFound,
  Compgen,
  Man,
  TicTacToe,
};

export default cmds;
