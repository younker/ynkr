import {
  difference, isEmpty, isNil, join, keys, map, merge, pathOr, pick, pickBy,
  prop, propOr, reduce, reject, toString
} from 'rambda';

import axios from 'axios';
import { compile } from 'path-to-regexp';

import logger from '../logger';
import { getCodeForStatus, getStatusForCode } from './status-codes';

const INVALID_SPEC_ERROR = 'INVALID_SPEC_ERROR';
const REQUIRE_HTTP_REQUEST_ARGS = ['specId', 'method', 'host'];

// For logging
const INCOMING_HTTP_REQUEST_TYPE = 'incoming_http_response';
const OUTGOING_HTTP_REQUEST_TYPE = 'outgoing_http_request';

const missingArgumentError = (argument) => ({
  code: 'MISSING_ARGUMENT_ERROR',
  message: `Missing required argument: ${argument}`,
  argument,
});

const invalidArgumentError = (argument, value) => ({
  code: 'INVALID_ARGUMENT_ERROR',
  message: `Invalid ${argument} argument: ${value}`,
  argument,
});

const compilePathError = ({ message }) => ({ code: 'COMPILE_PATH_ERROR', message });

function buildPath(path, args) {
  if (isNil(path)) {
    return { error: missingArgumentError('path') };
  }

  let compiled;
  try {
    compiled = compile(path)(args);
  } catch (e) {
    return { error: compilePathError(e) };
  }

  if (!compiled) {
    return { error: invalidArgumentError('path', path) };
  }

  const qp = new URLSearchParams(propOr(undefined, 'queryParams', args));
  if (!isEmpty(qp)) {
    compiled = `${compiled}?${qp}`;
  }

  // Note the multiple returns above. If you made it here, it was successful
  return { path: compiled };
}

// Ramda's definition of nil is sufficient to cover our basic requirements
// around existence as this primarily is focused around strings. If we
// introduce objects, the acceptance criteria may change and this will need
// to be revisited.
const argIsPresent = (val) => !isNil(val);

function extractRequestArgsFromSpec(spec) {
  const validArgs = pickBy(argIsPresent, spec);
  const missing = difference(REQUIRE_HTTP_REQUEST_ARGS, keys(validArgs));
  const errors = reduce((acc, arg) => [...acc, missingArgumentError(arg)], [], missing);
  return { errors, requestArgs: validArgs };
}

function logRequest(details) {
  const outgoing = { ...details, type: OUTGOING_HTTP_REQUEST_TYPE };
  logger.info(outgoing);

  const onSuccess = (response) => {
    logger.info({ ...details, response, type: INCOMING_HTTP_REQUEST_TYPE });
  };

  const onFail = (errorDetails) => {
    logger.error({ ...outgoing, ...errorDetails });
  };

  return { onFail, onSuccess };
}

const getStatusFromException = (e) => {
  return pathOr(getStatusForCode('INTERNAL_SERVER_ERROR'), ['response', 'status'], e);
};

async function performHttpRequest({ specId, resource, method, url, body, endpoint }) {

  let data;
  let error;
  let status;

  const { onFail, onSuccess } = logRequest({
    specId,
    endpoint,
    request: { body, method, resource, url },
  });

  try {
    let resp = await axios[method](url, body);
    data = prop('data', resp);
    status = resp.status;
    onSuccess({ data, status });
  } catch (e) {
    status = getStatusFromException(e);
    const code = getCodeForStatus(status);

    onFail({
      error: e.message,
      code,
      status,
      respBody: pathOr('', ['response', 'data'], e),
    });

    error = { code, message: e.message, status };
  }

  return { data, error };
}

const assignOrCreate = (obj, key) => {
  // Ensures that obj.key is present in obj
  obj[key] = obj[key]; /* eslint-disable-line no-self-assign */
  return obj;
};

const isUndef = (v) => v === undefined;

function initializeSpec(naiveSpec, builderArgs = {}) {
  // To build a fully functional request spec, we need to do 2 things:
  // 1. add placeholders (defaulting to undefined) for all values required
  //    by performHttpRequest. Specs will define most of this but (at the
  //    time of this writing) the accessId is always required despite not
  //    being required for the actual HTTP request (like method or url is)
  //    and so we have to validate it's inclusion here
  // 2. once we have this template, the values for some of those keys
  //    might only be available during the (incoming API) request and so we
  //    need to merge in those values (being sure to only include the values
  //    from builderArgs which are applicable to the spec)
  const tmpl = reduce(assignOrCreate, naiveSpec, REQUIRE_HTTP_REQUEST_ARGS);
  const data = pick(keys(tmpl), builderArgs);
  const spec = merge(tmpl, data);


  // Anything still undefined is a problem as we do not know where or how to
  // fill in that data
  const undefValues = keys(pickBy(isUndef, spec));
  const errors = map(missingArgumentError, undefValues);

  return { errors, spec };
}

const requester = (naiveSpec, builderArgs) => {
  let { errors, spec } = initializeSpec(naiveSpec, builderArgs);

  let { error: pathError, path } = buildPath(spec.path, builderArgs);
  errors = errors.concat(pathError);

  let { errors: argErrors, requestArgs } = extractRequestArgsFromSpec(spec);
  errors = errors.concat(argErrors);

  const host = propOr('unknown', 'host', spec);
  const url = join('', [host, path]);
  const method = propOr('unknown', 'method', spec);
  const endpoint = `${method.toUpperCase()} ${spec.path}`;

  // Because we blindly concat errors from each build step
  errors = reject(isNil, errors);

  // To make things easier, make errors undefined when no errors exist. This
  // matches a desired pattern of simply returning `{ data }` when no error
  // exist thus making `error` undefined when the caller destructures it.
  errors = isEmpty(errors) ? undefined : errors;

  const requester = async function () {
    if (errors) {
      const msg = 'You are attempting to perform an http request against ' +
        'a spec which could not be compiled cleanly, failing with the ' +
        `following error(s): ${toString(errors)}`;

      return { error: { message: msg, code: INVALID_SPEC_ERROR } };
    }

    return await performHttpRequest({
      endpoint,
      url,
      ...requestArgs,
    });
  };

  return { errors, requester };
}

export default requester;
