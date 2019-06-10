class Double {
  constructor (initialValue = 0.0) {
    this.value = Buffer.alloc(8)
    this.value.writeDoubleBE(initialValue)
  }

  read (io, decoder) {
    this.value = decoder.Double(io)
    return this.value
  }

  write (io, encoder) {
    encoder.Double(this.value, io)
  }
}

export default Double
