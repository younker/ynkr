import React, { useContext, useReducer } from 'react';

import Board from './Board';
import Prompt from './Prompt';
import Scoreboard from './Scoreboard';
import { NEW_GAME, GAME_ERROR, GAME_ON, MOVE_COMPLETE, PLAYER_ONE, PLAYER_TWO, QUIT_GAME } from './constants';
import { COMMAND_COMPLETE, TerminalDispatch } from '../../Terminal';
import { checkBoardState, performBotMove } from './helpers';
import './style.scss';

export const GameDispatch = React.createContext(null);

const DEFAULT_STATE = {
  status: NEW_GAME,
  turn: PLAYER_ONE,
  winner: undefined,
  combo: [],
  board: [0,0,0,0,0,0,0,0,0],
};

const reducer = (state, { action, ...args }) => {
  switch(action) {
    case MOVE_COMPLETE:
      let { player, position } = args;
      let board = [ ...state.board ];
      board[position] = player;
      let outcome = checkBoardState(board);
      let turn;
      if (outcome.status === GAME_ON) {
        turn = player === PLAYER_ONE ? PLAYER_TWO : PLAYER_ONE;
      }

      return { ...state, ...outcome, board, turn };

    // case 'botMove':
    //   // board = args.board;
    //   // outcome = checkBoardState(board);
    //   // return { ...state, ...outcome, board, turn: PLAYER_ONE };

    case 'error':
      return { ...state, status: GAME_ERROR, error: args.message };

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
    terminalDispatch({ action: COMMAND_COMPLETE });

  } else if (state.status === GAME_ERROR) {
    prompt = <Prompt error={state.error} />
    terminalDispatch({ action: COMMAND_COMPLETE });

  } else {
    prompt = <Prompt gameCode={state.status} winner={state.winner} />;
    // if (state.status === GAME_ON && state.turn === PLAYER_TWO) {
    //   performBotMove(state.board, dispatch);
    // }
  }

  return (
    <GameDispatch.Provider value={dispatch}>
      <div className="TicTacToe">
        <Board
          cells={state.board}
          gameState={state.status}
          turn={state.turn}
          winningCombo={state.combo}
        />

        <Scoreboard
          turn={state.turn}
          gameState={state.status}
          winner={state.winner}
        />

        {prompt}
      </div>
    </GameDispatch.Provider>
  );
}

export default TicTacToe;
