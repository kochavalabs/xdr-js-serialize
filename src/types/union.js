import AddFormats from './formats.js'
import Enum from './enum.js'
import Void from './void.js'

class Union {
  constructor (enumT = null, enumTypes = { 'None': new Void() }) {
    this.enum = enumT || new Enum()
    this.enumTypes = enumTypes
    for (const key in this.enum.values) {
      if (!(this.enum.values[key] in this.enumTypes)) {
        console.log(key)
        console.log(this.enumTypes)
        throw new Error('Mismatch between enumTypes and enum values')
      }
    }
    this.value = enumTypes[this.enum.toString()]
  }

  read (io, decoder) {
    this.value = decoder.Union(this.enum, this.enumTypes, io)
    return this.value
  }

  write (io, encoder) {
    encoder.Union(this.enum, this.value, io)
  }
}

AddFormats(Union)

export default Union
