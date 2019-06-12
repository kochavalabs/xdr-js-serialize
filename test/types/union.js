import { describe, it } from 'mocha'
import { expect } from 'chai'
import { EncodeReturn } from '../utils.js'

import Union from '../../src/types/union.js'
import Int from '../../src/types/int.js'
import UInt from '../../src/types/uint.js'
import Enum from '../../src/types/enum.js'
import Void from '../../src/types/void.js'

function getEnum () {
  return new Enum(
    { 0: 'Zero',
      1: 'One',
      2: 'Two',
      3: 'Three'
    })
}

function getUnion () {
  return new Union(
    getEnum(),
    [Void, Int, Int, UInt]
  )
}

describe('Union constructor', () => {
  it('initial values set', () => {
    const u = new Union()
    expect(u.enum).to.deep.equal(new Enum())
    expect(u.enumTypes).to.deep.equal([Void])
    expect(u.value).to.deep.equal(new Void())
  })

  it('passed size and type', () => {
    const u = getUnion()
    expect(u.enum).to.deep.equal(getEnum())
    expect(u.enumTypes).to.deep.equal([Void, Int, Int, UInt])
    expect(u.value).to.deep.equal(new Void())
  })

  it('throws with bad values', () => {
    expect(() => { return new Union(getEnum()) }).to.throw()
  })
})

describe('Union read', () => {
  it('reads buffer', () => {
    const dec = EncodeReturn('Union', new UInt())
    const u = getUnion()
    const io = {}
    expect(u.read(io, dec)).to.deep.equal(new UInt())
    expect(u.value).to.deep.equal(new UInt())
    expect(dec.Union.calledWith(getEnum(), u.enumTypes, io)).to.equal(true)
  })
})

describe('Union write', () => {
  it('write passes value', () => {
    const enc = EncodeReturn('Union', [new Int()])
    const io = {}
    const u = getUnion()

    u.write(io, enc)
    expect(enc.Union.calledWith(getEnum(), new Void(), io)).to.equal(true)
  })
})
