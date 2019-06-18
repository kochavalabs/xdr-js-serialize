import AddFormats from './formats.js'

class FixedOpaque {
  constructor (length = 1) {
    this.length = length
    this.value = Buffer.alloc(length)
  }

  read (io, decoder) {
    this.value = decoder.FixedOpaque(this.length, io)
    return this.value
  }

  write (io, encoder) {
    encoder.FixedOpaque(this.value, this.length, io)
  }
}

AddFormats(FixedOpaque)

export default FixedOpaque
