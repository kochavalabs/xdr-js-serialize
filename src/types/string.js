class Str {
  constructor (initialValue = '', maxLength) {
    this.maxLength = maxLength || Math.pow(2, 32) - 1
    if (initialValue.length > this.maxLength) {
      throw new Error('Initial string too long')
    }
    this.value = initialValue.toString()
  }

  read (io, decoder) {
    const result = decoder.Str(io)
    if (result.length > this.maxLength) {
      throw new Error('Read length too long')
    }
    this.value = result
    return this.value
  }

  write (io, encoder) {
    encoder.Str(this.value, io)
  }
}

export default Str
