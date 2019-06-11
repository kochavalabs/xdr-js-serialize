import Int from './int.js'

class FixedArray {
  constructor (length = 1, Type = Int) {
    this.length = length
    this.Type = Type
    this.value = Array(length).fill(0).map(x => new Type())
  }

  read (io, decoder) {
    this.value = decoder.FixedArray(this.length, this.Type, io)
    return this.value
  }

  write (io, encoder) {
    encoder.FixedArray(this.value, this.length, this.Type, io)
  }
}

export default FixedArray
