import retryable from '../../../../util/http/retryable';
import getRequester from '../../../../util/http/requester';

import { MOVE_COMPLETE, PLAYER_TWO } from '../constants';

const GATEWAY_API_HOST = 'https://vpppfv00l4.execute-api.us-east-1.amazonaws.com';

// Retry at least once. This is because the timeout is only 2s and for a cold
// lamda call, the startup time plus a full scan can cause a timeout
const MAX_RETRIES = 2;

const REQUEST_SPEC = {
  specId: 'ticTacToe-getBotMove',
  method: 'post',
  host: GATEWAY_API_HOST,
  path: '/prod/get-move',
  body: undefined,
};

const makeRequest = async (board) => {
  const body = `{"board": [${board.toString()}]}`;
  const { requester } = getRequester(REQUEST_SPEC, { body });
  return await retryable(requester, { times: MAX_RETRIES });
};

const handleResponse = (dispatch) => {
  return ({ data, error }) => {
    if (error) {
      const message = 'HTTP Request to AWS Gateway endpoint failed ' +
        ` with: [${error.status}] ${error.code} - ${error.message}`;
      dispatch({ action: 'error', message });

    } else {
      const board = data.board;
      dispatch({ action: MOVE_COMPLETE, player: PLAYER_TWO, board });
    }
  };
};

export default (board, dispatch) => makeRequest(board).then(handleResponse(dispatch));
