import Enum from './enum.js'
import Void from './void.js'

class Union {
  constructor (enumT = null, enumTypes = [Void]) {
    this.enum = enumT || new Enum()
    this.enumTypes = enumTypes
    if (Object.keys(this.enum.values).length !== this.enumTypes.length) {
      throw new Error('Mismatch between enumTypes and enum values')
    }
    this.value = new enumTypes[this.enum.value]()
  }

  read (io, decoder) {
    this.value = decoder.Union(this.enum, this.enumTypes, io)
    return this.value
  }

  write (io, encoder) {
    encoder.Union(this.enum, this.value, io)
  }
}

export default Union
