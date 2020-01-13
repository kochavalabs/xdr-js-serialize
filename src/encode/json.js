import Long from 'long'
import types from '../types/types.js'

function writeCSV (values, io, enc) {
  if (values.length === 1) {
    values[0].write(io, enc)
  } else if (values.length > 1) {
    for (let i = 0; i < values.length - 1; i++) {
      values[i].write(io, enc)
      io.write(Buffer.from(',', 'ascii'))
    }
    values[values.length - 1].write(io, enc)
  }
}

class JsonEncode {
  Str (value, io) {
    io.write(Buffer.from(`${JSON.stringify(value)}`, 'ascii'))
  }
  Option (value, io) {
    let opt = 0
    let optVal = new types.Void()
    if (value !== null) {
      opt = 1
      optVal = value
    }
    io.write(Buffer.from(`{"opt":${opt},"value":`))
    optVal.write(io, this)
    io.write(Buffer.from('}', 'ascii'))
  }
  UInt (value, io) {
    const result = value.readUInt32BE(0)
    io.write(Buffer.from(`${result}`, 'ascii'))
  }
  UHyper (value, io) {
    const toWrite = Long.fromBytesBE(value, true).toString()
    io.write(Buffer.from(`"${toWrite}"`, 'ascii'))
  }
  Hyper (value, io) {
    const toWrite = Long.fromBytesBE(value, false).toString()
    io.write(Buffer.from(`"${toWrite}"`, 'ascii'))
  }
  Int (value, io) {
    const result = value.readInt32BE(0)
    io.write(Buffer.from(`${result}`, 'ascii'))
  }
  Bool (value, io) {
    if (value) {
      io.write(Buffer.from('true', 'ascii'))
    } else {
      io.write(Buffer.from('false', 'ascii'))
    }
  }
  FixedOpaque (values, length, io) {
    if (values.length !== length) {
      throw new Error(`Fixed opaque values(${values.length}) and length(${length}) do not match.`)
    }
    let stringValue = ''
    if (values.length <= 64) {
      stringValue = values.toString('hex')
    } else {
      stringValue = values.toString('base64')
    }
    io.write(Buffer.from(`"${stringValue}"`, 'ascii'))
  }
  FixedArray (values, length, io) {
    if (values.length !== length) {
      throw new Error(`Fixed array values(${values.length}) and length(${length}) do not match.`)
    }
    io.write(Buffer.from('[', 'ascii'))
    writeCSV(values, io, this)
    io.write(Buffer.from(']', 'ascii'))
  }
  Void (io) { io.write(Buffer.from('""', 'ascii')) }
  VarArray (values, io) {
    this.FixedArray(values, values.length, io)
  }
  VarOpaque (values, io) {
    const stringValue = values.toString('base64')
    io.write(Buffer.from(`"${stringValue}"`, 'ascii'))
  }
  Float (value, io) {
    io.write(Buffer.from(value.readFloatBE(0).toString(), 'ascii'))
  }
  Double (value, io) {
    io.write(Buffer.from(value.readDoubleBE(0).toString(), 'ascii'))
  }
  Union (enumT, value, io) {
    io.write(Buffer.from('{"enum":', 'ascii'))
    enumT.write(io, this)
    io.write(Buffer.from(',"value":', 'ascii'))
    value.write(io, this)
    io.write(Buffer.from('}', 'ascii'))
  }
  Struct (keys, values, io) {
    io.write(Buffer.from('{', 'ascii'))
    if (values.length === 1) {
      io.write(Buffer.from(`"${keys[0]}":`, 'ascii'))
      values[0].write(io, this)
    } else if (values.length > 1) {
      for (let i = 0; i < values.length - 1; i++) {
        const key = keys[i]
        io.write(Buffer.from(`"${key}":`, 'ascii'))
        values[i].write(io, this)
        io.write(Buffer.from(',', 'ascii'))
      }
      const key = keys[values.length - 1]
      io.write(Buffer.from(`"${key}":`, 'ascii'))
      values[values.length - 1].write(io, this)
    }
    io.write(Buffer.from('}', 'ascii'))
  }
  Enum (value, io) {
    io.write(Buffer.from(value.toString(), 'ascii'))
  }
}

export default JsonEncode
