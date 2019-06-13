import { describe } from 'mocha'
import itParam from 'mocha-param'
import { expect } from 'chai'

import XdrDecode from '../../src/decode/xdr.js'
import BufferIO from '../../src/io/buffer.js'

import types from '../../src/types/types.js'

const dec = new XdrDecode()

const passTests = [
  { n: 'String', t: new types.Str('', 7), io: Buffer.from([0, 0, 0, 5, 104, 101, 108, 108, 111, 0, 0, 0]), e: 'hello' },
  { n: 'Option false', t: new types.Option(), io: Buffer.alloc(4), e: null },
  { n: 'Option true', t: new types.Option(), io: Buffer.from([0, 0, 0, 1, 0, 0, 0, 3]), e: new types.Int(3) }
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
    })
})

const failTests = [
  { n: 'String too big', t: new types.Str('', 1), io: Buffer.from([0, 0, 0, 5, 104, 101, 108, 108, 111, 0, 0, 0]) },
  { n: 'Option bad value', t: new types.Option(), io: Buffer.from([0, 1, 0, 0]) },
  { n: 'Option bad value deep', t: new types.Option(), io: Buffer.from([0, 0, 0, 2]) }
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
