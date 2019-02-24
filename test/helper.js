import R from 'ramda';
import { expect } from 'chai';

export function createAsync({ resolveWith, rejectWith }) {
  return () => new Promise((resolve, reject) => {
    if (resolveWith !== undefined) { resolve(resolveWith); }
    if (rejectWith !== undefined) { reject(rejectWith); }
  });
}

// Until chai 5 comes out, we cannot loosely assert on deep objects:
//   https://github.com/chaijs/chai/issues/644
// Until then, use this with R.find(ofType('type_of_error'), errors)
const extractCode = ({ code }) => code;

export const expectToFindErrorCode = (code, errors) => {
  return expect(R.map(extractCode, errors)).to.include(code);
};
