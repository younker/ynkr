import React, { useContext } from 'react';

import { CELL_OWNERS, PLAYER_ONE, MOVE_COMPLETE } from '../constants';
import { GameDispatch } from '../index';
import './style.scss';

const onClickHandler = ({ owner, turn, position, gameDispatch }) => {
  // for now, player one is the only one that can make a move
  if (owner || turn !== PLAYER_ONE) {
    return;
  }

  return (e) => {
    gameDispatch({ action: MOVE_COMPLETE, player: turn, position });
    e.preventDefault();
  }
};


const Cell = ({ owner, turn, position, strike }) => {
  const gameDispatch = useContext(GameDispatch);

  return (
    <div
      className={'Cell ' + (strike ? 'strike' : '')}
      position={position}
      onClick={onClickHandler({ owner, turn, position, gameDispatch })}
    >
      { CELL_OWNERS[owner] }
    </div>
  );
};

export default Cell;
