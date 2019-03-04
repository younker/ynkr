import React, { useContext } from 'react';

import { TerminalDispatch } from '../Terminal';

const CommandNotFound = (props) => {
  const terminalDispatch = useContext(TerminalDispatch);
  terminalDispatch({ action: 'commandComplete' });

  return <div>ynkr: command not found: {props.command}</div>;
}

export default CommandNotFound;
