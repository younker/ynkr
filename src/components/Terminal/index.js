import React, { useReducer } from 'react';
import Container from 'react-bootstrap/Container';

import { Input, Output } from '../TerminalRow';
import { processCommand, scrollToPosition } from './helpers';
import './style.scss';

export const TerminalDispatch = React.createContext(null);

const renderInput = ({ idx }) => (<Input key={`input-${idx}`} />);

const renderOutput = ({ idx, command, args }) => {
  return (
    <Output
      key={`output-${idx}`}
      command={command}
      args={args}
    />
  );
};

const reducer = (state, { action, ...details }) => {
  switch (action) {
    case 'newCommand':
      return processCommand(state, details);

    case 'scroll':
      return scrollToPosition(state, details);

    default:
      return state;
  }
};

const DEFAULT_STATE = {
  cursor: undefined,
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
        { termIO }
      </Container>
    </TerminalDispatch.Provider>
  );
}
