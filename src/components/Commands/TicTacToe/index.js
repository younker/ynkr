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

const OK = 'ok';
const GAME_OVER = 'gameOver';
const ERROR = 'error';
const QUIT_GAME = 'quitGame';

const DEFAULT_STATE = {
  code: OK,
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

const checkBoardState = (board) => {
  for (let [a,b,c] of WINNING_COMBOS) {
    const owners = [board[a], board[b], board[c]].join('');
    if (owners === '111' || owners === '222') {
      return { code: GAME_OVER, winner: board[a], combo: [a,b,c] };
    }
  }

  const openCells = board.some(i => i === 0);
  const code = openCells ? OK : GAME_OVER;
  return { code };
}

const onClickHandler = (owner, i, state, dispatch) => {
  if (owner || state.code === GAME_OVER) {
    return;
  }

  return (e) => {
    let board = [...state.board];
    board[i] = 1;

    // Handle the player's move
    const playerOutcome = checkBoardState(board);
    const playerState = { ...state, board, ...playerOutcome };
    dispatch({ action: 'setState', state: playerState });

    if (playerState.code === OK) {
      // Handle the bot's move
      getBotMove(playerState).then(({ data, error}) => {
        if (error) {
          dispatch({ action: 'setState', state: { code: ERROR, error } });
        } else {
          const botOutcome = checkBoardState(data.board);
          const botState = { ...state, board: data.board, ...botOutcome };
          dispatch({ action: 'setState', state: botState });
        }
    });
    }

    e.preventDefault();
  };
};

const reducer = (state, { action, ...args }) => {
  switch(action) {
    case 'restartGame':
      return DEFAULT_STATE;

    case 'quitGame':
      return { ...state, code: QUIT_GAME };

    case 'setState':
      return { ...state, ...args.state };

    default:
      return state;
  }
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

  let prompt;
  if (state.code === QUIT_GAME) {
    terminalDispatch({ action: 'commandComplete' });

  } else if (state.code === ERROR) {
    prompt = <Prompt message='boom!' />
    terminalDispatch({ action: 'commandComplete' });

  } else {
    prompt = <Prompt code={state.code} winner={state.winner} />;
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
