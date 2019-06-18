import AddFormats from './formats.js'
import Int from './int.js'

class FixedArray {
  constructor (length = 1, typeFunc) {
    this.length = length
    this.typeFunc = typeFunc || (() => { return new Int() })
    this.values = Array(length).fill(0).map(this.typeFunc)
  }

  read (io, decoder) {
    this.values = decoder.FixedArray(this.length, this.typeFunc, io)
    return this.values
  }

  write (io, encoder) {
    encoder.FixedArray(this.values, this.length, io)
  }
}

AddFormats(FixedArray)

export default FixedArray
