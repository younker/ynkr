import React, { useContext } from 'react';

import { COMMAND_COMPLETE, TerminalDispatch } from '../Terminal';
import { publicCommands } from '../Commands';

const Compgen = (props) => {
  const commands = Object
    .keys(publicCommands)
    .filter((cmd) => (cmd !== 'compgen'))
    .map((cmd) => (<li>{cmd}</li>));

  const terminalDispatch = useContext(TerminalDispatch);
  terminalDispatch({ action: COMMAND_COMPLETE });

  return <ul>{commands}</ul>;
}

export default Compgen;
