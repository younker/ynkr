import * as R from 'ramda';
import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { publicCommands } from '../../Commands';

import CommandNotFound from '../../Commands/CommandNotFound';
import './style.scss';

const Output = React.memo(({ command, args }) => {
  const Command = R.propOr(CommandNotFound, command, publicCommands);

  return (
    <Row className='TerminalRow Output'>
      <Col>
        <Command command={command} args={args} />
      </Col>
    </Row>
  );
});

export default Output;
