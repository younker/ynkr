import React, { useContext } from 'react';

import { TerminalDispatch } from '../Terminal';
import { publicCommands } from '../Commands';

const Compgen = (props) => {
  const commands = Object
    .keys(publicCommands)
    .filter((cmd) => (cmd !== 'compgen'))
    .map((cmd) => (<li>{cmd}</li>));

  const terminalDispatch = useContext(TerminalDispatch);
  terminalDispatch({ action: 'addTerminalRow', type: 'input' });

  return <ul>{commands}</ul>;
}

export default Compgen;
