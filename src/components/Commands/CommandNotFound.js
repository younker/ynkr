import React, { useContext } from 'react';

import { COMMAND_COMPLETE, TerminalDispatch } from '../Terminal';

const CommandNotFound = (props) => {
  const terminalDispatch = useContext(TerminalDispatch);
  terminalDispatch({ action: COMMAND_COMPLETE });

  return <div>ynkr: command not found: {props.command}</div>;
}

export default CommandNotFound;
