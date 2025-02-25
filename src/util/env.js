import { pathOr, defaultTo } from 'rambda';

// We are stage-less (other than test) so this should work
const DEFAULT_ENV = 'production';

const NORMALIZED_ENV = defaultTo(DEFAULT_ENV)(process.env.NODE_ENV).toLowerCase();

// By using this predicate internally and exposing functions with 0 arity, we
// we reduce the liklihood of errors such as the following:
//   > const NORMALIZED_ENV = 'production';
//   > const isEnv = (env) => NORMALIZED_ENV === env;
//   > isEnv('prod')
//   false
const isEnv = (env) => NORMALIZED_ENV === env;

const env = {
  isTest: isEnv('test'),
  isProd: isEnv('production'),
};

export default env;
