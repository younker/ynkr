import React, { useContext } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { GAME_OVER, QUIT_GAME, RESTART_GAME } from '../constants';
import { GameDispatch } from '../index';
import './style.scss';

const onKeyUpHandler = ({ gameDispatch, gameOver }) => {
  return (e) => {
    switch (e.keyCode) {
      case 82: // r[estart]
        e.currentTarget.value = ''
        gameDispatch({ action: RESTART_GAME });
        break;

      case 81: // q[uit]
        gameDispatch({ action: QUIT_GAME });
        break;

      case 89: // y[es] (play again?)
        if (gameOver) {
          e.currentTarget.value = ''
          gameDispatch({ action: RESTART_GAME });
        }
        break;

      case 78: // n[o] (play again?)
        if (gameOver) {
          gameDispatch({ action: QUIT_GAME });
        }
        break;

      default:
      // noop but eslint requires a default case
    }

    e.preventDefault();
  };
};

const Prompt = ({ error, gameCode }) => {
  const gameDispatch = useContext(GameDispatch);

  const gameOver = gameCode === GAME_OVER;

  let output;
  if (error) {
    output = error;
  } else if (gameOver) {
    output = 'Play again? [y,n] ';
  } else {
    output = 'Options: [r,q] ';
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
