import React, { useReducer } from 'react';
import Container from 'react-bootstrap/Container';

import Welcome from '../Welcome';
import { Input, Output } from '../TerminalRow';
import { addPrompt, processCommand, scrollToPosition } from './helpers';
import './style.scss';

export const COMMAND_COMPLETE = 'commandComplete';
export const NEW_COMMAND_RECEIVED = 'newCommandReceived';
export const SCROLL = 'scroll';

export const TerminalDispatch = React.createContext(null);

const renderInput = ({ idx }) => (
  <Input key={`input-${idx}`} />
);

const renderOutput = ({ idx, command, args }) => (
  <Output
    key={`output-${idx}`}
    command={command}
    args={args}
  />
);

const reducer = (state, { action, ...details }) => {
  switch (action) {
    case COMMAND_COMPLETE:
      return addPrompt(state);

    case NEW_COMMAND_RECEIVED:
      return processCommand(state, details);

    case SCROLL:
      return scrollToPosition(state, details);

    default:
      return state;
  }
};

const DEFAULT_STATE = {
  collection: [{ type: 'input' }],
};

export default (props) => {
  const [state, dispatch] = useReducer(reducer, DEFAULT_STATE);

  const termIO = state.collection.map(({ type, ...item }, idx) => {
    const args = { idx, ...item };
    return type === 'input' ? renderInput(args) : renderOutput(args);
  });

  return (
    <TerminalDispatch.Provider value={dispatch}>
      <Container className='Terminal' fluid='true'>
        <Welcome />
        { termIO }
      </Container>
    </TerminalDispatch.Provider>
  );
}
