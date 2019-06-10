import { describe, it } from 'mocha'
import { expect } from 'chai'
import { EncodeReturn } from '../utils.js'

import UInt from '../../src/types/uint.js'

describe('UInt constructor', () => {
  it('initialValue set', () => {
    const i = new UInt(1)
    expect(i.value).to.deep.equal(Buffer.from([0, 0, 0, 1]))
  })

  it('initialValue set 2s', () => {
    const i = new UInt(Math.pow(2, 32) - 1)
    expect(i.value).to.deep.equal(Buffer.from([255, 255, 255, 255]))
  })

  it('throws for negative', () => {
    expect(() => new UInt(-1)).to.throw()
  })
})

describe('UInt read', () => {
  it('reads buffer', () => {
    const dec = EncodeReturn('UInt', Buffer.from([1, 1, 1, 1]))
    const i = new UInt()
    expect(i.read(null, dec)).to.deep.equal(Buffer.from([1, 1, 1, 1]))
    expect(i.value).to.deep.equal(Buffer.from([1, 1, 1, 1]))
  })
})

describe('UInt write', () => {
  it('write passes value', () => {
    const enc = EncodeReturn('UInt', Buffer.from([0, 0, 0, 1]))
    const io = {}
    const i = new UInt(1)

    i.write(io, enc)
    expect(enc.UInt.calledWith(Buffer.from([0, 0, 0, 1], io))).to.equal(true)
  })
})
