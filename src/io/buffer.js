class BufferIO {
  constructor (initialBuffer) {
    this._buffers = []
    this._buffIndex = 0
    this._arrayIndex = 0
    if (initialBuffer) {
      this._buffers.push(initialBuffer)
    }
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

  _scan (boolCheck, bI, aI, byteCount) {
    if (aI >= this._buffers.length) {
      return byteCount + 1
    }
    const buffLength = this._buffers[aI].length
    let toRead = 0
    for (let i = bI; i < buffLength; i++) {
      toRead++
      if (boolCheck(this._buffers[aI][i])) {
        return toRead + byteCount
      }
    }
    return this._scan(boolCheck, 0, aI + 1, byteCount + toRead)
  }

  scanRead (boolCheck, inclusive = true) {
    let bufferSize = this._scan(boolCheck, this._buffIndex, this._arrayIndex, 0)
    if (!inclusive) bufferSize--
    const toRead = Buffer.alloc(bufferSize)
    this.read(toRead)
    return toRead
  }

  finalize () {
    this._buffIndex = 0
    this._arrayIndex = 0
    if (this._buffers.length === 0) {
      return Buffer.alloc(0)
    }
    const totalLength = this._buffers.map(x => x.length).reduce((t, v) => t + v)
    const result = Buffer.alloc(totalLength)
    this.read(result)
    return result
  }
}

export default BufferIO
