import { describe, it } from 'mocha'
import { expect } from 'chai'
import { EncodeReturn } from '../utils.js'

import Int from '../../src/types/int.js'

describe('Int constructor', () => {
  it('initialValue set', () => {
    const i = new Int(1)
    expect(i.value).to.deep.equal(Buffer.from([0, 0, 0, 1]))
  })

  it('initialValue set 2s', () => {
    const i = new Int(-1)
    expect(i.value).to.deep.equal(Buffer.from([255, 255, 255, 255]))
  })
})

describe('Int read', () => {
  it('reads buffer', () => {
    const dec = EncodeReturn('Int', Buffer.from([1, 1, 1, 1]))
    const i = new Int()
    expect(i.read(null, dec)).to.deep.equal(Buffer.from([1, 1, 1, 1]))
    expect(i.value).to.deep.equal(Buffer.from([1, 1, 1, 1]))
  })
})

describe('Int write', () => {
  it('write passes value', () => {
    const enc = EncodeReturn('Int', Buffer.from([0, 0, 0, 1]))
    const io = {}
    const i = new Int(1)

    i.write(io, enc)
    expect(enc.Int.calledWith(Buffer.from([0, 0, 0, 1], io))).to.equal(true)
  })
})
