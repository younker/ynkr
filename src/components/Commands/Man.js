import * as R from 'ramda';
import React, { useContext } from 'react';

import { TerminalDispatch } from '../Terminal';

const MISSING_MANFILE = (args) => {
  if (args.length > 0) {
    return `No manual entry for ${args.join(' ')}`;
  }

  return 'What manual page do you want?';
}

const LINKEDIN_URL = 'https://www.linkedin.com/in/younker/';
const manfiles = {
  ynkr: `Sorry, not much here. For what little I have, see ${LINKEDIN_URL}`
};

const Man = ({ command, args }) => {
  const manfile = args[0];
  const payload = R.propOr(MISSING_MANFILE(args), manfile, manfiles);

  const terminalDispatch = useContext(TerminalDispatch);
  terminalDispatch({ action: 'commandComplete' });

  return <div>{payload}</div>;
}

export default Man;
