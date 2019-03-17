import * as R from 'ramda';
import React, { useContext, useState, useRef } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { NEW_COMMAND_RECEIVED, SCROLL, TerminalDispatch } from '../../Terminal';

import './style.scss';

const DEFAULT_STATE = {
  prompt: '[user@ynkr.org] $',
  readonly: false,
};

const onKeyUpHandler = (state, setState, dispatch, inputRef) => {
  if (state.readonly) {
    return undefined;
  }

  return (e) => {
    switch (e.keyCode) {
      case 13: // enter
        const [command, ...args] = R.map(R.trim, e.target.value.split(' '));
        dispatch({ action: NEW_COMMAND_RECEIVED, command, args });
        setState({ ...state, readonly: true });
        break;

      case 38: // up arrow
        dispatch({ action: SCROLL, direction: 'up', input: inputRef });
        break;

      case 40: // up arrow
        dispatch({ action: SCROLL, direction: 'down', input: inputRef });
        break;

      case 78: // n
        if ( e.ctrlKey ) {
          dispatch({ action: SCROLL, direction: 'down', input: inputRef });
        }
        break;

      case 80: // p
        if ( e.ctrlKey ) {
          dispatch({ action: SCROLL, direction: 'up', input: inputRef });
        }
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
          type='text'
          autocomplete='off'
          ref={inputRef}
          autoFocus={!state.readonly}
          onKeyUp={onKeyUpHandler(state, setState, dispatch, inputRef)}
          readOnly={state.readonly}
        />
      </Col>
    </Row>
  );
}

export default Input;
