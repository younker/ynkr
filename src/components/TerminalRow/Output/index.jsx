import * as R from 'ramda';
import React from 'react';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import CommandNotFound from '../../Commands/CommandNotFound';
import Man from '../../Commands/Man';

import './style.scss';

const commands = {
  man: Man,
};

const Output = ({ command, args }) => {
  const Command = R.propOr(CommandNotFound, command, commands);

  return (
    <Row className='TerminalRow Output'>
      <Col>
        <Command command={command} args={args} />
      </Col>
    </Row>
  );
};

export default Output;
