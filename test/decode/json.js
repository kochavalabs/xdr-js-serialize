import { describe } from 'mocha'
import itParam from 'mocha-param'
import { expect } from 'chai'

import JsonDecode from '../../src/decode/json.js'
import BufferIO from '../../src/io/buffer.js'

import types from '../../src/types/types.js'

const dec = new JsonDecode()

const testEnum = new types.Enum({
  0: 'Zero',
  1: 'One',
  2: 'Two'
}, 2)

const passTests = [
  { n: 'String', t: new types.Str('', 7), io: '"hello"', e: 'hello' },
  { n: 'Option false', t: new types.Option(), io: '{"opt":0,"value":""}', e: null },
  { n: 'Option true', t: new types.Option(new types.Str()), io: '{"opt":1,"value":"qwer"}', e: new types.Str('qwer') },
  { n: 'UInt', t: new types.UInt(), io: '3', e: Buffer.from([0, 0, 0, 3]) },
  { n: 'Int', t: new types.Int(), io: '-11', e: Buffer.from([255, 255, 255, 0xf5]) },
  { n: 'Hyper', t: new types.Hyper(), io: '"2"', e: Buffer.from([0, 0, 0, 0, 0, 0, 0, 2]) },
  { n: 'UHyper', t: new types.UHyper(), io: '"4"', e: Buffer.from([0, 0, 0, 0, 0, 0, 0, 4]) },
  { n: 'Bool false', t: new types.Bool(), io: 'false', e: false },
  { n: 'Bool true', t: new types.Bool(), io: 'true', e: true },
  { n: 'FixedArray Default', t: new types.FixedArray(), io: '[100]', e: [new types.Int(100)] },
  { n: 'FixedArray Basic', t: new types.FixedArray(3, types.Int), io: '[1,2,33]', e: [new types.Int(1), new types.Int(2), new types.Int(33)] },
  { n: 'FixedArray Empty', t: new types.FixedArray(0, types.UInt), io: '[]', e: [] },
  { n: 'FixedOpaque No Padding', t: new types.FixedOpaque(8), io: '"0001020304050607"', e: Buffer.from([0, 1, 2, 3, 4, 5, 6, 7]) },
  { n: 'FixedOpaque Padding', t: new types.FixedOpaque(9), io: '"000000000000000000"', e: Buffer.alloc(9) },
  { n: 'Void', t: new types.Void(), io: '""', e: null },
  { n: 'VarArray Default', t: new types.VarArray(), io: '[100]', e: [new types.Int(100)] },
  { n: 'VarArray Basic', t: new types.VarArray(3, types.Int), io: '[6,22,-123]', e: [new types.Int(6), new types.Int(22), new types.Int(-123)] },
  { n: 'VarOpaque', t: new types.VarOpaque(8), io: '"AAECAwQFBgc="', e: Buffer.from([0, 1, 2, 3, 4, 5, 6, 7]) },
  { n: 'Float', t: new types.Float(), io: '1.0', e: Buffer.from([0x3f, 0x80, 0, 0]) },
  { n: 'Double', t: new types.Double(), io: '1.0', e: Buffer.from([0x3f, 0xf0, 0, 0, 0, 0, 0, 0]) },
  { n: 'Union Default', t: new types.Union(), io: '{"enum":0,"value":""}', e: new types.Void() },
  { n: 'Union Basic', t: new types.Union(testEnum, [new types.Int(), new types.Int(), new types.Hyper()]), io: '{"enum":2,"value":"0"}', e: new types.Hyper(0) },
  { n: 'Enum Default', t: new types.Enum(), io: '0', e: 0 },
  { n: 'Enum Basic', t: testEnum, io: '2', e: 2 },
  { n: 'Struct Default', t: new types.Struct(), io: '{}', e: [] },
  { n: 'Struct Basic', t: new types.Struct(['1', '2'], [new types.Int(1), new types.Hyper(2)]), io: '{"1":-3,"2":"2"}', e: [new types.Int(-3), new types.Hyper(2)] }
]

describe('Json Decode Pass', () => {
  itParam(
    '${value.n}', // eslint-disable-line
    passTests, (value) => {
      const io = new BufferIO()
      io.write(Buffer.from(value.io), 'ascii')
      const result = value.t.read(io, dec)
      if (!result) {
        expect(result).to.equal(value.e)
      } else {
        expect(result).to.deep.equal(value.e)
      }
      expect(() => { io.read(Buffer.alloc(1)) }).to.throw()
    })
})
