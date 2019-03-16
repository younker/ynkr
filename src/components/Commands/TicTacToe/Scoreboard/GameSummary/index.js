import React from 'react';

import './style.scss';

const output = ({ gameOver, winner }) => {
  if (!gameOver) {
    return;
  }

  return winner ? `Player ${winner} wins!` : 'Draw!';
}

export default (props) => <div className="GameSummary">{output(props)}</div>;
