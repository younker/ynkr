import React from 'react';

import Cell from '../Cell';
import './style.scss';

const Board = ({ cells, turn, winningCombo }) => {
  const createCell = (owner, i) => (
    <Cell
      key={i}
      owner={owner}
      turn={turn}
      position={i}
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
