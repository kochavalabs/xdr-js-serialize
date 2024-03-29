import BufferIO from '../io/buffer.js'
import Long from 'long'

const quote = 34
const esc = 92
const lBrace = 123
const rBrace = 125
const lBracket = 91
const rBracket = 93
const comma = 44
const colon = 58

function scanFullStruct (io) {
  let lBrac = 0
  let rBrac = 0
  return io.scanRead((c) => {
    if (c === lBrace) lBrac++
    if (c === rBrace) rBrac++
    if (lBrac === rBrac && lBrac + rBrac > 0) {
      return true
    }
    return false
  })
}

function scanQuotes (io) {
  let skip = 0
  let prev1 = 0
  let prev2 = 0
  return io.scanRead((c) => {
    if (c === quote && prev1 !== esc && prev2 !== esc) skip++
    if (skip === 2) {
      return true
    }
    prev2 = prev1
    prev2 = c
    return false
  }).toString('ascii').replace(/(^")|("$)|(\\)/g, '')
}

function scanChar (io, chr) {
  return io.scanRead((c) => c === chr)
}

// Scan up to the designated character or "null"
// returns true if null was found, false otherwise
function scanCharOrNull (io, chr) {
  let text = ''

  let found = io.scanRead((c) => {
    switch (c) {
      case chr: // Found character
        return true
      case 110: // n
        text += 'n'
        return false
      case 117: // u
        text += 'u'
        return false
      case 108: // l
        if (text === 'nul') {
          return true
        }
        text += 'l'
        return false
      default:
        return false
    }
  }).toString()

  if (found === 'null') {
    return true
  }

  return false
}

function scanNumber (io) {
  return io.scanRead((c) => {
    switch (c) {
      case 45:
        return false
      case 46:
        return false
      case 48:
        return false
      case 49:
        return false
      case 50:
        return false
      case 51:
        return false
      case 52:
        return false
      case 53:
        return false
      case 54:
        return false
      case 55:
        return false
      case 56:
        return false
      case 57:
        return false
      default:
        return true
    }
  }, false)
}

function scanList (io) {
  return io.scanRead((c) => {
    return (c === comma || c === rBracket)
  })
}

function scanDict (io) {
  return io.scanRead((c) => {
    return (c === comma || c === rBrace)
  })
}

class JsonDecode {
  Str (io) {
    return scanQuotes(io)
  }
  Option (type, io) {
    const option = JSON.parse(scanFullStruct(io).toString('ascii'))
    if (option.opt === 0) {
      return null
    } else if (option.opt === 1 && option.value !== undefined) {
      const newIO = new BufferIO()
      newIO.write(Buffer.from(JSON.stringify(option.value)), 'ascii')
      type.read(newIO, this)
      return type
    }
    throw new Error('No opt defined for option: ' + option)
  }
  UInt (io) {
    const value = Number(scanNumber(io))
    const result = Buffer.alloc(4)
    result.writeUInt32BE(value)
    return result
  }
  UHyper (io) {
    const value = scanQuotes(io)
    return Buffer.from(Long.fromString(value, true).toBytesBE())
  }
  Int (io) {
    const value = Number(scanNumber(io))
    const result = Buffer.alloc(4)
    result.writeInt32BE(value)
    return result
  }
  Hyper (io) {
    const value = scanQuotes(io)
    return Buffer.from(Long.fromString(value, false).toBytesBE())
  }
  FixedArray (length, typeFunc, io) {
    let isNull = scanCharOrNull(io, lBracket)
    if (isNull && length === 0) {
      // found null, allow with length 0
      return []
    } else if (isNull) {
      throw new Error('FixedArray found null but expected array of length: ' + length)
    }

    const values = []
    for (let i = 0; i < length - 1; i++) {
      const val = typeFunc()
      val.read(io, this)
      values.push(val)
      if (scanList(io)[0] !== comma) {
        throw new Error('Invalidly formatted list')
      }
    }

    if (length !== 0) {
      const val = typeFunc()
      val.read(io, this)
      values.push(val)
    }

    if (scanList(io)[0] !== rBracket) {
      throw new Error('Invalidly formatted list')
    }
    return values
  }
  FixedOpaque (length, io) {
    let format = 'hex'
    if (length > 64) format = 'base64'
    const result = Buffer.from(scanQuotes(io), format)
    if (result.length !== length) {
      throw new Error('FixedOpaque value is of the wrong length')
    }
    return result
  }
  VarArray (typeFunc, io) {
    if (scanCharOrNull(io, lBracket)) {
      // found null
      return []
    }

    // Check for empty array
    if (io.peek() === rBracket) {
      io.read(Buffer.alloc(1))
      return []
    }

    const values = []
    var sChar
    while (sChar !== rBracket) {
      const val = typeFunc()
      val.read(io, this)
      values.push(val)
      sChar = scanList(io)[0]
    }
    return values
  }
  VarOpaque (io) {
    return Buffer.from(scanQuotes(io), 'base64')
  }
  Bool (io) {
    const toRead = Buffer.alloc(4)
    io.read(toRead)
    let val = toRead.toString()
    if (val === 'true') {
      return true
    } else if (val === 'fals') {
      const readE = Buffer.alloc(1)
      io.read(readE)
      val += readE.toString()
      if (val === 'false') return false
    }
    throw new Error('Bad boolean value: ' + val)
  }
  Void (io) {
    const result = scanQuotes(io)
    if (result !== '') {
      throw new Error('Invalid void type: ' + result)
    }
  }
  Float (io) {
    const value = Number(scanNumber(io))
    const result = Buffer.alloc(4)
    result.writeFloatBE(value)
    return result
  }
  Double (io) {
    const value = Number(scanNumber(io))
    const result = Buffer.alloc(8)
    result.writeDoubleBE(value)
    return result
  }
  Union (enumT, enumTypes, io) {
    const union = JSON.parse(scanFullStruct(io).toString('ascii'))
    const newIO = new BufferIO()
    newIO.write(Buffer.from(JSON.stringify(union.data)), 'ascii')
    enumT.value = union.type
    const result = enumTypes[enumT.toString()]()
    result.read(newIO, this)
    return result
  }
  Struct (keys, values, io) {
    scanChar(io, lBrace)
    for (let i = 0; i < keys.length; i++) {
      const key = scanQuotes(io)
      const index = keys.indexOf(key)
      if (index < 0) {
        throw new Error('Invalid struct key: ' + key)
      }
      scanChar(io, colon)
      values[index].read(io, this)
      if (i !== keys.length - 1) {
        let test = scanDict(io)
        if (test[0] !== comma) {
          throw new Error('Invalidly formatted dict when parsing: ' + key)
        }
      }
    }
    let result = scanDict(io)

    if (result[0] !== rBrace) {
      throw new Error('Invalidly formatted dict' + result)
    }
    return values
  }

  Enum (io) {
    return Number(scanNumber(io))
  }
}

export default JsonDecode
