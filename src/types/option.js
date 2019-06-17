import Int from './int.js'

class Option {
  constructor (type = new Int(), value = null) {
    this.type = type
    this.value = value
  }

  read (io, decoder) {
    const result = decoder.Option(this.type, io)
    this.value = result
    return this.value
  }

  write (io, encoder) {
    encoder.Option(this.value, io)
  }
}

export default Option
