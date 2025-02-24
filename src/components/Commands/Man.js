import { propOr } from 'rambda';

import React, { useContext } from 'react';

import { COMMAND_COMPLETE, TerminalDispatch } from '../Terminal';

const MISSING_MANFILE = (manfile) => {
  if (manfile) {
    return `No manual entry for ${manfile}`;
  }

  return 'What manual page do you want?';
}

const LINKEDIN_URL = 'https://www.linkedin.com/in/younker/';
const manfiles = {
  ynkr: `Sorry, not much here. For what little I have, see ${LINKEDIN_URL}`
};

const Man = ({ command, args }) => {
  const manfile = args['subCommand'];
  const payload = propOr(MISSING_MANFILE(manfile), manfile, manfiles);

  const terminalDispatch = useContext(TerminalDispatch);
  terminalDispatch({ action: COMMAND_COMPLETE });

  return <div>{payload}</div>;
}

export default Man;
