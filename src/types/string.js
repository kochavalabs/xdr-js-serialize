class Str {
  constructor (initialValue = '') {
    this.value = initialValue.toString()
  }

  read (io, decoder) {
    this.value = decoder.Str(io)
    return this.value
  }

  write (io, encoder) {
    encoder.Str(this.value, io)
  }
}

export default Str
