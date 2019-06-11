import Int from './int.js'

class Option {
  constructor (Type = Int) {
    this.Type = Type
    this.value = null
  }

  read (io, decoder) {
    const result = decoder.Option(this.Type, io)
    if (result === null && !(result instanceof this.Type)) {
      throw new Error('Returned the wrong type: ' + result)
    }
    this.value = result
    return this.value
  }

  write (io, encoder) {
    encoder.Option(this.value, io)
  }
}

export default Option
