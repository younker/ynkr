import React, { useContext, useReducer } from 'react';

import Prompt from './Prompt';
import { TerminalDispatch } from '../../Terminal';
import { checkBoardState, getBotMove } from './helpers';
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
  winner: undefined,
  combo: [],
  board: [0,0,0,0,0,0,0,0,0],
};

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
          const message = 'HTTP Request to AWS Gateway endpoint failed ' +
            ` with: [${error.status}] ${error.code} - ${error.message}`;
          dispatch({ action: 'setState', state: { code: ERROR, message } });
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
    prompt = <Prompt message={state.message} />
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
