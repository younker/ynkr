// By default, assume a util/requester response which always returns back an
// error OR data object, never both. Thus, if there is no error, the request
// is valid
const defaultValidator = ({ error }) => !error;

export default async (func, { isValid = defaultValidator, times = 1 } = {}) => {
  // The initial request is NOT a retry
  let result = await func();

  while ( times-- && !isValid(result)) {
    result = await func();
  }

  return result;
}
