import { pathOr } from 'rambda';
import loglevel from 'loglevel';

import env from './env';

const LOGGER = loglevel.getLogger('ynkr');
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

const level = pathOr(undefined, ['env', 'LOGGER_LEVEL'], process.env);

if (level && LOGGER_LEVELS[level]) {
  LOGGER.setLevel(level);
} else if (env.isTest) {
  // Silence test unless we want logs (at which point we will have to run with
  // the LOGGER_LEVEL env variable set). Should I ever add a test around code
  // that logs a fatal, I'll be forced to come back in here and force a silent
  // level. Until then, this works well enough.
  LOGGER.setLevel('FATAL');
} else {
  LOGGER.setLevel(DEFAULT_LOGGER_LEVEL);
}

export default LOGGER;
