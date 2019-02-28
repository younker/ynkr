import R from 'ramda';

// Error Nomenclature
//   - status: a numeric id for an HTTP state
//   - code: a human-readable, upper-case string for an HTTP state
// Official status codes retrived from:
//   - https://www.iana.org/assignments/http-status-codes/http-status-codes.xhtml
const statusToCode = {
  100: 'CONTINUE',
  101: 'SWITCHING_PROTOCOLS',
  102: 'PROCESSING',
  103: 'EARLY_HINTS',
  200: 'OK',
  201: 'CREATED',
  202: 'ACCEPTED',
  203: 'NON_AUTHORITATIVE_INFORMATION',
  204: 'NO_CONTENT',
  205: 'RESET_CONTENT',
  206: 'PARTIAL_CONTENT',
  207: 'MULTI_STATUS',
  208: 'ALREADY_REPORTED',
  226: 'IM_USED',
  300: 'MULTIPLE_CHOICES',
  301: 'MOVED_PERMANENTLY',
  302: 'FOUND',
  303: 'SEE_OTHER',
  304: 'NOT_MODIFIED',
  305: 'USE_PROXY',
  307: 'TEMPORARY_REDIRECT',
  308: 'PERMANENT_REDIRECT',
  400: 'BAD_REQUEST',
  401: 'UNAUTHORIZED',
  402: 'PAYMENT_REQUIRED',
  403: 'FORBIDDEN',
  404: 'NOT_FOUND',
  405: 'METHOD_NOT_ALLOWED',
  406: 'NOT_ACCEPTABLE',
  407: 'PROXY_AUTHENTICATION_REQUIRED',
  408: 'REQUEST_TIMEOUT',
  409: 'CONFLICT',
  410: 'GONE',
  411: 'LENGTH_REQUIRED',
  412: 'PRECONDITION_FAILED',
  413: 'PAYLOAD_TOO_LARGE',
  414: 'URI_TOO_LONG',
  415: 'UNSUPPORTED_MEDIA_TYPE',
  416: 'RANGE_NOT_SATISFIABLE',
  417: 'EXPECTATION_FAILED',
  421: 'MISDIRECTED_REQUEST',
  422: 'UNPROCESSABLE_ENTITY',
  423: 'LOCKED',
  424: 'FAILED_DEPENDENCY',
  425: 'TOO_EARLY',
  426: 'UPGRADE_REQUIRED',
  428: 'PRECONDITION_REQUIRED',
  429: 'TOO_MANY_REQUESTS',
  431: 'REQUEST_HEADER_FIELDS_TOO_LARGE',
  451: 'UNAVAILABLE_FOR_LEGAL_REASONS',
  500: 'INTERNAL_SERVER_ERROR',
  501: 'NOT_IMPLEMENTED',
  502: 'BAD_GATEWAY',
  503: 'SERVICE_UNAVAILABLE',
  504: 'GATEWAY_TIMEOUT',
  505: 'HTTP_VERSION_NOT_SUPPORTED',
  506: 'VARIANT_ALSO_NEGOTIATES',
  507: 'INSUFFICIENT_STORAGE',
  508: 'LOOP_DETECTED',
  510: 'NOT_EXTENDED',
  511: 'NETWORK_AUTHENTICATION_REQUIRED',
};

// Following best practices (from graphql specifically), this provides the
// ability to supply a human-readable version of the HTTP status
export const getCodeForStatus = (status, defaultCode = undefined) => {
  return R.propOr(defaultCode, status, statusToCode);
};

// When you need a status (int), looking them up by name is more readable. For
// example:
//   { status: getStatusForCode('MULTI_STATUS') }
// vs
//   { status: 207 }
const reduceFn = (acc, status) => {
  acc[statusToCode[status]] = status;
  return acc;
};
const codeToStatus = R.reduce(reduceFn, {}, R.keys(statusToCode));

export const getStatusForCode = (code, defaultStatus = undefined) => {
  const status = R.prop(code, codeToStatus);
  return R.isNil(status) ? defaultStatus : parseInt(status);
};
