# XDR JS Serialize

[![CircleCI](https://circleci.com/gh/kochavalabs/xdr-js-serialize.svg?style=svg)](https://circleci.com/gh/kochavalabs/xdr-js-serialize)

Xdr-js-serialize is a library for facilitating (de)serialization between the
[XDR](https://en.wikipedia.org/wiki/External_Data_Representation) format and
Javascript Dictionaries.

This repository is best used in tandom with [xdr-codegen](https://github.com/kochavalabs/xdr-codegen)
for anything beyond basic xdr manipulation.

## Installation

This library can be added to your project by using npm to install the
xdr-js-serialize package.

```bash
npm install xdr-js-serialize
```

## Usage

```js
import types from 'xdr-js-serialize'

const string = new types.Str('asdf')

console.log(string.toJSON())
console.log(string.toXDR('hex'))

// console:
// asdf
// 0000000461736466
```

## License

[MIT](https://choosealicense.com/licenses/mit/)

## Notes

- The XDR Quad type is currently not supported
