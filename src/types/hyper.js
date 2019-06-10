import Long from 'long'

class Hyper {
  constructor (initialValue = 0) {
    if (typeof initialValue === 'string') {
      this.value = Buffer.from(Long.fromString(initialValue, false).toBytesBE())
    } else {
      this.value = Buffer.from(Long.fromNumber(initialValue, false).toBytesBE())
    }
  }

  read (io, decoder) {
    this.value = decoder.Hyper(io)
    return this.value
  }

  write (io, encoder) {
    encoder.Hyper(this.value, io)
  }
}

export default Hyper
