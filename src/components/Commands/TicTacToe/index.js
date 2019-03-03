import React, { useState } from 'react';

import './style.scss';

const PLAYERS = {
  '1': 'X',
  '0': '',
  '-1': 'O',
};

const BOARD = [0,0,1,0,0,-1,0,0,0];

const translateCell = (owner) => {
  const xo = PLAYERS[owner.toString()];
  return <div className="cell">{xo}</div>;
}

const TicTacToe = (props) => {
  const [state, setState] = useState({ board: BOARD });

  const cells = state.board.map(translateCell);

  return (
    <div className="TicTacToe">
      <div className="board">
        {cells}
      </div>
    </div>
  );
}

export default TicTacToe;
