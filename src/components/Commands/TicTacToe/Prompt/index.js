import React, { useContext } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { CELL_OWNERS } from '../constants';
import { GameDispatch } from '../index';
import './style.scss';

const onKeyUpHandler = ({ gameDispatch, gameOver }) => {
  return (e) => {
    switch (e.keyCode) {
      case 82: // r[estart]
        e.currentTarget.value = ''
        gameDispatch({ action: 'restartGame' });
        break;

      case 81: // q[uit]
        gameDispatch({ action: 'quitGame' });
        break;

      case 89: // y[es] (play again?)
        if (gameOver) {
          e.currentTarget.value = ''
          gameDispatch({ action: 'restartGame' });
        }
        break;

      case 78: // n[o] (play again?)
        if (gameOver) {
          gameDispatch({ action: 'quitGame' });
        }
        break;

      default:
        // noop but eslint requires a default case
    }

    e.preventDefault();
  };
};

const Prompt = ({ message, gameCode, winner }) => {
  const gameDispatch = useContext(GameDispatch);

  const gameOver = gameCode === 'gameOver';

  let output;
  if (message) {
    output = message;

  } else if (gameOver) {
    if (!winner) {
      output = 'Draw! Play again? [y,n]';
    } else {
      output = `${CELL_OWNERS[winner]} Wins! Play again? [y,n]`;
    }

  } else {
    output = `Options: [r,q]`;
  }

  return (
    <Row className='Prompt'>
      <Col md='auto' className='output'>
        {output}
      </Col>
      <Col className='input'>
        <input
          type='text'
          autoFocus={true}
          onKeyUp={onKeyUpHandler({ gameOver, gameDispatch })}
        />
      </Col>
    </Row>
  );
}

export default Prompt;
