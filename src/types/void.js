class Void {
  read (io, decoder) {
    decoder.Void(io)
    return null
  }

  write (io, encoder) {
    encoder.Void(io)
  }
}

export default Void
