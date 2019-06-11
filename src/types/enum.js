class Enum {
  constructor (values = { 0: 'None' }, initialValue = 0) {
    this.values = values
    this.value = initialValue
  }

  read (io, decoder) {
    const result = decoder.Enum(io)
    if (this.values[result] === undefined) {
      throw new Error('Invalid enum value: ' + result)
    }
    this.value = result
    return this.value
  }

  write (io, encoder) {
    encoder.Enum(this.value, io)
  }

  toString () {
    if (this.values[this.value] === undefined) {
      throw new Error('Invalid enum value: ' + this.value)
    }
    return this.values[this.value]
  }
}

export default Enum
