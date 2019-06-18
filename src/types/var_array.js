import AddFormats from './formats.js'
import Int from './int.js'

class VarArray {
  constructor (maxLength = 1, typeFunc) {
    this.maxLength = maxLength
    this.typeFunc = typeFunc || (() => { return new Int() })
    this.values = []
  }

  read (io, decoder) {
    const result = decoder.VarArray(this.typeFunc, io)
    if (result.length > this.maxLength) {
      throw new Error(`Length(${result.length}) was longer than max(${this.maxLength})`)
    }
    this.values = result
    return this.values
  }

  write (io, encoder) {
    encoder.VarArray(this.values, io)
  }
}

AddFormats(VarArray)

export default VarArray
