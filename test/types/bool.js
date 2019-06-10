import { describe, it } from 'mocha'
import { expect } from 'chai'
import { EncodeReturn } from '../utils.js'

import Bool from '../../src/types/bool.js'

describe('Bool constructor', () => {
  it('initialValue set', () => {
    const boolT1 = new Bool(true)
    const boolT2 = new Bool('true')
    const boolT3 = new Bool(1)
    const boolF1 = new Bool(false)
    const boolF2 = new Bool('false')

    expect(boolT1.value).to.equal(true)
    expect(boolT2.value).to.equal(true)
    expect(boolT3.value).to.equal(true)
    expect(boolF1.value).to.equal(false)
    expect(boolF2.value).to.equal(false)
  })
})

describe('Bool read', () => {
  it('reads false', () => {
    const decoder = EncodeReturn('Bool', false)
    const bool = new Bool()
    expect(bool.read(null, decoder)).to.equal(false)
    expect(bool.value).to.equal(false)
  })

  it('reads true', () => {
    const decoder = EncodeReturn('Bool', true)
    const bool = new Bool()
    expect(bool.read(null, decoder)).to.equal(true)
  })
})

describe('Bool write', () => {
  it('write passes value', () => {
    const encT = EncodeReturn('Bool', true)
    const encF = EncodeReturn('Bool', true)
    const boolT = new Bool(true)
    const boolF = new Bool(false)
    const io = {}

    boolT.write(io, encT)
    expect(encT.Bool.calledWith(true, io)).to.equal(true)

    boolF.write(io, encF)
    expect(encF.Bool.calledWith(false, io)).to.equal(true)
  })
})
