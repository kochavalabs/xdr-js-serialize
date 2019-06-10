class Float {
  constructor (initialValue = 0.0) {
    this.value = Buffer.alloc(4)
    this.value.writeFloatBE(initialValue)
  }

  read (io, decoder) {
    this.value = decoder.Float(io)
    return this.value
  }

  write (io, encoder) {
    encoder.Float(this.value, io)
  }
}

export default Float
