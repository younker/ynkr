import React, { useState, useEffect } from 'react';

import Timer from '../../../Timer';
import { PLAYER_ONE, PLAYER_TWO, GAME_OVER } from '../constants';

const DEFAULT_STATE = {
  draws: 0,
  playerOne: 0,
  playerTwo: 0,
};

const Scoreboard = ({ turn, gameState, winner }) => {
  const [state, setState] = useState(DEFAULT_STATE);
  const gameOver = gameState === GAME_OVER;

  useEffect(() => {
    if (gameOver) {
      const scores = { ...state };
      if (winner === PLAYER_ONE) {
        scores.playerOne += 1;
      } else if (winner === PLAYER_TWO) {
        scores.playerTwo += 1;
      } else {
        scores.draws += 1;
      }
      setState(scores);
    }
  }, [gameState]);

  let prompt = `Turn: Player ${turn}`;
  if (gameOver) {
    prompt = 'Game Over';
  } else if (gameState === 'newGame') {
    prompt = 'The game will being once Player 1 moves.';
  }

  const timerArgs = (gameState, turn, player) => {
    let action;
    if (gameState === 'newGame') {
      action = 'reset';
    } else {
      action = turn === player ? 'run' : 'pause';
    }

    console.log('------ turn, player:', turn, player, action);

    return { action };
  };

  return (
    <div className="Scoreboard">
      {prompt}<br />

      <b>Game</b><br />
      Player 1's Timer: <Timer {...timerArgs(gameState, turn, PLAYER_ONE)} /><br />
      Player 2's Timer: <Timer {...timerArgs(gameState, turn, PLAYER_TWO)} /><br />

      <b>Series</b><br />
      Draws: {state.draws}<br />
      Player One: {state.playerOne}<br />
      Player Two: {state.playerTwo}<br />
    </div>
  );
};

export default Scoreboard;

