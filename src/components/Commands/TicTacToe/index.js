import React, { useContext, useReducer } from 'react';

import Prompt from './Prompt';
import { TerminalDispatch } from '../../Terminal';
import { getRequester } from '../../../util/http/requester';
import './style.scss';

export const BoardDispatch = React.createContext(null);

export const PLAYERS = {
  '0': '',
  '1': 'X',
  '2': 'O',
};

const WINNING_COMBOS = [
  [0, 1, 2], // top row, straight across
  [0, 3, 6], // left col, straight down
  [0, 4, 8], // upper-left, lower-right diagonal
  [1, 4, 7], // middle col, straight down
  [2, 5, 8], // right col, straight down
  [2, 4, 6], // upper-right, lower-left diagonal
  [3, 4, 5], // middle row, straight across
  [6, 7, 8], // bottom row, straight across
];

const DEFAULT_STATE = {
  gameOver: false,
  winner: undefined,
  combo: [],
  board: [0,0,0,0,0,0,0,0,0],
};

const REQUEST_SPEC = {
  specId: 'getBotT3Move',
  method: 'post',
  host: 'https://vpppfv00l4.execute-api.us-east-1.amazonaws.com',
  path: '/prod/get-move',
  body: undefined,
};

const getBotMove = async ({ board }) => {
  const body = `{"board": [${board.toString()}]}`;
  const { requester } = getRequester(REQUEST_SPEC, { body });
  return await requester();
};

const checkGameState = (board) => {
  for (let [a,b,c] of WINNING_COMBOS) {
    const owners = [board[a], board[b], board[c]].join('');
    if (owners === '111' || owners === '222') {
      return { gameOver: true, winner: board[a], combo: [a,b,c] };
    }
  }

  return { gameOver: !board.some(i => i === 0) };
}

const onClickHandler = (owner, i, state, dispatch) => {
  if (owner || state.gameOver) {
    return;
  }

  return (e) => {
    let board = [...state.board];
    board[i] = 1;

    const outcome = checkGameState(board);
    const newState = { ...state, board, ...outcome };
    dispatch({ action: 'update', state: newState });

    if (!newState.gameOver) {
      getBotMove(newState).then(({ data, error}) => {
        const outcome = checkGameState(data.board);
        const newState = { ...state, board: data.board, ...outcome };
        dispatch({ action: 'update', state: newState });
      });
    }

    e.preventDefault();
  };
};

const reducer = (state, { action, ...args }) => {
  if (action === 'restartGame') {
    return DEFAULT_STATE;
  } else if (action === 'quitGame') {
    return { ...state, gameOver: true, quit: true };
  } else if (action === 'update') {
    return args.state;
  }

  return state;
};

const TicTacToe = (props) => {
  const [state, dispatch] = useReducer(reducer, DEFAULT_STATE);
  const terminalDispatch = useContext(TerminalDispatch);

  const createCell = (owner, i) => {
    let handler = onClickHandler(owner, i, state, dispatch);

    let classes = ['cell'];
    if (state.combo.includes(i)) {
      classes.push('strike');
    }

    return (
      <div key={i} className={classes.join(' ')} onClick={handler}>
        { PLAYERS[owner.toString()] }
      </div>
    );
  };

  if (state.gameOver) {
    terminalDispatch({ action: 'addTerminalRow', type: 'input' });
  }

  let prompt;
  if (!state.quit) {
    prompt = <Prompt gameOver={state.gameOver} winner={state.winner} />;
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
