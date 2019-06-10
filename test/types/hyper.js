import { describe, it } from 'mocha'
import { expect } from 'chai'
import { EncodeReturn } from '../utils.js'

import Hyper from '../../src/types/hyper.js'

describe('Hyper constructor', () => {
  it('initialValue set', () => {
    const i1 = new Hyper(1)
    expect(i1.value).to.deep.equal(Buffer.from([0, 0, 0, 0, 0, 0, 0, 1]))

    const i2 = new Hyper('1')
    expect(i2.value).to.deep.equal(Buffer.from([0, 0, 0, 0, 0, 0, 0, 1]))
  })

  it('initialValue set 2s', () => {
    const i = new Hyper(-1)
    expect(i.value).to.deep.equal(Buffer.from([255, 255, 255, 255, 255, 255, 255, 255]))
  })
})

describe('Hyper read', () => {
  it('reads buffer', () => {
    const dec = EncodeReturn('Hyper', Buffer.from([1, 1, 1, 1, 1, 1, 1, 1]))
    const i = new Hyper()
    expect(i.read(null, dec)).to.deep.equal(Buffer.from([1, 1, 1, 1, 1, 1, 1, 1]))
    expect(i.value).to.deep.equal(Buffer.from([1, 1, 1, 1, 1, 1, 1, 1]))
  })
})

describe('Hyper write', () => {
  it('write passes value', () => {
    const enc = EncodeReturn('Hyper', Buffer.from([0, 0, 0, 0, 0, 0, 0, 1]))
    const io = {}
    const i = new Hyper(1)

    i.write(io, enc)
    expect(enc.Hyper.calledWith(Buffer.from([0, 0, 0, 0, 0, 0, 0, 1], io))).to.equal(true)
  })
})
