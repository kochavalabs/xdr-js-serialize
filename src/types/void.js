import AddFormats from './formats.js'

class Void {
  read (io, decoder) {
    decoder.Void(io)
    return null
  }

  write (io, encoder) {
    encoder.Void(io)
  }
}

AddFormats(Void)

export default Void
