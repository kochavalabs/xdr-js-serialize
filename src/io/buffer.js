class BufferIO {
  constructor () {
    this._buffers = []
    this._buffIndex = 0
    this._arrayIndex = 0
  }

  write (toWrite, encoding = 'base64') {
    this._buffers.push(Buffer.from(toWrite, encoding))
  }

  _readIndexed (toRead, start = 0) {
    const bytesToRead = toRead.length - start
    if (bytesToRead === 0) {
      return
    }
    if (this._arrayIndex >= this._buffers.length) {
      throw new Error('Not enough in buffer to continue reading.')
    }
    const remainder = this._buffers[this._arrayIndex].length - this._buffIndex
    if (remainder > bytesToRead) {
      this._buffers[this._arrayIndex].copy(toRead, start, this._buffIndex, this._buffIndex + bytesToRead)
      this._buffIndex = this._buffIndex + bytesToRead
      return
    }
    this._buffers[this._arrayIndex].copy(toRead, start, this._buffIndex)
    this._arrayIndex++
    this._readIndexed(toRead, start + remainder)
  }

  read (toRead) {
    this._readIndexed(toRead)
  }

  finalize () {
    const totalLength = this._buffers.map(x => x.length).reduce((t, v) => t + v)
    this._buffIndex = 0
    this._arrayIndex = 0
    const result = Buffer.alloc(totalLength)
    this.read(result)
    return result
  }
}

export default BufferIO
