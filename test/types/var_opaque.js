import { describe, it } from 'mocha'
import { expect } from 'chai'
import { EncodeReturn } from '../utils.js'

import VarOpaque from '../../src/types/var_opaque.js'

describe('VarOpaque constructor', () => {
  it('initialValue set', () => {
    const v = new VarOpaque()
    expect(v.value).to.deep.equal(Buffer.alloc(0))
    expect(v.maxLength).to.equal(1)
  })

  it('passed size and type', () => {
    const v = new VarOpaque(2)
    expect(v.value).to.deep.equal(Buffer.alloc(0))
    expect(v.maxLength).to.equal(2)
  })
})

describe('VarOpaque read', () => {
  it('reads buffer', () => {
    const dec = EncodeReturn('VarOpaque', Buffer.alloc(1))
    const v = new VarOpaque()
    const io = {}
    expect(v.read(io, dec)).to.deep.equal(Buffer.alloc(1))
    expect(v.value).to.deep.equal(Buffer.alloc(1))
    expect(dec.VarOpaque.calledWith(io)).to.equal(true)
  })

  it('length throws', () => {
    const dec = EncodeReturn('VarOpaque', Buffer.alloc(2))
    const v = new VarOpaque()
    const io = {}
    expect(() => { v.read(io, dec) }).to.throw()
  })
})

describe('VarOpaque write', () => {
  it('write passes value', () => {
    const enc = EncodeReturn('VarOpaque', Buffer.alloc(1))
    const io = {}
    const v = new VarOpaque()

    v.write(io, enc)
    expect(enc.VarOpaque.calledWith(Buffer.alloc(0), io)).to.equal(true)
  })
})
