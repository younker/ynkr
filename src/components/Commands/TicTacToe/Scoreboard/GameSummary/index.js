import React from 'react';

import './style.scss';

const output = ({ gameOver, winner }) => {
  if (!gameOver) {
    return;
  }

  return winner ? `Player ${winner} wins!` : 'Draw!';
}

const summary = (props) => <div className="GameSummary">{output(props)}</div>;

export default summary;
