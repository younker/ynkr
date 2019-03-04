import * as R from 'ramda';

// We are stage-less (other than test) so this should work
const DEFAULT_ENV = 'production';

const NORMALIZED_ENV = R.pathOr(DEFAULT_ENV, ['env', 'NODE_ENV'], process).toLowerCase();

// By using this predicate internally and exposing functions with 0 arity, we
// we reduce the liklihood of errors such as the following:
//   > const NORMALIZED_ENV = 'production';
//   > const isEnv = (env) => NORMALIZED_ENV === env;
//   > isEnv('prod')
//   false
const isEnv = (env) => NORMALIZED_ENV === env;

export default {
  isTest: isEnv('test'),
  isProd: isEnv('production'),
};
