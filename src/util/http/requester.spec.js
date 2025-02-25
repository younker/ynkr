import { map, dissoc } from 'rambda';

import axios from 'axios';
import getRequester from '../../../src/util/http/requester';

import { expectToFindErrorCode } from '../../../test/helper';

// Globally mock axios; we will clear mocks after each run (see below)
jest.mock('axios');

const expectArgumentError = (code, argumentName, errors) => {
  expectToFindErrorCode(code, errors);
  return expect(map(({ argument }) => argument, errors)).toContain(argumentName);
};

describe('/util/http/requester', function () {
  afterEach(() => {
    jest.clearAllMocks();
  });

  let validSpec = {
    specId: 'spec_id',
    method: 'get',
    path: '/path/:forty/bar',
    host: 'http://example.com',
  };

  let validArgs = {
    forty: 'two',
  };

  describe('#getRequester validations', function () {
    test('will fail when missing required spec fields', function () {
      const invalidSpec = dissoc('specId', validSpec);
      const { errors } = getRequester(invalidSpec, validArgs);
      expect(errors).toBeDefined();
    });

    test('will populate undefined values from args', function () {
      const spec = { ...validSpec, foo: undefined };
      const args = { ...validArgs, foo: 'bar' };
      const { errors } = getRequester(spec, args);
      expect(errors).not.toBeDefined();
    });

    test('will return back a collection of errors', function () {
      const { errors } = getRequester({});
      expect(errors).toBeInstanceOf(Array);
    });

    test('returns error for missing resource path', function () {
      const spec = dissoc('path', validSpec);
      const { errors } = getRequester(spec);
      expectArgumentError('MISSING_ARGUMENT_ERROR', 'path', errors);
    });

    test('returns error for invalid resource path (non-string)', function () {
      const spec = { ...validSpec, path: 42 };
      const { errors } = getRequester(spec);
      expectToFindErrorCode('COMPILE_PATH_ERROR', errors);
    });

    test('returns error when args for path are not provided', function () {
      const { errors } = getRequester(validSpec, {});
      expectToFindErrorCode('COMPILE_PATH_ERROR', errors);
    });

    test('fails when spec is missing specId field', function () {
      const spec = dissoc('specId', validSpec);
      const { errors } = getRequester(spec);
      expectArgumentError('MISSING_ARGUMENT_ERROR', 'specId', errors);
    });

    test('fails when spec is missing method field', function () {
      const spec = dissoc('method', validSpec);
      const { errors } = getRequester(spec);
      expectArgumentError('MISSING_ARGUMENT_ERROR', 'method', errors);
    });

    test('fails when spec is missing host field', function () {
      const spec = dissoc('host', validSpec);
      const { errors } = getRequester(spec);
      expectArgumentError('MISSING_ARGUMENT_ERROR', 'host', errors);
    });

    test('for valid spec will return a requester function', function () {
      const { errors, requester } = getRequester(validSpec, validArgs);
      expect(errors).not.toBeDefined();
      expect(typeof (requester)).toEqual('function');
    });

    test('will fail if an HTTP request is attempted against an invalid spec', async function () {
      const { errors, requester } = getRequester({});
      expect(errors).toBeInstanceOf(Array);

      const { error, data } = await requester();
      expect(error.code).toEqual('INVALID_SPEC_ERROR');
      expect(data).not.toBeDefined();
    });
  });

  describe('#getRequester HTTP requests', () => {
    test('no errors will be returned for happy path', async () => {
      axios.get.mockResolvedValue({ data: 'OK', status: 200 });

      const { errors } = getRequester(validSpec, validArgs);
      expect(errors).not.toBeDefined();
    });

    test('makes HTTP request with expected args', async () => {
      axios.get.mockResolvedValue({ data: 'OK', status: 200 });

      const { errors, requester } = getRequester(validSpec, validArgs);
      expect(errors).not.toBeDefined();

      await requester();

      var reqBody = undefined;
      expect(axios.get).toHaveBeenCalledWith(expect.stringContaining(validSpec.host), reqBody);
      expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('/path/two/bar'), reqBody);
    });

    test('does not include query params delimiter unless query params exist', async function () {
      axios.get.mockResolvedValue({ data: 'OK', status: 200 });
      const queryParams = {};

      const { errors, requester } = getRequester(validSpec, { ...validArgs, queryParams });
      expect(errors).not.toBeDefined();

      await requester();

      const reqBody = undefined;
      expect(axios.get).not.toEqual(expect.stringContaining('?'), reqBody);
    });

    test('makes HTTP request to expected path with any provided query params attached', async function () {
      axios.get.mockResolvedValue({ data: 'OK', status: 200 });

      const queryParams = { query: 'params' };
      const { errors, requester } = getRequester(validSpec, { ...validArgs, queryParams });
      expect(errors).not.toBeDefined();

      await requester();

      const reqBody = undefined;
      const expected = expect.stringContaining('/path/two/bar?query=params');
      expect(axios.get).toHaveBeenCalledWith(expected, reqBody);
    });

    test('receives expected values', async function () {
      const payload = 'some HTTP response body';
      const response = { data: payload, status: 200 };
      axios.get.mockResolvedValue(response);

      const { errors, requester } = getRequester(validSpec, validArgs);
      expect(errors).not.toBeDefined();

      const { data, error } = await requester();
      expect(data).toEqual(payload);
      expect(error).not.toBeDefined();
    });

    test('failed HTTP request handling', async function () {
      const httpFailure = 'exception message';
      axios.get.mockRejectedValue(new Error(httpFailure));

      const { errors, requester } = getRequester(validSpec, validArgs);
      expect(errors).not.toBeDefined();

      const { error: { message, code } } = await requester();
      expect(message).toEqual(httpFailure);
      expect(code).toEqual('INTERNAL_SERVER_ERROR');
    });
  });
});
