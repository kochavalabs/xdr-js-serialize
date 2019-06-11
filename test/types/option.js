import { describe, it } from 'mocha'
import { expect } from 'chai'
import { EncodeReturn } from '../utils.js'

import Option from '../../src/types/option.js'
import Int from '../../src/types/int.js'
import UInt from '../../src/types/uint.js'

describe('Option constructor', () => {
  it('initialValue set', () => {
    const f = new Option()
    expect(f.value).to.equal(null)
    expect(f.Type).to.equal(Int)
  })

  it('passed type', () => {
    const f = new Option(UInt)
    expect(f.value).to.equal(null)
    expect(f.Type).to.equal(UInt)
  })
})

describe('Option read', () => {
  it('reads buffer', () => {
    const dec = EncodeReturn('Option', new Int())
    const f = new Option()
    const io = {}
    expect(f.read(io, dec)).to.deep.equal(new Int())
    expect(f.value).to.deep.equal(new Int())
    expect(dec.Option.calledWith(Int, io)).to.equal(true)
  })
})

describe('Option write', () => {
  it('write passes value', () => {
    const enc = EncodeReturn('Option', null)
    const io = {}
    const i = new Option()

    i.write(io, enc)
    expect(enc.Option.calledWith(null, io)).to.equal(true)
  })
})
