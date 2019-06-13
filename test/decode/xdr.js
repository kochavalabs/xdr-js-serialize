import { describe } from 'mocha'
import itParam from 'mocha-param'
import { expect } from 'chai'

import XdrDecode from '../../src/decode/xdr.js'
import BufferIO from '../../src/io/buffer.js'

import types from '../../src/types/types.js'

const dec = new XdrDecode()

const testEnum = new types.Enum({
  0: 'Zero',
  1: 'One',
  2: 'Two'
}, 2)

const passTests = [
  { n: 'String', t: new types.Str('', 7), io: Buffer.from([0, 0, 0, 5, 104, 101, 108, 108, 111, 0, 0, 0]), e: 'hello' },
  { n: 'Option false', t: new types.Option(), io: Buffer.alloc(4), e: null },
  { n: 'Option true', t: new types.Option(), io: Buffer.from([0, 0, 0, 1, 0, 0, 0, 3]), e: new types.Int(3) },
  { n: 'UInt', t: new types.UInt(), io: Buffer.from([0, 0, 0, 1]), e: Buffer.from([0, 0, 0, 1]) },
  { n: 'Int', t: new types.Int(), io: Buffer.from([0, 0, 0, 1]), e: Buffer.from([0, 0, 0, 1]) },
  { n: 'Hyper', t: new types.Hyper(), io: Buffer.from([0, 0, 0, 0, 0, 0, 0, 1]), e: Buffer.from([0, 0, 0, 0, 0, 0, 0, 1]) },
  { n: 'UHyper', t: new types.UHyper(), io: Buffer.from([0, 0, 0, 0, 0, 0, 0, 1]), e: Buffer.from([0, 0, 0, 0, 0, 0, 0, 1]) },
  { n: 'Bool false', t: new types.Bool(), io: Buffer.alloc(4), e: false },
  { n: 'Bool true', t: new types.Bool(), io: Buffer.from([0, 0, 0, 1]), e: true },
  { n: 'FixedArray Default', t: new types.FixedArray(), io: Buffer.from([0, 0, 0, 1]), e: [new types.Int(1)] },
  { n: 'FixedArray Basic', t: new types.FixedArray(3, types.UInt), io: Buffer.from([0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1]), e: [new types.Int(1), new types.Int(1), new types.Int(1)] },
  { n: 'FixedOpaque No Padding', t: new types.FixedOpaque(8), io: Buffer.from([0, 1, 2, 3, 4, 5, 6, 7]), e: Buffer.from([0, 1, 2, 3, 4, 5, 6, 7]) },
  { n: 'FixedOpaque Padding', t: new types.FixedOpaque(9), io: Buffer.alloc(12), e: Buffer.alloc(9) },
  { n: 'Void', t: new types.Void(), io: Buffer.alloc(0), e: null },
  { n: 'VarArray Default', t: new types.VarArray(), io: Buffer.from([0, 0, 0, 1, 0, 0, 0, 1]), e: [new types.Int(1)] },
  { n: 'VarArray Basic', t: new types.VarArray(3, types.UInt), io: Buffer.from([0, 0, 0, 3, 0, 0, 0, 1, 0, 0, 0, 2, 0, 0, 0, 1]), e: [new types.Int(1), new types.Int(2), new types.Int(1)] },
  { n: 'VarOpaque No Padding', t: new types.VarOpaque(8), io: Buffer.from([0, 0, 0, 8, 0, 1, 2, 3, 4, 5, 6, 7]), e: Buffer.from([0, 1, 2, 3, 4, 5, 6, 7]) },
  { n: 'VarOpaque Padding', t: new types.VarOpaque(2), io: Buffer.from([0, 0, 0, 2, 1, 2, 0, 0]), e: Buffer.from([1, 2]) },
  { n: 'Float', t: new types.Float(), io: Buffer.from([0, 0, 0, 1]), e: Buffer.from([0, 0, 0, 1]) },
  { n: 'Double', t: new types.Double(), io: Buffer.from([0, 0, 0, 0, 0, 0, 0, 1]), e: Buffer.from([0, 0, 0, 0, 0, 0, 0, 1]) },
  { n: 'Union Default', t: new types.Union(), io: Buffer.from([0, 0, 0, 0]), e: new types.Void() },
  { n: 'Union Basic', t: new types.Union(testEnum, [types.Int, types.Int, types.Int]), io: Buffer.from([0, 0, 0, 2, 0, 0, 0, 4]), e: new types.Int(4) },
  { n: 'Enum Default', t: new types.Enum(), io: Buffer.alloc(4), e: 0 },
  { n: 'Enum Basic', t: testEnum, io: Buffer.from([0, 0, 0, 2]), e: 2 },
  { n: 'Struct Default', t: new types.Struct(), io: Buffer.alloc(0), e: [] },
  { n: 'Struct Basic', t: new types.Struct(['1', '2'], [new types.Int(), new types.UInt()]), io: Buffer.from([0, 0, 0, 2, 0, 0, 0, 4]), e: [new types.Int(2), new types.UInt(4)] }
]

describe('Xdr Encode Pass', () => {
  itParam(
    '${value.n}', // eslint-disable-line
    passTests, (value) => {
      const io = new BufferIO()
      io.write(value.io)
      const result = value.t.read(io, dec)
      if (!result) {
        expect(result).to.equal(value.e)
      } else {
        expect(result).to.deep.equal(value.e)
      }
      expect(() => { io.read(Buffer.alloc(1)) }).to.throw()
    })
})

const failTests = [
  { n: 'String too big', t: new types.Str('', 1), io: Buffer.from([0, 0, 0, 5, 104, 101, 108, 108, 111, 0, 0, 0]) },
  { n: 'Option bad value', t: new types.Option(), io: Buffer.from([0, 1, 0, 0]) },
  { n: 'Option bad value deep', t: new types.Option(), io: Buffer.from([0, 0, 0, 2]) },
  { n: 'Bool bad value', t: new types.Bool(), io: Buffer.from([0, 1, 0, 0]) },
  { n: 'Bool bad value deep', t: new types.Bool(), io: Buffer.from([0, 0, 0, 2]) },
  { n: 'FixedArray Wrong value', t: new types.FixedArray(1, types.Str), io: Buffer.from([0, 0, 0, 1]) },
  { n: 'FixedOpaque No Padding', t: new types.FixedOpaque(9), io: Buffer.alloc(9) },
  { n: 'VarArray Bad Length', t: new types.VarArray(100), io: Buffer.from([2, 1, 2, 3, 4, 5]) },
  { n: 'VarOpaque Bad Length', t: new types.VarOpaque(100), io: Buffer.from([9, 1, 2]) },
  { n: 'Enum Bad', t: new types.Enum(), io: Buffer.from([0, 0, 0, 1]) },
  { n: 'Struct Bad', t: new types.Struct(['1', '2'], [new types.Int(), new types.UInt()]), io: Buffer.from([0, 0, 0, 2, 0, 0, 0]) }
]

describe('Xdr Encode Fail', () => {
  itParam(
    '${value.n}', // eslint-disable-line
    failTests, (value) => {
      const io = new BufferIO()
      io.write(value.io)
      expect(() => { value.t.read(io, dec) }).to.throw()
    })
})
