import AddFormats from './formats.js'

class Int {
  constructor (initialValue = 0) {
    this.value = Buffer.alloc(4)
    this.value.writeInt32BE(initialValue)
  }

  read (io, decoder) {
    this.value = decoder.Int(io)
    return this.value
  }

  write (io, encoder) {
    encoder.Int(this.value, io)
  }
}

AddFormats(Int)

export default Int
