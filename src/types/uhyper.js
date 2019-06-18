import AddFormats from './formats.js'
import Long from 'long'

class UHyper {
  constructor (initialValue = 0) {
    if (typeof initialValue === 'string') {
      this.value = Buffer.from(Long.fromString(initialValue, true).toBytesBE())
    } else {
      if (initialValue < 0) {
        throw new Error('Invalid UHyper value: ' + initialValue.toString())
      }
      this.value = Buffer.from(Long.fromNumber(initialValue, true).toBytesBE())
    }
  }

  read (io, decoder) {
    this.value = decoder.UHyper(io)
    return this.value
  }

  write (io, encoder) {
    encoder.UHyper(this.value, io)
  }
}

AddFormats(UHyper)

export default UHyper
