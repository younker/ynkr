import React, { useContext } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { PLAYERS, BoardDispatch } from '../index';
import './style.scss';

const onKeyUpHandler = ({ boardDispatch, gameOver }) => {
  console.log('------ onkeyUpHandler:', gameOver);
  if (gameOver) {
    return undefined;
  }

  return (e) => {
    console.log('------ prompt e.keyCode:', e.keyCode);

    switch (e.keyCode) {
      case 82: // r[estart]
        e.currentTarget.value = ''
        boardDispatch({ action: 'restartGame' });
        break;

      case 81: // q[uit]
        boardDispatch({ action: 'quitGame' });
        break;

      default:
        // noop but eslint requires a default case
    }

    e.preventDefault();
  };
};

const Prompt = ({ gameOver, winner }) => {
  const boardDispatch = useContext(BoardDispatch);


  let output;
  if (gameOver) {
    if (!winner) {
      output = 'Draw! Play again? [y,n]';
    } else {
      output = `${PLAYERS[winner]} Wins! Play again? [y,n]`;
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
          autoFocus={!gameOver}
          onKeyUp={onKeyUpHandler({ gameOver, boardDispatch })}
          readOnly={gameOver}
        />
      </Col>
    </Row>
  );
}

export default Prompt;
