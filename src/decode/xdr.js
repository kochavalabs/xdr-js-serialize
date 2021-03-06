import utils from '../utils.js'
const trueBuff = Buffer.from([0, 0, 0, 1])
const falseBuff = Buffer.from([0, 0, 0, 0])

class XdrDecode {
  Str (io) {
    const size = utils.readIO(4, io).readUInt32BE(0)
    const str = Buffer.alloc(size)
    io.read(str)
    utils.readIO(utils.calculatePadding(size), io)
    return str.toString('ascii')
  }

  Option (type, io) {
    const opt = utils.readIO(4, io)
    if (opt.equals(falseBuff)) {
      return null
    } else if (opt.equals(trueBuff)) {
      type.read(io, this)
      return type
    } else {
      throw new Error('Invalid opt identifier: ' + opt)
    }
  }

  UInt (io) { return utils.readIO(4, io) }

  UHyper (io) { return utils.readIO(8, io) }

  Int (io) { return utils.readIO(4, io) }

  Hyper (io) { return utils.readIO(8, io) }

  FixedArray (length, typeFunc, io) {
    const result = []
    for (let i = 0; i < length; i++) {
      const toRead = typeFunc()
      toRead.read(io, this)
      result.push(toRead)
    }
    return result
  }
  FixedOpaque (length, io) {
    const result = Buffer.alloc(length)
    io.read(result)
    utils.readIO(utils.calculatePadding(length), io)
    return result
  }
  VarArray (typeFunc, io) {
    const length = utils.readIO(4, io).readUInt32BE(0)
    return this.FixedArray(length, typeFunc, io)
  }
  VarOpaque (io) {
    const length = utils.readIO(4, io).readUInt32BE(0)
    return this.FixedOpaque(length, io)
  }
  Bool (io) {
    const opt = utils.readIO(4, io)
    if (opt.equals(falseBuff)) {
      return false
    } else if (opt.equals(trueBuff)) {
      return true
    } else {
      throw new Error('Invalid bool identifier: ' + opt)
    }
  }
  Void () {}
  Float (io) { return utils.readIO(4, io) }
  Double (io) { return utils.readIO(8, io) }
  Union (enumT, enumTypes, io) {
    enumT.read(io, this)
    const result = enumTypes[enumT.toString()]()
    result.read(io, this)
    return result
  }
  Struct (keys, values, io) {
    values.forEach((v) => { v.read(io, this) })
  }
  Enum (io) {
    const val = utils.readIO(4, io).readInt32BE(0)
    return val
  }
}

export default XdrDecode
