import utils from '../utils.js'

class XdrEncode {
  Str (value, io) {
    const size = Buffer.alloc(4)
    size.writeUInt32BE(value.length)
    io.write(size)
    io.write(Buffer.from(value, 'ascii'))
    io.write(Buffer.alloc(utils.calculatePadding(value.length)))
  }
  Option (value, io) {
    if (value === null) {
      io.write(Buffer.from([0, 0, 0, 0]))
    } else {
      io.write(Buffer.from([0, 0, 0, 1]))
      value.write(io, this)
    }
  }
  UInt (value, io) {
    io.write(value)
  }
  UHyper (value, io) {
    io.write(value)
  }
  Int (value, io) {
    io.write(value)
  }
  FixedArray (values, length, io) {
    if (values.length !== length) {
      throw new Error(`FixedArray layngth did not match expected(${length}) actual ${values.length}`)
    }
    values.forEach((e) => { e.write(io, this) })
  }
  Hyper (value, io) {
    io.write(value)
  }
  Bool (value, io) {
    if (value) {
      io.write(Buffer.from([0, 0, 0, 1]))
    } else {
      io.write(Buffer.from([0, 0, 0, 0]))
    }
  }
  FixedOpaque (value, length, io) {
    if (value.length !== length) {
      throw new Error(`FixedOpaque layngth did not match expected(${length}) actual ${value.length}`)
    }
    io.write(value)
    io.write(Buffer.alloc(utils.calculatePadding(value.length)))
  }
  Void (io) {}
  VarArray (values, io) {
    const size = Buffer.alloc(4)
    size.writeUInt32BE(values.length)
    io.write(size)
    values.forEach((e) => { e.write(io, this) })
  }
  VarOpaque (value, io) {
    const size = Buffer.alloc(4)
    size.writeUInt32BE(value.length)
    io.write(size)
    io.write(value)
    io.write(Buffer.alloc(utils.calculatePadding(value.length)))
  }
  Float (value, io) {
    io.write(value)
  }
  Double (value, io) {
    io.write(value)
  }
  Union (enumT, value, io) {
    enumT.write(io, this)
    value.write(io, this)
  }
  Struct (keys, values, io) {
    values.forEach((e) => { e.write(io, this) })
  }
  Enum (value, io) {
    const enumVal = Buffer.alloc(4)
    enumVal.writeInt32BE(value)
    io.write(enumVal)
  }
}

export default XdrEncode
