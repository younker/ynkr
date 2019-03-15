import React from 'react';

import Cell from '../Cell';
import { GAME_ON } from '../constants';
import './style.scss';

const Board = ({ cells, gameState, turn, winningCombo }) => {
  const createCell = (owner, i) => (
    <Cell
      key={i}
      position={i}
      active={gameState === GAME_ON || gameState === 'newGame'}
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
