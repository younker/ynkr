import React, { useContext } from 'react';

import { BoardDispatch, OK, PLAYERS } from '../index';
import './style.scss';

const HUMAN_PLAYER = '1';

const onClickHandler = ({ active, position, boardDispatch }) => {
  if (!active) {
    return;
  }

  return (e) => {
    boardDispatch({ action: 'playerMove', position });
    e.preventDefault();
  }
}

const Cell = ({ gameCode, owner, position, turn, strike }) => {
  const boardDispatch = useContext(BoardDispatch);

  let classes = ['Cell'];
  if (strike) {
    classes.push('strike');
  }

  // This translates to:
  // - The cell currently has no owner
  // - The game is still ongoing
  // - It is the (human) player's turn
  const active = !owner && gameCode === OK && turn === HUMAN_PLAYER;

  return (
    <div
      className={classes.join(' ')}
      position={position}
      onClick={onClickHandler({ active, position, boardDispatch })}
    >
      { PLAYERS[owner.toString()] }
    </div>
  );
};

export default Cell;
