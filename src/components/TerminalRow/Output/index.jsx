import * as R from 'ramda';
import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { publicCommands } from '../../Commands';

import CommandNotFound from '../../Commands/CommandNotFound';
import Welcome from '../../Commands/Welcome';
import './style.scss';

const getCommandComponent = (command, { context }) => {
  // Special Case: This is not a command that we want the user to run. As such,
  // we want to keep it out of the publicCommands
  if ( command === 'welcome' && context === 'startup' ) {
    return Welcome;
  }

  return R.propOr(CommandNotFound, command, publicCommands);
}

const Output = React.memo(({ command, args }) => {
  const Command = getCommandComponent(command, args)

  return (
    <Row className='TerminalRow Output'>
      <Col>
        <Command command={command} args={args} />
      </Col>
    </Row>
  );
});

export default Output;
