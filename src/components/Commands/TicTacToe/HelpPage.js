import React from 'react';

export default function HelpPage() {
  return (<pre>{`
TIC-TAC-TOE(1)                  BS Command Manual                 TIC-TAC-TOE(1)

NAME
    tic-tac-toe -- play a game of tic-tac-toe

SYNOPSIS
    tic-tac-toe [-vh]

DESCRIPTION
    Will start a game of tic-tac-toe where the current user is player one and
    player two is either a bot or another human.

    The options are as follows:

    --player-one <actor>
        Designates who the actor should be for player 1. Actor values can be
        either "human" or "bot".

        Default: human

    --player-two <actor>
        Designates who the actor should be for player 2. Actor values can be
        either "human" or "bot".

        Default:
          When player 1 is not defined or "human", player 2 will default to "bot".
          When player 1 is "bot", player 2 will default to "human".

EXAMPLES

    The following examples are shown as given to the shell:

    $ tic-tac-toe

        Will start a game of tic-tac-toe where player one is current user and
        player two is a bot.

    $ tic-tac-toe --player-one bot

        Will start a game of tic-tac-toe where player one is a bot and player
        two is the current user.

    $ tic-tac-toe --player-one bot --player-two bot

        Will start a game that will play itself.

HISTORY

An early variation of tic-tac-toe was played in the Roman Empire, around the
first century BC. It was called terni lapilli (three pebbles at a time) and
instead of having any number of pieces, each player only had three, thus they
had to move them around to empty spaces to keep playing.

BS                               March 16, 2019                               BS
`}</pre>);
};
