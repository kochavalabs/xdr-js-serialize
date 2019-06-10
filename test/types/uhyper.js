import { describe, it } from 'mocha'
import { expect } from 'chai'
import { EncodeReturn } from '../utils.js'

import UHyper from '../../src/types/uhyper.js'

describe('UHyper constructor', () => {
  it('initialValue set', () => {
    const i1 = new UHyper(1)
    expect(i1.value).to.deep.equal(Buffer.from([0, 0, 0, 0, 0, 0, 0, 1]))

    const i2 = new UHyper('1')
    expect(i2.value).to.deep.equal(Buffer.from([0, 0, 0, 0, 0, 0, 0, 1]))
  })

  it('initialValue set 2s', () => {
    const i = new UHyper(Math.pow(2, 64) - 1)
    expect(i.value).to.deep.equal(Buffer.from([255, 255, 255, 255, 255, 255, 255, 255]))
  })

  it('throws', () => {
    expect(() => new UHyper(-1)).to.throw()
  })
})

describe('UHyper read', () => {
  it('reads buffer', () => {
    const dec = EncodeReturn('UHyper', Buffer.from([1, 1, 1, 1, 1, 1, 1, 1]))
    const i = new UHyper()
    expect(i.read(null, dec)).to.deep.equal(Buffer.from([1, 1, 1, 1, 1, 1, 1, 1]))
    expect(i.value).to.deep.equal(Buffer.from([1, 1, 1, 1, 1, 1, 1, 1]))
  })
})

describe('UHyper write', () => {
  it('write passes value', () => {
    const enc = EncodeReturn('UHyper', Buffer.from([0, 0, 0, 0, 0, 0, 0, 1]))
    const io = {}
    const i = new UHyper(1)

    i.write(io, enc)
    expect(enc.UHyper.calledWith(Buffer.from([0, 0, 0, 0, 0, 0, 0, 1], io))).to.equal(true)
  })
})
