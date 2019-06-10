import sinon from 'sinon'

export function EncodeReturn (func, value) {
  const mock = sinon.fake()
  mock[func] = sinon.fake.returns(value)
  return mock
}
