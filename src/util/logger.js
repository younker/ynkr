import { defaultTo } from 'rambda';
import loglevel from 'loglevel';

import env from './env';

const LOGGER = loglevel.getLogger('ynkr');
const DEFAULT_LOGGER_LEVEL = 'debug';

const level = defaultTo('')(process.env.LOGGER_LEVEL).toUpperCase();

if (level && LOGGER.levels[level] >= 0) {
  LOGGER.setLevel(level);
} else if (env.isTest) {
  // Silence test unless we want logs (at which point we will have to run with
  // the LOGGER_LEVEL env variable set). Should I ever add a test around code
  // that logs a fatal, I'll be forced to come back in here and force a silent
  // level. Until then, this works well enough.
  LOGGER.setLevel('silent');
} else {
  LOGGER.setLevel(DEFAULT_LOGGER_LEVEL);
}

export default LOGGER;
