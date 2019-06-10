class UInt {
  constructor (initialValue = 0) {
    this.value = Buffer.alloc(4)
    this.value.writeUInt32BE(initialValue)
  }

  read (io, decoder) {
    this.value = decoder.UInt(io)
    return this.value
  }

  write (io, encoder) {
    encoder.UInt(this.value, io)
  }
}

export default UInt
