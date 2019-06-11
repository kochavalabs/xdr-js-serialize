import { describe, it } from 'mocha'
import { expect } from 'chai'
import { EncodeReturn } from '../utils.js'

import Void from '../../src/types/void.js'

describe('Void read', () => {
  it('reads buffer', () => {
    const dec = EncodeReturn('Void', null)
    const i = new Void()
    expect(i.read(null, dec)).to.equal(null)
  })
})

describe('Void write', () => {
  it('write passes value', () => {
    const enc = EncodeReturn('Void', Buffer.from([0, 0, 0, 1]))
    const io = {}
    const i = new Void()

    i.write(io, enc)
    expect(enc.Void.calledWith(io)).to.equal(true)
  })
})
