import { getCodeForStatus, getStatusForCode } from './status-codes';

describe('Status Codes Util', () => {
  describe('#getCodeForStatus', () => {
    test('will return code for valid status', () => {
      expect(getCodeForStatus(200)).toEqual('OK');
    });

    test('will return undefined for invalid status', () => {
      expect(getCodeForStatus(1234567890)).toBe.undefined;
    });

    test('will return default code', () => {
      expect(getCodeForStatus(null, 'OK')).toEqual('OK');
    });

    test('will return default code for empty string', () => {
      expect(getCodeForStatus('', 'OK')).toEqual('OK');
    });
  });

  describe('#getStatusForCode', () => {
    test('will return status for valid code', () => {
      expect(getStatusForCode('OK')).toEqual(200);
    });

    test('will return undefined for invalid code', () => {
      expect(getStatusForCode('BOGUS')).toBe.undefined;
    });

    test('will return default status', () => {
      expect(getStatusForCode(null, 200)).toEqual(200);
    });

    test('will return default status for empty string', () => {
      expect(getStatusForCode('', 200)).toEqual(200);
    });
  });
});
