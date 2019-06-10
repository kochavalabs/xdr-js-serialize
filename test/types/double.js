import { describe, it } from 'mocha'
import { expect } from 'chai'
import { EncodeReturn } from '../utils.js'

import Double from '../../src/types/double.js'

describe('Double constructor', () => {
  it('initialValue set', () => {
    const i1 = new Double(1.0)
    expect(i1.value).to.deep.equal(Buffer.from([63, 240, 0, 0, 0, 0, 0, 0]))
  })
})

describe('Double read', () => {
  it('reads buffer', () => {
    const dec = EncodeReturn('Double', Buffer.from([1, 1, 1, 1, 1, 1, 1, 1]))
    const i = new Double()
    expect(i.read(null, dec)).to.deep.equal(Buffer.from([1, 1, 1, 1, 1, 1, 1, 1]))
    expect(i.value).to.deep.equal(Buffer.from([1, 1, 1, 1, 1, 1, 1, 1]))
  })
})

describe('Double write', () => {
  it('write passes value', () => {
    const enc = EncodeReturn('Double', Buffer.from([0, 0, 0, 0, 0, 0, 0, 1]))
    const io = {}
    const i = new Double(1)

    i.write(io, enc)
    expect(enc.Double.calledWith(Buffer.from([63, 240, 0, 0, 0, 0, 0, 0], io))).to.equal(true)
  })
})
