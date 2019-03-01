import CommandNotFound from './CommandNotFound';
import Compgen from './Compgen';
import Man from './Man';

export const publicCommands = {
  compgen: Compgen,
  man: Man,
};

export default {
  CommandNotFound,
  Compgen,
  Man,
};
