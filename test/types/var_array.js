import { describe, it } from 'mocha'
import { expect } from 'chai'
import { EncodeReturn } from '../utils.js'

import VarArray from '../../src/types/var_array.js'
import Int from '../../src/types/int.js'
import UInt from '../../src/types/uint.js'

let newInt = () => new Int()
let newUInt = () => new UInt()

describe('VarArray constructor', () => {
  it('initialValue set', () => {
    const v = new VarArray(1, newInt)
    expect(v.values).to.deep.equal([])
    expect(v.typeFunc).to.equal(newInt)
    expect(v.maxLength).to.equal(1)
  })

  it('passed size and type', () => {
    const v = new VarArray(2, newUInt)
    expect(v.values).to.deep.equal([])
    expect(v.typeFunc).to.equal(newUInt)
    expect(v.maxLength).to.equal(2)
  })
})

describe('VarArray read', () => {
  it('reads buffer', () => {
    const dec = EncodeReturn('VarArray', [new Int()])
    const v = new VarArray(1, newInt)
    const io = {}
    expect(v.read(io, dec)).to.deep.equal([new Int()])
    expect(v.values).to.deep.equal([new Int()])
    expect(dec.VarArray.calledWith(newInt, io)).to.equal(true)
  })

  it('length throws', () => {
    const dec = EncodeReturn('VarOpaque', [new Int(), new Int()])
    const v = new VarArray()
    const io = {}
    expect(() => { v.read(io, dec) }).to.throw()
  })
})

describe('VarArray write', () => {
  it('write passes value', () => {
    const enc = EncodeReturn('VarArray', [new Int()])
    const io = {}
    const f = new VarArray()

    f.write(io, enc)
    expect(enc.VarArray.calledWith([], io)).to.equal(true)
  })
})
