import React, { useContext, useReducer } from 'react';

import Board from './Board';
import Prompt from './Prompt';
import HelpPage from './HelpPage';
import Scoreboard from './Scoreboard';
import parseArgs from '../../../util/parse-args';
import { BOT, HUMAN, NEW_GAME, GAME_ERROR, GAME_ON, MOVE_COMPLETE, PLAYER_ONE, PLAYER_TWO, QUIT_GAME } from './constants';
import { COMMAND_COMPLETE, TerminalDispatch } from '../../Terminal';
import { checkBoardState, performBotMove } from './helpers';
import './style.scss';

export const GameDispatch = React.createContext(null);

const DEFAULT_STATE = {
  board: [0,0,0,0,0,0,0,0,0],
  status: NEW_GAME,
  turn: PLAYER_ONE,
  playerOne: undefined,
  playerTwo: undefined,
  winner: undefined,
  winningCombo: [],
};

const reducer = (state, { action, ...args }) => {
  switch(action) {
    case MOVE_COMPLETE:
      // the bot updates with the board, a player updates based on the cell
      // that was clicked.
      let { player, cellIdx, board } = args;
      if (!board) {
        board = [ ...state.board ];
        board[cellIdx] = player;
      }
      let outcome = checkBoardState(board);
      let turn;
      if (outcome.status === GAME_ON) {
        turn = player === PLAYER_ONE ? PLAYER_TWO : PLAYER_ONE;
      }

      return { ...state, ...outcome, board, turn };

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

// tic-tac-toe --player-one bot
const getInitialState = ({ args }) => {
  let state = { ...DEFAULT_STATE };
  const parsed = parseArgs(args);

  let p1 = HUMAN;
  if (parsed['--player-one'] === BOT) {
    p1 = BOT;
  }
  state['playerOne'] = p1;

  let p2 = BOT;
  if (!parsed['--player-two'] && p1 === BOT) {
    p2 = HUMAN;
  } else if (parsed['--player-two'] === HUMAN) {
    p2 = HUMAN;
  }
  state['playerTwo'] = p2;

  return state;
};

const TicTacToe = ({ args }) => {
  const terminalDispatch = useContext(TerminalDispatch);

  if (args['h'] || args['help']) {
    terminalDispatch({ action: COMMAND_COMPLETE });
    return <HelpPage />;
  }

  const [state, dispatch] = useReducer(reducer, getInitialState(args));

  let prompt;
  if (state.status === QUIT_GAME) {
    terminalDispatch({ action: COMMAND_COMPLETE });

  } else if (state.status === GAME_ERROR) {
    prompt = <Prompt error={state.error} />
    terminalDispatch({ action: COMMAND_COMPLETE });

  } else {
    prompt = <Prompt gameCode={state.status} winner={state.winner} />;

    console.log('------ state:', state);
    const gameActive = state.status === GAME_ON || state.status === NEW_GAME;
    const botTurn = (state.turn ===1 && state.playerOne === BOT) ||
      (state.turn === 2 && state.playerTwo === BOT);

    if (gameActive && botTurn) {
      performBotMove(state.board, dispatch);
    }
  }

  return (
    <GameDispatch.Provider value={dispatch}>
      <div className="TicTacToe">
        <Board
          cells={state.board}
          gameState={state.status}
          turn={state.turn}
          winningCombo={state.winningCombo}
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
