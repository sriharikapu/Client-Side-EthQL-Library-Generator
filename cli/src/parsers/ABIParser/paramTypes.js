/* @flow */

import assert from 'assert';
import BigNumber from 'bn.js';
import { isAddress, isHexStrict, toHex, utf8ToHex } from 'web3-utils';

import type ParamType from './flowtypes';

function isEmptyHexString(hex: string) {
  if (typeof hex !== 'string') return false;

  const prefix = hex.slice(0, 2);
  const rest = [...hex.slice(2)];
  return prefix === '0x' && rest.every(char => char === '0');
}

export const ADDRESS_TYPE: ParamType = {
  name: 'String',
  validate(value: *) {
    assert(
      isEmptyHexString(value) || isAddress(value),
      'Must be a valid address',
    );
    return true;
  },
  convertInput(value: string) {
    // Expand `0x0` to a full-length address
    return value.padEnd(42, '0');
  },
  convertOutput(value: any) {
    // Expand `0x0` to a full-length address (for a valid address)
    return isAddress(value) || isEmptyHexString(value)
      ? value.padEnd(42, '0')
      : null;
  },
};

export const DATE_TYPE: ParamType = {
  name: 'date',
  validate(value: any) {
    // XXX This allows dates initialised without a value (or with `0` value)
    return value instanceof Date;
  },
  convertOutput(value: any) {
    const converted = parseInt(
      BigNumber.isBN(value) ? value.toNumber() : value,
      10,
    );
    // Recreate the date by adding milliseconds to the timestamp
    return converted > 0 ? new Date(converted * 1000) : null;
  },
  convertInput(value: Date) {
    // Dates are stored as timestamps without milliseconds
    return parseInt(value.setMilliseconds(0) / 1000, 10);
  },
};

export const HEX_STRING_TYPE: ParamType = {
  name: 'hexString',
  validate(value: any) {
    return isHexStrict(value);
  },
  convertOutput(value: any) {
    return toHex(value);
  },
};

export const INTEGER_TYPE: ParamType = {
  name: 'integer',
  validate(value: *) {
    assert(
      Number.isInteger(value) || BigNumber.isBN(value),
      'Must be a valid integer or BigNumber',
    );
    return true;
  },
  convertOutput(value: string) {
    return parseInt(value, 10);
  },
};

export const BIG_INTEGER_TYPE: ParamType = {
  name: 'Int',
  validate(value: *) {
    assert(
      Number.isInteger(value) || BigNumber.isBN(value),
      'Must be a valid integer or BigNumber',
    );
    return true;
  },
  convertInput(value: any) {
    return new BigNumber(value);
  },
  convertOutput(value: string) {
    return new BigNumber(value);
  },
};

export const BOOLEAN_TYPE: ParamType = {
  name: 'boolean',
  validate(value: *) {
    assert(typeof value === 'boolean', 'Must be a boolean');
    return true;
  },
};

export const BYTES_TYPE: ParamType = {
  name: 'bytes',
  validate(value: *) {
    assert(isHexStrict(value), 'Must be a hex string');
    return true;
  },
};

export const STRING_TYPE: ParamType = {
  name: 'string',
  validate(value: *) {
    assert(typeof value === 'string', 'Must be a string');
    return true;
  },
  convertInput(value: string) {
    return isHexStrict(value) ? value : utf8ToHex(value);
  },
};

export const PARAM_TYPE_NAME_MAP: { [paramName: string]: ParamType } = {
  [ADDRESS_TYPE.name]: ADDRESS_TYPE,
  [BIG_INTEGER_TYPE.name]: BIG_INTEGER_TYPE,
  [BOOLEAN_TYPE.name]: BOOLEAN_TYPE,
  [BYTES_TYPE.name]: BYTES_TYPE,
  [DATE_TYPE.name]: DATE_TYPE,
  [INTEGER_TYPE.name]: INTEGER_TYPE,
  [STRING_TYPE.name]: STRING_TYPE,
};
