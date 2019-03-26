import React, { useContext } from 'react';

import { CELL_OWNERS, MOVE_COMPLETE } from '../constants';
import { GameDispatch } from '../index';
import './style.scss';

const onClickHandler = ({ cellIdx, active, owner, turn, gameDispatch }) => {
  if (owner || !active) {
    return;
  }

  return (e) => {
    gameDispatch({ action: MOVE_COMPLETE, player: turn, cellIdx });
    e.preventDefault();
  }
};

const Cell = ({ cellIdx, active, owner, turn, strike }) => {
  const gameDispatch = useContext(GameDispatch);

  return (
    <div
      className={'Cell ' + (strike ? 'strike' : '')}
      onClick={onClickHandler({ cellIdx, active, owner, turn, gameDispatch })}
    >
      { CELL_OWNERS[owner] }
    </div>
  );
};

export default Cell;
