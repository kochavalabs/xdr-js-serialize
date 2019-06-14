import { describe, it } from 'mocha'
import { expect } from 'chai'
import { EncodeReturn } from '../utils.js'

import FixedArray from '../../src/types/fixed_array.js'
import Int from '../../src/types/int.js'
import UInt from '../../src/types/uint.js'

describe('FixedArray constructor', () => {
  it('initialValue set', () => {
    const f = new FixedArray()
    expect(f.values).to.deep.equal([new Int()])
    expect(f.Type).to.equal(Int)
    expect(f.length).to.equal(1)
  })

  it('passed size and type', () => {
    const f = new FixedArray(2, UInt)
    expect(f.values).to.deep.equal([new UInt(), new UInt()])
    expect(f.Type).to.equal(UInt)
    expect(f.length).to.equal(2)
  })
})

describe('FixedArray read', () => {
  it('reads buffer', () => {
    const dec = EncodeReturn('FixedArray', Buffer.from([1, 1, 1, 1]))
    const f = new FixedArray()
    const io = {}
    expect(f.read(io, dec)).to.deep.equal(Buffer.from([1, 1, 1, 1]))
    expect(f.values).to.deep.equal(Buffer.from([1, 1, 1, 1]))
    expect(dec.FixedArray.calledWith(1, Int, io)).to.equal(true)
  })
})

describe('FixedArray write', () => {
  it('write passes value', () => {
    const enc = EncodeReturn('FixedArray', [new Int()])
    const io = {}
    const i = new FixedArray()

    i.write(io, enc)
    expect(enc.FixedArray.calledWith([new Int()], 1, io)).to.equal(true)
  })
})
