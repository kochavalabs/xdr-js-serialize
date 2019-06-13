const trueBuff = Buffer.from([0, 0, 0, 1])
const falseBuff = Buffer.from([0, 0, 0, 0])

function readIO (size, io) {
  const result = Buffer.alloc(size)
  io.read(result)
  return result
}

class XdrDecode {
  Str (io) {
    const size = Buffer.alloc(4)
    io.read(size)
    const str = Buffer.alloc(size.readUInt32BE())
    io.read(str)
    return str.toString('ascii')
  }
  Option (Type, io) {
    const opt = Buffer.alloc(4)
    io.read(opt)
    if (opt.equals(falseBuff)) {
      return null
    } else if (opt.equals(trueBuff)) {
      const result = new Type()
      result.read(io, this)
      console.log(result)
      return result
    } else {
      throw new Error('Invalid opt identifier: ' + opt)
    }
  }
  UInt (io) { return readIO(4, io) }
  UHyper (io) { return readIO(8, io) }
  Int (io) { return readIO(4, io) }
  FixedArray (length, Type, io) {}
  Hyper (io) { return readIO(8, io) }
  Bool (io) {}
  FixedOpaque (length, io) {}
  Void () {}
  VarArray (Type, io) {}
  VarOpaque (io) {}
  Float (io) {}
  Double (io) {}
  Union (enumT, enumTypes, io) {}
  Struct (keys, values, io) {}
  Enum (io) {}
}

export default XdrDecode
