import React, { useContext } from 'react';

import { CELL_OWNERS, MOVE_COMPLETE } from '../constants';
import { GameDispatch } from '../index';
import './style.scss';

const onClickHandler = ({ position, active, owner, turn, gameDispatch }) => {
  if (owner || !active) {
    return;
  }

  return (e) => {
    gameDispatch({ action: MOVE_COMPLETE, player: turn, position });
    e.preventDefault();
  }
};


const Cell = ({ position, active, owner, turn, strike }) => {
  const gameDispatch = useContext(GameDispatch);

  return (
    <div
      className={'Cell ' + (strike ? 'strike' : '')}
      position={position}
      onClick={onClickHandler({ position, active, owner, turn, gameDispatch })}
    >
      { CELL_OWNERS[owner] }
    </div>
  );
};

export default Cell;
