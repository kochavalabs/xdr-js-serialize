import { describe, it } from 'mocha'
import { expect } from 'chai'
import { EncodeReturn } from '../utils.js'

import FixedOpaque from '../../src/types/fixed_opaque.js'

describe('FixedOpaque constructor', () => {
  it('initialValue set', () => {
    const f = new FixedOpaque()
    expect(f.value).to.deep.equal(Buffer.alloc(1))
    expect(f.length).to.equal(1)
  })

  it('passed size and type', () => {
    const f = new FixedOpaque(2)
    expect(f.value).to.deep.equal(Buffer.alloc(2))
    expect(f.length).to.equal(2)
  })
})

describe('FixedOpaque read', () => {
  it('reads buffer', () => {
    const dec = EncodeReturn('FixedOpaque', Buffer.from([1]))
    const f = new FixedOpaque()
    const io = {}
    expect(f.read(io, dec)).to.deep.equal(Buffer.from([1]))
    expect(f.value).to.deep.equal(Buffer.from([1]))
    expect(dec.FixedOpaque.calledWith(1, io)).to.equal(true)
  })
})

describe('FixedOpaque write', () => {
  it('write passes value', () => {
    const enc = EncodeReturn('FixedOpaque', Buffer.from([1]))
    const io = {}
    const i = new FixedOpaque()

    i.write(io, enc)
    expect(enc.FixedOpaque.calledWith(Buffer.alloc(1), 1, io)).to.equal(true)
  })
})
