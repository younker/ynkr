import { useContext } from 'react';
import { CELL_OWNERS, MOVE_COMPLETE } from '../constants';
import { GameDispatch } from '../index';
import './style.scss';

const onClickHandler = ({ cellIdx, active, owner, gameDispatch }) => {
  if (owner || !active) {
    return;
  }

  return (evt) => {
    gameDispatch({ action: MOVE_COMPLETE, cellIdx });
    evt.preventDefault();
  }
};

export default function Cell({ cellIdx, active, owner, strike }) {
  const gameDispatch = useContext(GameDispatch);

  return (
    <div
      className={'Cell ' + (strike ? 'strike' : '')}
      onClick={onClickHandler({ cellIdx, active, owner, gameDispatch })}
    >
      {CELL_OWNERS[owner]}
    </div>
  );
};
