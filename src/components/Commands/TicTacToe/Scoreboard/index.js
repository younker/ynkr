import React, { useState, useEffect } from 'react';

import GameSummary from './GameSummary'
import PlayerTurn from './PlayerTurn';
import Timer from '../../../Timer';
import { PLAYER_ONE, PLAYER_TWO, NEW_GAME, GAME_OVER, GAME_ON } from '../constants';
import './style.scss';

const DEFAULT_STATE = {
  draws: 0,
  playerOne: 0,
  playerTwo: 0,
};

const timerArgs = (gameState, turn, player) => {
  let action;
  if (gameState === NEW_GAME) {
    action = 'reset';
  } else if (gameState === GAME_ON) {
    action = turn.id() === player ? 'run' : 'pause';
  } else {
    action = 'pause';
  }
  return { action };
};

export default function Scoreboard({ turn, gameState, winner }) {
  const [state, setState] = useState(DEFAULT_STATE);
  const gameOver = gameState === GAME_OVER;

  useEffect(() => {
    if (gameOver) {
      setState((s) => {
        const scores = { ...s };
        if (winner === PLAYER_ONE) {
          scores.playerOne += 1;
        } else if (winner === PLAYER_TWO) {
          scores.playerTwo += 1;
        } else {
          scores.draws += 1;
        }
        return scores;
      })
    }
  }, [gameOver, winner]);

  return (
    <div className='Scoreboard'>
      <div className='box'>
        <PlayerTurn turn={turn} player={PLAYER_ONE} />
        <div className={'quiet gameState ' + gameState} />
        <PlayerTurn turn={turn} player={PLAYER_TWO} />

        <div className='score'>{state.playerOne}</div>
        <div className='score'>{state.draws}</div>
        <div className='score'>{state.playerTwo}</div>

        <Timer {...timerArgs(gameState, turn, PLAYER_ONE)} />
        <div className='quiet'>timer</div>
        <Timer {...timerArgs(gameState, turn, PLAYER_TWO)} />
      </div>

      <GameSummary gameOver={gameOver} winner={winner} />
    </div>
  );
};
