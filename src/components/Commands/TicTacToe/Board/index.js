import React from 'react';

import Cell from '../Cell';
import { NEW_GAME, GAME_ON } from '../constants';
import './style.scss';

const Board = ({ cells, gameState, turn, winningCombo }) => {
  const createCell = (owner, i) => (
    <Cell
      key={i}
      cellIdx={i}
      active={gameState === GAME_ON || gameState === NEW_GAME}
      owner={owner}
      turn={turn}
      strike={winningCombo.includes(i)}
    />
  );

  return (
    <div className="Board">
      { cells.map(createCell) }
    </div>
  );
}

export default Board;
