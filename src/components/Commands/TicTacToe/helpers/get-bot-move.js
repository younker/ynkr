import retryable from '../../../../util/http/retryable';
import getRequester from '../../../../util/http/requester';

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

export default async ({ board }) => {
  const body = `{"board": [${board.toString()}]}`;
  const { requester } = getRequester(REQUEST_SPEC, { body });
  return await retryable(requester, { times: MAX_RETRIES });
};
