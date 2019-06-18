import BufferIO from '../io/buffer.js'
import JsonEncode from '../encode/json.js'
import XdrEncode from '../encode/xdr.js'
import JsonDecode from '../decode/json.js'
import XdrDecode from '../decode/xdr.js'

function toXDR (format = 'raw') {
  const buffer = new BufferIO()
  this.write(buffer, new XdrEncode())
  const result = buffer.finalize()
  switch (format) {
    case 'raw':
      return result
    case 'base64':
      return result.toString('base64')
    case 'hex':
      return result.toString('hex')
    case 'ascii':
      return result.toString('ascii')
  }
  throw new Error('Invalid format: ' + format)
}

function toJSON () {
  const buffer = new BufferIO()
  this.write(buffer, new JsonEncode())
  const result = buffer.finalize().toString('ascii')
  return JSON.parse(result)
}

function fromXDR (input, format = 'raw') {
  const buffer = new BufferIO()
  switch (format) {
    case 'raw':
      break
    case 'base64':
      input = Buffer.from(input, 'base64')
      break
    case 'hex':
      input = Buffer.from(input, 'hex')
      break
    case 'ascii':
      input = Buffer.from(input, 'ascii')
      break
  }
  buffer.write(input)
  this.read(buffer, new XdrDecode())
  return this
}

function fromJSON (input) {
  const buffer = new BufferIO()
  buffer.write(Buffer.from(JSON.stringify(input), 'ascii'))
  this.read(buffer, new JsonDecode())
  return this
}

export default function includeFormatting (obj) {
  obj.prototype.toXDR = toXDR
  obj.prototype.toJSON = toJSON

  obj.prototype.fromXDR = fromXDR
  obj.prototype.fromJSON = fromJSON
}
