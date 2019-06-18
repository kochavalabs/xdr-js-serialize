import AddFormats from './formats.js'

class Struct {
  constructor (keys = [], values = []) {
    if (keys.length !== values.length) {
      throw new Error('Expected keys and values to be of the same length')
    }
    this.keys = keys
    this.values = values
  }

  read (io, decoder) {
    decoder.Struct(this.keys, this.values, io)
    return this.values
  }

  write (io, encoder) {
    encoder.Struct(this.keys, this.values, io)
  }
}

AddFormats(Struct)

export default Struct
