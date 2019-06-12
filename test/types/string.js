import { describe, it } from 'mocha'
import { expect } from 'chai'
import { EncodeReturn } from '../utils.js'

import Str from '../../src/types/string.js'

describe('String constructor', () => {
  it('initialValue set', () => {
    const str1 = new Str(1)
    expect(str1.value).to.equal('1')

    const str2 = new Str('asdf')
    expect(str2.value).to.equal('asdf')
  })

  it('throws if too long', () => {
    expect(() => { return new Str('asdf', 1) }).to.throw()
  })
})

describe('String read', () => {
  it('reads buffer', () => {
    const dec = EncodeReturn('Str', 'qwer')
    const str = new Str()
    expect(str.read(null, dec)).to.equal('qwer')
    expect(str.value).to.equal('qwer')
  })

  it('throws if read too long', () => {
    const str = new Str('asdf', 5)
    const dec = EncodeReturn('Str', 'qwerqwerqwer')
    expect(() => { str.read(null, dec) }).to.throw()
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
