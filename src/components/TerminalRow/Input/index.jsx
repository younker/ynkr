import * as R from 'ramda';
import React, { useContext, useState, useRef } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { TerminalDispatch } from '../../Terminal';

import './style.scss';

const DEFAULT_STATE = {
  prompt: '[user@ynkr.org] $',
  readonly: false,
  value: ''
};

const onKeyUpHandler = (state, setState, dispatch, inputRef) => {
  if (state.readonly) {
    return undefined;
  }

  return (e) => {
    console.log('------ e.keyCode:', e.keyCode);

    switch (e.keyCode) {
      case 78: // n
        if ( e.ctrlKey ) {
          dispatch({ action: 'scroll', direction: 'down', input: inputRef });
        }
        break;

      case 80: // p
        if ( e.ctrlKey ) {
          dispatch({ action: 'scroll', direction: 'up', input: inputRef });
        }
        break;

      case 13: // enter
        const [command, ...args] = R.map(R.trim, e.target.value.split(' '));
        dispatch({ action: 'newCommand', command, args });
        setState({ ...state, readonly: true });
        break;

      default:
        // noop but eslint requires a default case
    }

    e.preventDefault();
  }
};

const Input = () => {
  const [state, setState] = useState(DEFAULT_STATE);
  const dispatch = useContext(TerminalDispatch);
  const inputRef = useRef();

  return (
    <Row className='TerminalRow Input'>
      <Col md='auto' className='prompt'>
        {state.prompt}
      </Col>
      <Col className='input'>
        <input
          ref={inputRef}
          type='text'
          autoFocus={!state.readonly}
          onKeyUp={onKeyUpHandler(state, setState, dispatch, inputRef)}
          readOnly={state.readonly}
          value={state.text}
        />
      </Col>
    </Row>
  );
}

export default Input;
