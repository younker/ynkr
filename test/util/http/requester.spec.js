import R from 'ramda';
import chai from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import { createAsync, expectToFindErrorCode } from '../../../test/helper';
import { getRequester } from '../../../src/util/http/requester.js';

chai.use(sinonChai);
const { expect } = chai;

const expectArgumentError = (code, argumentName, errors) => {
  expectToFindErrorCode(code, errors);
  return expect(R.map(({ argument }) => argument, errors)).to.include(argumentName);
};

describe('/util/http/requester', function() {
  let validSpec = {
    specId: 'spec_id',
    method: 'get',
    path: '/path/:forty/bar',
    host: 'http://example.com',
  };

  let validArgs = {
    forty: 'two',
  };

  describe('#getRequester validations', function() {
    it('will fail when missing required spec fields', function() {
      const invalidSpec = R.dissoc('specId', validSpec);
      const { errors } = getRequester(invalidSpec, validArgs);
      expect(errors).to.not.be.undefined;
    });

    it('will populate undefined values from args', function() {
      const spec = { ...validSpec, foo: undefined };
      const args = { ...validArgs, foo: 'bar' };
      const { errors } = getRequester(spec, args);
      expect(errors).to.be.undefined;
    });

    it('will return back a collection of errors', function() {
      const { errors } = getRequester({});
      expect(errors).to.be.an('array');
      expect(errors).to.not.be.empty;
    });

    it('returns error for missing resource path', function() {
      const spec = R.dissoc('path', validSpec);
      const { errors } = getRequester(spec);
      expectArgumentError('MISSING_ARGUMENT_ERROR', 'path', errors);
    });

    it('returns error for invalid resource path', function() {
      const spec = { ...validSpec, path: 42 };
      const { errors } = getRequester(spec);
      expectArgumentError('INVALID_ARGUMENT_ERROR', 'path', errors);
    });

    it('returns error when args for path are not provided', function() {
      const { errors } = getRequester(validSpec, {});
      expectToFindErrorCode('COMPILE_PATH_ERROR', errors);
    });

    it('fails when spec is missing specId field', function() {
      const spec = R.dissoc('specId', validSpec);
      const { errors } = getRequester(spec);
      expectArgumentError('MISSING_ARGUMENT_ERROR', 'specId', errors);
    });

    it('fails when spec is missing method field', function() {
      const spec = R.dissoc('method', validSpec);
      const { errors } = getRequester(spec);
      expectArgumentError('MISSING_ARGUMENT_ERROR', 'method', errors);
    });

    it('fails when spec is missing host field', function() {
      const spec = R.dissoc('host', validSpec);
      const { errors } = getRequester(spec);
      expectArgumentError('MISSING_ARGUMENT_ERROR', 'host', errors);
    });

    it('for valid spec will return a requester function', function() {
      const { errors, requester } = getRequester(validSpec, validArgs);
      expect(errors).to.be.undefined;
      expect(typeof(requester)).to.equal('function');
    });

    it('will fail if an HTTP request is attempted against an invalid spec', async function() {
      const { errors, requester } = getRequester({});
      expect(errors).to.not.be.empty;

      const { error, data } = await requester();
      expect(error.code).to.equal('INVALID_SPEC_ERROR');
      expect(data).to.be.undefined;
    });
  });

  describe('#getRequester HTTP requests', function() {
    const getTarget = (spies) => proxyquire('../../../src/util/http/requester', {
      axios: R.propOr({}, 'axios', spies),
    });

    it('makes HTTP request with expected args', async function() {
      const spies = { axios: { get: sinon.spy() } };

      const { requester } = getTarget(spies).getRequester(validSpec, validArgs);
      await requester();

      expect(spies.axios.get).to.be.calledWith(sinon.match((args) => {
        expect(args).to.include(validSpec.host);
        return expect(args).to.include('/path/two/bar');
      }));
    });

    it('does not include query params delimiter unless query params exist', async function() {
      const spies = { axios: { get: sinon.spy() } };
      const queryParams = {};

      const { requester } = getTarget(spies).getRequester(validSpec, { ...validArgs, queryParams });
      await requester();

      expect(spies.axios.get).to.be.calledWith(sinon.match((args) => {
        return expect(R.last(args)).to.not.equal('?');
      }));
    });

    it('makes HTTP request to expected path with any provided query params attached', async function() {
      const spies = { axios: { get: sinon.spy() } };
      const queryParams = { query: 'params' };

      const { requester } = getTarget(spies).getRequester(validSpec, { ...validArgs, queryParams });
      await requester();

      expect(spies.axios.get).to.be.calledWith(sinon.match((args) => {
        return expect(args).to.include('/path/two/bar?query=params');
      }));
    });

    it('receives expected values', async function() {
      const payload = 'some HTTP response body';
      const response = { data: payload, status: 200 };
      const spy = sinon.spy(createAsync({ resolveWith: response }));
      const spies = { axios: { get: spy } };

      const { requester } = getTarget(spies).getRequester(validSpec, validArgs);
      const { data, error } = await requester();

      expect(data).to.equal(payload);
      expect(error).to.be.undefined;
    });

    it('failed HTTP request handling', async function() {
      const httpFailure = 'exception message';
      const spies = {
        axios: {
          get: sinon.spy(createAsync({ rejectWith: new Error(httpFailure) })),
        }
      };

      const { requester } = getTarget(spies).getRequester(validSpec, validArgs);
      const { error: { message, code } } = await requester();
      expect(message).to.equal(httpFailure);
      expect(code).to.equal('INTERNAL_SERVER_ERROR');
    });
  });
});
