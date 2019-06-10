import { describe, it } from 'mocha'
import { expect } from 'chai'
import { EncodeReturn } from '../utils.js'

import Float from '../../src/types/float.js'

describe('Float constructor', () => {
  it('initialValue set', () => {
    const i = new Float(1.0)
    expect(i.value).to.deep.equal(Buffer.from([63, 128, 0, 0]))
  })
})

describe('Float read', () => {
  it('reads buffer', () => {
    const dec = EncodeReturn('Float', Buffer.from([1, 1, 1, 1]))
    const i = new Float()
    expect(i.read(null, dec)).to.deep.equal(Buffer.from([1, 1, 1, 1]))
    expect(i.value).to.deep.equal(Buffer.from([1, 1, 1, 1]))
  })
})

describe('Float write', () => {
  it('write passes value', () => {
    const enc = EncodeReturn('Float', Buffer.from([0, 0, 0, 1]))
    const io = {}
    const i = new Float(1)

    i.write(io, enc)
    expect(enc.Float.calledWith(Buffer.from([63, 128, 0, 0], io))).to.equal(true)
  })
})
