import * as R from 'ramda';
import bunyan from 'bunyan';

import env from './env';

const LOGGER = bunyan.createLogger({ name: 'ynkr' });
const DEFAULT_LOGGER_LEVEL = 'debug';

// https://github.com/trentm/node-bunyan#levels
const LOGGER_LEVELS = {
  fatal: 60,
  error: 50,
  warn: 40,
  info: 30,
  debug: 20,
  trace: 10,
};

let level = R.pathOr(undefined, ['env', 'LOGGER_LEVEL'], process);
if (level && LOGGER_LEVELS[level]) {
  LOGGER.level(level);
} else if (env.isTest) {
  // Silence test unless we want logs (at which point we will have to run with
  // the LOGGER_LEVEL env variable set). Should I ever add a test around code
  // that logs a fatal, I'll be forced to come back in here and force a silent
  // level. Until then, this works well enough.
  LOGGER.level('FATAL');
} else {
  LOGGER.level(DEFAULT_LOGGER_LEVEL);
}

export default LOGGER;
