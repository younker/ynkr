import React from 'react';

import Cell from '../Cell';
import { NEW_GAME, GAME_ON } from '../constants';
import './style.scss';

export default function Board({ cells, gameState, winningCombo }) {
  const createCell = (cellOwner, i) => (
    <Cell
      key={i}
      cellIdx={i}
      active={gameState === GAME_ON || gameState === NEW_GAME}
      owner={cellOwner}
      strike={winningCombo.includes(i)}
    />
  );

  return (
    <div className="Board">
      {cells.map(createCell)}
    </div>
  );
}
