import React from 'react';

import './style.scss';

export default ({ turn, player }) => {
  const active = turn === player ? 'active' : '';

  return (
    <div className={'PlayerTurn ' + active}>Player {player}</div>
  );
};
