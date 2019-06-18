import { describe } from 'mocha'
import itParam from 'mocha-param'
import { expect } from 'chai'

import XdrEncode from '../../src/encode/xdr.js'
import BufferIO from '../../src/io/buffer.js'

import types from '../../src/types/types.js'

const enc = new XdrEncode()

const testVarArray = new types.VarArray(20)
testVarArray.values = [new types.Int(1), new types.Int(2)]

const padVOpaque = new types.VarOpaque(10)
padVOpaque.value = Buffer.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])

const noPadVOpaque = new types.VarOpaque(10)
noPadVOpaque.value = Buffer.from([0, 1, 2, 3, 4, 5, 6, 7])

const testEnum = new types.Enum({
  0: 'Zero',
  1: 'One',
  2: 'Two'
}, 2)

const testUnion = new types.Union(testEnum,
  {
    'Zero': new types.Int(),
    'One': new types.Int(),
    'Two': new types.Hyper()
  }
)

const passTests = [
  { n: 'String', t: new types.Str('hello'), e: Buffer.from([0, 0, 0, 5, 104, 101, 108, 108, 111, 0, 0, 0]) },
  { n: 'Opt Null', t: new types.Option(), e: Buffer.alloc(4) },
  { n: 'Opt Val', t: new types.Option(types.Int, new types.Int(1)), e: Buffer.from([0, 0, 0, 1, 0, 0, 0, 1]) },
  { n: 'UInt', t: new types.UInt(1), e: Buffer.from([0, 0, 0, 1]) },
  { n: 'Int', t: new types.Int(-1), e: Buffer.from([255, 255, 255, 255]) },
  { n: 'Hyper', t: new types.Hyper(-1), e: Buffer.from([255, 255, 255, 255, 255, 255, 255, 255]) },
  { n: 'UHyper', t: new types.UHyper(1), e: Buffer.from([0, 0, 0, 0, 0, 0, 0, 1]) },
  { n: 'Bool true', t: new types.Bool(true), e: Buffer.from([0, 0, 0, 1]) },
  { n: 'Bool false', t: new types.Bool(false), e: Buffer.alloc(4) },
  { n: 'Void', t: new types.Void(), e: Buffer.alloc(0) },
  { n: 'FixedOpaque No Padding', t: new types.FixedOpaque(8), e: Buffer.alloc(8) },
  { n: 'FixedOpaque Padding', t: new types.FixedOpaque(10), e: Buffer.alloc(12) },
  { n: 'FixedArray Default', t: new types.FixedArray(), e: Buffer.alloc(4) },
  { n: 'FixedArray Basic', t: new types.FixedArray(2, () => new types.Int()), e: Buffer.alloc(8) },
  { n: 'VarArray Empty', t: new types.VarArray(), e: Buffer.alloc(4) },
  { n: 'VarArray Non Empty', t: testVarArray, e: Buffer.from([0, 0, 0, 2, 0, 0, 0, 1, 0, 0, 0, 2]) },
  { n: 'VarOpaque Empty', t: new types.VarOpaque(), e: Buffer.alloc(4) },
  { n: 'VarOpaque Non Empty Padded', t: padVOpaque, e: Buffer.from([0, 0, 0, 10, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 0]) },
  { n: 'VarOpaque Non Empty Non Padded', t: noPadVOpaque, e: Buffer.from([0, 0, 0, 8, 0, 1, 2, 3, 4, 5, 6, 7]) },
  { n: 'Float', t: new types.Float(1), e: Buffer.from([63, 128, 0, 0]) },
  { n: 'Double', t: new types.Double(1), e: Buffer.from([63, 240, 0, 0, 0, 0, 0, 0]) },
  { n: 'Union Default', t: new types.Union(), e: Buffer.alloc(4) },
  { n: 'Union Basic', t: testUnion, e: Buffer.from([0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0]) },
  { n: 'Enum Default', t: new types.Enum(), e: Buffer.alloc(4) },
  { n: 'Enum Basic', t: testEnum, e: Buffer.from([0, 0, 0, 2]) },
  { n: 'Struct Default', t: new types.Struct(), e: Buffer.alloc(0) },
  { n: 'Struct Basic', t: new types.Struct(['1', '2'], [new types.Int(1), new types.UInt(2)]), e: Buffer.from([0, 0, 0, 1, 0, 0, 0, 2]) }
]

describe('Xdr Encode Pass', () => {
  itParam(
    '${value.n}', // eslint-disable-line
    passTests, (value) => {
      const io = new BufferIO()
      value.t.write(io, enc)
      expect(io.finalize()).to.deep.equal(value.e)
    })
})

const badOpaque = new types.FixedOpaque(10)
badOpaque.length = 2

const badArray = new types.FixedArray(10)
badArray.length = 2

const failTests = [
  { n: 'Fixed Opaque Size', t: badOpaque },
  { n: 'Fixed Array Size', t: badArray }
]

describe('Xdr Encode Fail', () => {
  itParam(
    '${value.n}', // eslint-disable-line
    failTests, (value) => {
      const io = new BufferIO()
      expect(() => { value.t.write(io, enc) }).to.throw()
    })
})
