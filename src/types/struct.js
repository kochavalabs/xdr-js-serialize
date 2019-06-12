class Struct {
  constructor (keys = [], values = []) {
    if (keys.length !== values.length) {
      throw new Error('Expected keys and values to be of the same length')
    }
    this.keys = keys
    this.values = values
  }

  read (io, decoder) {
    const result = decoder.Struct(this.keys, io)
    if (this.keys.length !== result.length) {
      throw new Error(`Returned length(${result.length}) was shorter than keys(${this.keys.length})`)
    }
    this.values = result
    return this.values
  }

  write (io, encoder) {
    encoder.Struct(this.keys, this.values, io)
  }
}

export default Struct
