import AddFormats from './formats.js'
import Enum from './enum.js'
import Void from './void.js'

class Union {
  constructor (enumT = null, enumTypes = { 'None': () => { return new Void() } }) {
    this.type = enumT || new Enum()
    this.enumTypes = enumTypes
    for (const key in this.type.values) {
      if (!(this.type.values[key] in this.enumTypes)) {
        throw new Error('Mismatch between enumTypes and enum values')
      }
    }
    this.data = enumTypes[this.type.toString()]()
  }

  read (io, decoder) {
    this.data = decoder.Union(this.type, this.enumTypes, io)
    return this.data
  }

  write (io, encoder) {
    encoder.Union(this.type, this.data, io)
  }
}

AddFormats(Union)

export default Union
