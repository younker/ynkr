import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import './style.scss';

const DEFAULT_PROMPT = '[user@ynkr.org] $';

const Input = ({ prompt = DEFAULT_PROMPT, keypressHandler, readonly }) => (
  <Row className='TerminalRow Input'>
    <Col md='auto' className='prompt'>{prompt}</Col>
    <Col className='input'>
      <input
        type='text'
        autoFocus={!readonly}
        onKeyUp={keypressHandler}
        readOnly={readonly}
      />
    </Col>
  </Row>
);

export default Input;
