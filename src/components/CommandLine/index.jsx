import React from 'react';
import './style.scss';

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

const CommandLine = (props) => (
  <div className='CommandLine'>
    <Row>
      <Col md='auto' className='prompt'>{props.prompt}</Col>
      <Col className='input'>
        <input
          type='text'
          autoFocus={props.focus}
          onKeyUp={props.keypressHandler}
          value={props.cmd}
          readOnly={props.readonly}
        />
      </Col>
    </Row>
    <Row>
      <Col className='output'>{props.output}</Col>
    </Row>
  </div>
);

export default CommandLine;
