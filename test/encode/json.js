import { describe } from 'mocha'
import itParam from 'mocha-param'
import { expect } from 'chai'

import JsonEncode from '../../src/encode/json.js'
import BufferIO from '../../src/io/buffer.js'

import types from '../../src/types/types.js'

const enc = new JsonEncode()

const testVarArray = new types.VarArray(20)
testVarArray.values = [new types.Hyper(1), new types.Hyper(2)]

const padVOpaque = new types.VarOpaque(10)
padVOpaque.value = Buffer.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])

const noPadVOpaque = new types.VarOpaque(10)
noPadVOpaque.value = Buffer.from([0, 1, 2, 3, 4, 5, 6, 7])

const fixedOpaque = new types.FixedOpaque(4)
fixedOpaque.value = Buffer.from([0, 1, 2, 3])

const baseStr = '"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="'

const testEnum = new types.Enum({
  0: 'Zero',
  1: 'One',
  2: 'Two'
}, 2)

const testUnion = new types.Union(testEnum,
  {
    'Zero': () => { return new types.Int() },
    'One': () => { return new types.Int() },
    'Two': () => { return new types.Hyper() }
  }
)

const passTests = [
  { n: 'String', t: new types.Str('hello'), e: '"hello"' },
  { n: 'Opt Null', t: new types.Option(), e: '{"opt":0,"value":""}' },
  { n: 'Opt Val', t: new types.Option(types.Int, new types.Int(1)), e: '{"opt":1,"value":1}' },
  { n: 'UInt', t: new types.UInt(1), e: '1' },
  { n: 'Int', t: new types.Int(-1), e: '-1' },
  { n: 'Hyper', t: new types.Hyper(-1), e: '"-1"' },
  { n: 'UHyper', t: new types.UHyper(1), e: '"1"' },
  { n: 'Bool true', t: new types.Bool(true), e: 'true' },
  { n: 'Bool false', t: new types.Bool(false), e: 'false' },
  { n: 'Void', t: new types.Void(), e: '""' },
  { n: 'FixedOpaque Hex', t: fixedOpaque, e: '"00010203"' },
  { n: 'FixedOpaque Base64', t: new types.FixedOpaque(65), e: baseStr },
  { n: 'FixedArray Default', t: new types.FixedArray(), e: '[0]' },
  { n: 'FixedArray Basic', t: new types.FixedArray(2, () => new types.Hyper()), e: '["0","0"]' },
  { n: 'VarArray Default', t: new types.VarArray(), e: '[]' },
  { n: 'VarArray Basic', t: testVarArray, e: '["1","2"]' },
  { n: 'VarOpaque Default', t: new types.VarOpaque(), e: '""' },
  { n: 'VarOpaque Basic', t: padVOpaque, e: '"AAECAwQFBgcICQ=="' },
  { n: 'Float', t: new types.Float(-1), e: '-1' },
  { n: 'Double', t: new types.Double(1), e: '1' },
  { n: 'Union Default', t: new types.Union(), e: '{"enum":0,"value":""}' },
  { n: 'Union Basic', t: testUnion, e: '{"enum":2,"value":"0"}' },
  { n: 'Enum Default', t: new types.Enum(), e: '0' },
  { n: 'Enum Basic', t: testEnum, e: '2' },
  { n: 'Struct Default', t: new types.Struct(), e: '{}' },
  { n: 'Struct Basic', t: new types.Struct(['1', '2'], [new types.Int(1), new types.Hyper(2)]), e: '{"1":1,"2":"2"}' }
]

describe('Json Encode Pass', () => {
  itParam(
    '${value.n}', // eslint-disable-line
    passTests, (value) => {
      const io = new BufferIO()
      value.t.write(io, enc)
      expect(io.finalize().toString('ascii')).to.deep.equal(value.e)
    })
})
