import Int from './int.js'

class FixedArray {
  constructor (length = 1, Type = Int) {
    this.length = length
    this.Type = Type
    this.values = Array(length).fill(0).map(x => new Type())
  }

  read (io, decoder) {
    this.values = decoder.FixedArray(this.length, this.Type, io)
    return this.values
  }

  write (io, encoder) {
    encoder.FixedArray(this.values, this.length, this.Type, io)
  }
}

export default FixedArray
