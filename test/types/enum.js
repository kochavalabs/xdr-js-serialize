import { describe, it } from 'mocha'
import { expect } from 'chai'
import { EncodeReturn } from '../utils.js'

import Enum from '../../src/types/enum.js'

function getEnum () {
  return new Enum({
    0: 'Zero',
    1: 'One',
    2: 'Two',
    3: 'Three'
  }, 0)
}

describe('Enum constructor', () => {
  it('basic', () => {
    const e = getEnum()
    expect(e.value).to.deep.equal(0)

    const e2 = getEnum()
    e2.value = 3
    expect(e2.value).to.deep.equal(3)
  })
})

describe('Enum read', () => {
  it('reads buffer', () => {
    const dec = EncodeReturn('Enum', 1)
    const e = getEnum()
    expect(e.read(null, dec)).to.equal(1)
    expect(e.value).to.deep.equal(1)
  })

  it('throws when bad value read', () => {
    const dec = EncodeReturn('Enum', 10)
    const e = getEnum()
    expect(() => { e.read(null, dec) }).to.throw()
  })
})

describe('Enum write', () => {
  it('write passes value', () => {
    const enc = EncodeReturn('Enum', 1)
    const io = {}
    const e = getEnum()
    e.value = 3

    e.write(io, enc)
    expect(enc.Enum.calledWith(3, io)).to.equal(true)
  })
})

describe('Enum toString', () => {
  it('basic test', () => {
    const e = getEnum()
    expect(e.toString()).to.equal('Zero')
    e.value = 3
    expect(e.toString()).to.equal('Three')
  })

  it('throws', () => {
    const e = getEnum()
    e.value = 100
    expect(() => e.toString()).to.throw()
  })
})
