import AddFormats from './formats.js'

class VarOpaque {
  constructor (maxLength = 1) {
    this.maxLength = maxLength
    this.value = Buffer.alloc(0)
  }

  read (io, decoder) {
    const result = decoder.VarOpaque(io)
    if (result.length > this.maxLength) {
      throw new Error(`Length(${result.length}) was longer than max(${this.maxLength})`)
    }
    this.value = result
    return this.value
  }

  write (io, encoder) {
    encoder.VarOpaque(this.value, io)
  }
}

AddFormats(VarOpaque)

export default VarOpaque
