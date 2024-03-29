/* @flow */

import { SPEC_TYPES } from './ABIParser/constants';

export type {
  ConstantSpec,
  MethodSpec,
  EventSpec,
  ContractSpec,
} from '../interface/ContractSpec';

export type ABIParam = {
  name?: string,
  type: string,
  components?: Array<ABIParam>,
};

export type ABIEntryType = 'constructor' | 'function' | 'event';

export type ABIEntryStateMutability =
  | 'nonpayable'
  | 'payable'
  | 'pure'
  | 'view';

export type ABIEntry = {
  constant?: boolean,
  inputs?: Array<ABIParam>,
  name: string,
  outputs?: Array<ABIParam>,
  type?: ABIEntryType,
  stateMutability: ABIEntryStateMutability,
  payable?: boolean,
};

export type ABI = Array<ABIEntry>;

export type ParamTypeName = string;

export type ParamType = {
  name: ParamTypeName,
  convertInput?: (input: *) => *,
  convertOutput?: (output: *) => *,
  validate: (input: *) => boolean,
};

export type ParamSpec = {
  defaultValue?: *,
  name: string,
  type: ParamType,
};

export type ParamsSpec = Array<ParamSpec>;

export type SpecType = $Values<typeof SPEC_TYPES>;

export type EntryGroupsByType = {
  [specType: SpecType]: {
    [entryName: string]: Array<ABIEntry>,
  },
};
