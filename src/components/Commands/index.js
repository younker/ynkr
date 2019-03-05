import CommandNotFound from './CommandNotFound';
import Compgen from './Compgen';
import Man from './Man';
import TicTacToe from './TicTacToe';

export const publicCommands = {
  compgen: Compgen,
  man: Man,
  'tic-tac-toe': TicTacToe,
};

export default {
  CommandNotFound,
  Compgen,
  Man,
  TicTacToe,
};
