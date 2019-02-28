import { expect } from 'chai';

import { getCodeForStatus, getStatusForCode } from '../../../src/util/http/status-codes';

describe('Status Codes Util', () => {
  describe('#getCodeForStatus', () => {
    it('will return code for valid status', () => {
      expect(getCodeForStatus(200)).to.equal('OK');
    });

    it('will return undefined for invalid status', () => {
      expect(getCodeForStatus(1234567890)).to.be.undefined;
    });

    it('will return default code', () => {
      expect(getCodeForStatus(null, 'OK')).to.equal('OK');
    });

    it('will return default code for empty string', () => {
      expect(getCodeForStatus('', 'OK')).to.equal('OK');
    });
  });

  describe('#getStatusForCode', () => {
    it('will return status for valid code', () => {
      expect(getStatusForCode('OK')).to.equal(200);
    });

    it('will return undefined for invalid code', () => {
      expect(getStatusForCode('BOGUS')).to.be.undefined;
    });

    it('will return default status', () => {
      expect(getStatusForCode(null, 200)).to.equal(200);
    });

    it('will return default status for empty string', () => {
      expect(getStatusForCode('', 200)).to.equal(200);
    });
  });
});
