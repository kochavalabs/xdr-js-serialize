import { describe, it } from 'mocha'
import { expect } from 'chai'
import { EncodeReturn } from '../utils.js'

import Str from '../../src/types/string.js'

describe('String constructor', () => {
  it('initialValue set', () => {
    const i1 = new Str(1)
    expect(i1.value).to.equal('1')

    const i2 = new Str('asdf')
    expect(i2.value).to.equal('asdf')
  })
})

describe('String read', () => {
  it('reads buffer', () => {
    const dec = EncodeReturn('Str', 'qwer')
    const i = new Str()
    expect(i.read(null, dec)).to.equal('qwer')
    expect(i.value).to.equal('qwer')
  })
})

describe('String write', () => {
  it('write passes value', () => {
    const enc = EncodeReturn('Str', 'asdf')
    const io = {}
    const i = new Str(1)

    i.write(io, enc)
    expect(enc.Str.calledWith('1', io)).to.equal(true)
  })
})
