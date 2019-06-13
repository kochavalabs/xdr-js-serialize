import utils from '../utils.js'

class JsonEncode {
  Str (value, io) {
    utils.calculatePadding(1)
  }
  Option (value, io) {}
  UInt (value, io) {}
  UHyper (value, io) {}
  Int (value, io) {}
  FixedArray (value, length, type, io) {}
  Hyper (value, io) {}
  Bool (value, io) {}
  FixedOpaque (value, length, io) {}
  Void (io) {}
  VarArray (value, io) {}
  VarOpaque (value, io) {}
  Float (value, io) {}
  Double (value, io) {}
  Union (enumT, value, io) {}
  Struct (keys, values, io) {}
  Enum (value, io) {}
}

export default JsonEncode
