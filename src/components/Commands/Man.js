import * as R from 'ramda';
import React, { useContext } from 'react';

import { TerminalDispatch } from '../Terminal';

const MISSING_MANFILE = (args) => {
  if (args.length > 0) {
    return `No manual entry for ${args.join(' ')}`;
  }

  return 'What manual page do you want?';
}

const manfiles = {
  ynkr: 'Oh yeah, but I have a sensitive side as well.',
};

const Man = ({ command, args }) => {
  const manfile = args[0];
  const payload = R.propOr(MISSING_MANFILE(args), manfile, manfiles);

  const terminalDispatch = useContext(TerminalDispatch);
  terminalDispatch({ action: 'commandComplete' });

  return <div>{payload}</div>;
}

export default Man;
