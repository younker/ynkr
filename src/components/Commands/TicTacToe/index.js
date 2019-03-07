import React, { useContext, useReducer } from 'react';

import Board from './Board';
import Prompt from './Prompt';
import { GAME_ON, GAME_ERROR, QUIT_GAME, PLAYER_ONE, PLAYER_TWO } from './constants';
import { TerminalDispatch } from '../../Terminal';
import { checkBoardState, performBotMove } from './helpers';
import './style.scss';

export const GameDispatch = React.createContext(null);

const DEFAULT_STATE = {
  status: GAME_ON,
  turn: PLAYER_ONE,
  winner: undefined,
  combo: [],
  board: [0,0,0,0,0,0,0,0,0],
};

const reducer = (state, { action, ...args }) => {
  console.log('------ TTT state, action, args:', state, action, args);
  switch(action) {
    case 'playerMove':
      let board = [ ...state.board ];
      board[args.position] = 1;
      let outcome = checkBoardState(board);
      return { ...state, ...outcome, board, turn: PLAYER_TWO };

    case 'botMove':
      board = args.board;
      outcome = checkBoardState(board);
      return { ...state, ...outcome, board, turn: PLAYER_ONE };

    case 'error':
      return { ...state, status: GAME_ERROR, message: args.message };

    case 'restartGame':
      return DEFAULT_STATE;

    case 'quitGame':
      return { ...state, status: QUIT_GAME };

    default:
      return state;
  }
};

const TicTacToe = (props) => {
  const [state, dispatch] = useReducer(reducer, DEFAULT_STATE);
  const terminalDispatch = useContext(TerminalDispatch);

  let prompt;
  if (state.status === QUIT_GAME) {
    terminalDispatch({ action: 'commandComplete' });

  } else if (state.status === GAME_ERROR) {
    prompt = <Prompt message={state.message} />
    terminalDispatch({ action: 'commandComplete' });

  } else {
    if (state.status === GAME_ON && state.turn === PLAYER_TWO) {
      performBotMove(state.board, dispatch);
    }

    prompt = <Prompt gameCode={state.status} winner={state.winner} />;
  }

  return (
    <GameDispatch.Provider value={dispatch}>
      <div className="TicTacToe">
        <Board
          cells={state.board}
          turn={state.turn}
          winningCombo={state.combo}
        />
        {prompt}
      </div>
    </GameDispatch.Provider>
  );
}

export default TicTacToe;
