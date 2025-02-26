import React from 'react';

import './style.scss';

export default function Turn({ turn, player }) {
  const active = turn.id() === player ? 'active' : '';

  return (
    <div className={'PlayerTurn ' + active}>Player {player}</div>
  );
};
