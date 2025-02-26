import React, { useContext, useEffect, useReducer, createContext } from 'react';

import Board from './Board';
import Prompt from './Prompt';
import HelpPage from './HelpPage';
import Scoreboard from './Scoreboard';
import {
  BOT, GAME_ERROR, GAME_ON, HUMAN, MOVE_COMPLETE, NEW_GAME, PLAYER_ONE,
  PLAYER_TWO, QUIT_GAME, RESTART_GAME
} from './constants';
import { COMMAND_COMPLETE, TerminalDispatch } from '../../Terminal';
import { checkBoardState, performBotMove } from './helpers';
import './style.scss';

export const GameDispatch = createContext(undefined);

const DEFAULT_STATE = {
  board: [0, 0, 0, 0, 0, 0, 0, 0, 0],
  status: NEW_GAME,
  gameArgs: undefined,
  turn: undefined,
  winner: undefined,
  winningCombo: [],
};

const reducer = (state, { action, ...args }) => {
  switch (action) {
    case MOVE_COMPLETE:
      let { turn } = state;
      let { board, cellIdx } = args;

      // When the bot moves, we will get args like so:
      //   { player: 2, board: [2,0,0,1,0,0,0,0,0] }
      // This provides the updated board. When a player moves, args provides:
      //   { cellIdx: 3 }
      // This tells us the current player used their turn to own cell 3 which
      // then requires us to manually update it.
      if (!board) {
        board = [...state.board];
        board[cellIdx] = turn.id();
      }

      // Did someone win the game based on the last move? If not, then switch
      // turns and keep playing.
      let outcome = checkBoardState(board);

      if (outcome.status === GAME_ON) {
        // Swap turns
        turn = new Turn(turn.nextPlayer(), turn.currentPlayer());
      }

      return { ...state, ...outcome, board, turn };

    case GAME_ERROR:
      return { ...state, status: GAME_ERROR, error: args.message };

    case RESTART_GAME:
      return getInitialState(state.gameArgs);

    case QUIT_GAME:
      return { ...state, status: QUIT_GAME };

    default:
      return state;
  }
};


function Player(actor, id) {
  this.actor = actor;
  this.id = id;
}

function Turn(currentPlayer, nextPlayer) {
  this.currP = currentPlayer;
  this.nextP = nextPlayer;

  this.isBot = () => {
    return this.currP.actor === BOT;
  };

  this.id = () => {
    return this.currP.id;
  };

  this.currentPlayer = () => {
    return this.currP;
  };

  this.nextPlayer = () => {
    return this.nextP;
  };
}

// tic-tac-toe --player-one bot
const getInitialState = (args) => {
  let state = { ...DEFAULT_STATE, gameArgs: args };

  // For p1, this is the role they are assigned to.
  // For p2, this is the default value which can be altered if an arg was passed
  let [actor1, actor2] = args['player-one'] === BOT ? [BOT, HUMAN] : [HUMAN, BOT];

  const roles = [BOT, HUMAN];
  const idx = roles.indexOf(args['player-two'])
  if (idx > -1) {
    actor2 = roles[idx];
  }

  const p1 = new Player(actor1, PLAYER_ONE);
  const p2 = new Player(actor2, PLAYER_TWO);

  // Player 1 obviously goes first
  state.turn = new Turn(p1, p2);


  return state;
};

const isBotsTurn = ({ status, turn }) => {
  const moveIsRequired = status === GAME_ON || status === NEW_GAME;
  if (!moveIsRequired) {
    return false;
  }

  return turn.isBot();
};

const TicTacToe = ({ args }) => {
  const [state, dispatch] = useReducer(reducer, getInitialState(args));
  const terminalDispatch = useContext(TerminalDispatch);

  useEffect(() => {
    if (isBotsTurn(state)) {
      performBotMove({ dispatch, board: state.board, player: state.turn.id() });
    }
  }, [state]);


  if (args['h'] || args['help']) {
    terminalDispatch({ action: COMMAND_COMPLETE });
    return <HelpPage />;
  }

  let prompt;
  if (state.status === QUIT_GAME) {
    terminalDispatch({ action: COMMAND_COMPLETE });

  } else if (state.status === GAME_ERROR) {
    prompt = <Prompt error={state.error} />;
    terminalDispatch({ action: COMMAND_COMPLETE });

  } else {
    prompt = <Prompt gameCode={state.status} winner={state.winner} />;
  }

  return (
    <GameDispatch.Provider value={dispatch}>
      <div className="TicTacToe">
        <Board
          cells={state.board}
          gameState={state.status}
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
