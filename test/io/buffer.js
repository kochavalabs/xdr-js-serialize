import { describe, it } from 'mocha'
import { expect } from 'chai'

import BufferIO from '../../src/io/buffer.js'

const base64 = '9uZzPoEf1zsfABG7J6toIMio3VMY8eQnErkZTCURMu8/uwZNKkvmyBsjQBs/BWg'
const x256 = '3a547668e859fb7b112a1e2dd7efcb739176ab8cfd1d9f224847fce362ebd99c'

describe('BufferIO constructor', () => {
  it('basic', () => {
    const buff = new BufferIO()
    expect(buff._buffers).to.deep.equal([])
    expect(buff._buffIndex).to.equal(0)
    expect(buff._arrayIndex).to.equal(0)
  })
})

describe('BufferIO write', () => {
  it('basic', () => {
    const buff = new BufferIO()
    const buff1 = [0, 1, 2, 3]

    buff.write(buff1)
    buff.write(base64)
    buff.write(x256, 'hex')

    expect(buff._buffers).to.deep.equal([Buffer.from(buff1), Buffer.from(base64, 'base64'), Buffer.from(x256, 'hex')])
  })
})

describe('BufferIO read', () => {
  it('reads smaller than current buffer', () => {
    const buff = new BufferIO()
    let toRead = Buffer.alloc(3)
    buff.write([0, 1, 2, 3, 4])

    buff.read(toRead)

    expect(toRead).to.deep.equal(Buffer.from([0, 1, 2]))
  })

  it('multiple reads fit in buffer', () => {
    const buff = new BufferIO()
    let toRead1 = Buffer.alloc(3)
    let toRead2 = Buffer.alloc(4)
    buff.write([0, 1, 2, 3, 4, 5, 6, 7])

    buff.read(toRead1)
    buff.read(toRead2)

    expect(toRead1).to.deep.equal(Buffer.from([0, 1, 2]))
    expect(toRead2).to.deep.equal(Buffer.from([3, 4, 5, 6]))
  })

  it('throw if reading past buffer', () => {
    const buff = new BufferIO()
    let toRead = Buffer.alloc(10)
    buff.write([1, 2, 3])

    expect(() => { buff.read(toRead) }).to.throw()
  })

  it('read accross multiple buffers', () => {
    const buff = new BufferIO()
    let toRead = Buffer.alloc(10)
    buff.write([0, 1, 2, 3])
    buff.write([4, 5, 6, 7, 8, 9])

    buff.read(toRead)

    expect(toRead).to.deep.equal(Buffer.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]))
  })

  it('empty buffer read', () => {
    const buff = new BufferIO()
    let toRead = Buffer.alloc(0)

    buff.read(toRead)

    expect(toRead).to.deep.equal(Buffer.alloc(0))
  })
})

describe('BufferIO finalize', () => {
  it('finalize returns propper buffer', () => {
    const buff = new BufferIO()
    buff.write([0, 1, 2, 3])
    buff.write([4, 5])
    buff.write([6])
    buff.write([])
    buff.write([7, 8, 9, 10])
    buff.read(Buffer.alloc(3))

    const result = buff.finalize()

    expect(result).to.deep.equal(Buffer.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]))
  })

  it('read throws after finalization', () => {
    const buff = new BufferIO()
    buff.write([1, 2, 3])

    let toRead = Buffer.alloc(1)
    buff.finalize()

    expect(() => { buff.read(toRead) }).to.throw()
  })
})
