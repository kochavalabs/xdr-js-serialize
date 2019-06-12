import { describe, it } from 'mocha'
import { expect } from 'chai'
import { EncodeReturn } from '../utils.js'

import Struct from '../../src/types/struct.js'
import Int from '../../src/types/int.js'
import UInt from '../../src/types/uint.js'

function getStruct () {
  return new Struct(
    ['one', 'two', 'three'],
    [new UInt(), new Int(), new UInt()]
  )
}

describe('Struct constructor', () => {
  it('initial values set', () => {
    const s = new Struct()
    expect(s.values).to.deep.equal([])
    expect(s.keys).to.deep.equal([])
  })

  it('passed size and type', () => {
    const s = getStruct()
    expect(s.values).to.deep.equal([new UInt(), new Int(), new UInt()])
    expect(s.keys).to.deep.equal(['one', 'two', 'three'])
  })
})

describe('Struct read', () => {
  it('reads buffer', () => {
    const dec = EncodeReturn('Struct', [new Int(), new Int(), new Int()])
    const s = getStruct()
    const io = {}
    expect(s.read(io, dec)).to.deep.equal([new Int(), new Int(), new Int()])
    expect(s.values).to.deep.equal([new Int(), new Int(), new Int()])
    expect(dec.Struct.calledWith(s.keys, io)).to.equal(true)
  })

  it('throws too few values', () => {
    const dec = EncodeReturn('Struct', [new Int(), new Int()])
    const s = getStruct()
    expect(() => s.read(null, dec)).to.throw()
  })

  it('throws too many values', () => {
    const dec = EncodeReturn('Struct', [new Int(), new Int(), new Int(), new Int()])
    const s = getStruct()
    expect(() => s.read(null, dec)).to.throw()
  })
})

describe('Struct write', () => {
  it('write passes value', () => {
    const enc = EncodeReturn('Struct', [new Int()])
    const io = {}
    const s = getStruct()

    s.write(io, enc)
    expect(enc.Struct.calledWith(s.keys, s.values, io)).to.equal(true)
  })
})
