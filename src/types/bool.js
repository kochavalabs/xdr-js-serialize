import AddFormats from './formats.js'

class Bool {
  constructor (initialValue = false) {
    if (initialValue.toLowerCase && initialValue.toLowerCase() === 'false') {
      this.value = false
    } else {
      this.value = !!initialValue
    }
  }

  read (io, decoder) {
    this.value = decoder.Bool(io)
    return this.value
  }

  write (io, encoder) {
    encoder.Bool(this.value, io)
  }
}

AddFormats(Bool)

export default Bool
