import React, { useContext, useReducer } from 'react';

import Cell from './Cell';
import Prompt from './Prompt';
import { TerminalDispatch } from '../../Terminal';
import { checkBoardState, performBotMove } from './helpers';
import './style.scss';

export const BoardDispatch = React.createContext(null);

export const PLAYERS = {
  '0': '',
  '1': 'X',
  '2': 'O',
};

// ERROR and QUIT_GAME are only knowable in this module as where OK and
// GAME_OVER are required in order to relay the state of the board
export const OK = 'ok';
export const GAME_OVER = 'gameOver';
const ERROR = 'error';
const QUIT_GAME = 'quitGame';

const DEFAULT_STATE = {
  code: OK,
  turn: '1',
  winner: undefined,
  combo: [],
  board: [0,0,0,0,0,0,0,0,0],
};

const reducer = (state, { action, ...args }) => {
  switch(action) {
    case 'playerMove':
      let board = [ ...state.board ];
      board[args.position] = 1;
      let outcome = checkBoardState(board);
      return { ...state, ...outcome, board, turn: '2' };

    case 'botMove':
      board = args.board;
      outcome = checkBoardState(board);
      return { ...state, ...outcome, board, turn: '1' };

    case 'error':
      return { ...state, code: ERROR, message: args.message };

    case 'restartGame':
      return DEFAULT_STATE;

    case 'quitGame':
      return { ...state, code: QUIT_GAME };

    default:
      return state;
  }
};

const TicTacToe = (props) => {
  const [state, dispatch] = useReducer(reducer, DEFAULT_STATE);
  const terminalDispatch = useContext(TerminalDispatch);

  const createCell = (owner, i) => (
    <Cell
      key={i}
      position={i}
      owner={owner}
      gameCode={state.code}
      turn={state.turn}
      strike={state.combo.includes(i)}
    />
  );

  let prompt;
  if (state.code === QUIT_GAME) {
    terminalDispatch({ action: 'commandComplete' });

  } else if (state.code === ERROR) {
    prompt = <Prompt message={state.message} />
    terminalDispatch({ action: 'commandComplete' });

  } else {
    if (state.code === OK && state.turn === '2') {
      performBotMove(state.board, dispatch);
    }

    prompt = <Prompt gameCode={state.code} winner={state.winner} />;
  }

  return (
    <BoardDispatch.Provider value={dispatch}>
      <div className="TicTacToe">
        <div className="board">
          { state.board.map(createCell) }
        </div>
        {prompt}
      </div>
    </BoardDispatch.Provider>
  );
}

export default TicTacToe;
