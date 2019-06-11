import Int from './int.js'

class VarArray {
  constructor (maxLength = 1, Type = Int) {
    this.maxLength = maxLength
    this.Type = Type
    this.value = []
  }

  read (io, decoder) {
    const result = decoder.VarArray(this.Type, io)
    if (result.length > this.maxLength) {
      throw new Error(`Length(${result.length}) was longer than max(${this.maxLength})`)
    }
    this.value = result
    return this.value
  }

  write (io, encoder) {
    encoder.VarArray(this.value, io)
  }
}

export default VarArray
