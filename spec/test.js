/* global describe, it */
const chai = require('chai')
const expect = chai.expect

const lib = require('../index')

describe('java version', () => {
  it('should extract java version', () => {
    const java8Version = `java version "1.8.0_171"
Java(TM) SE Runtime Environment (build 1.8.0_171-b11)
Java HotSpot(TM) 64-Bit Server VM (build 25.171-b11, mixed mode)
`
    const java10Version = `java version "10.0.2" 2018-07-17
Java(TM) SE Runtime Environment 18.3 (build 10.0.2+13)
Java HotSpot(TM) 64-Bit Server VM 18.3 (build 10.0.2+13, mixed mode)
`
    const java11Version = `java version "11.0.1" 2018-10-16 LTS
Java(TM) SE Runtime Environment 18.9 (build 11.0.1+13-LTS)
Java HotSpot(TM) 64-Bit Server VM 18.9 (build 11.0.1+13-LTS, mixed mode)
`
    const java19Version = 'openjdk version "19" 2022-09-20'
    expect(lib._extractJavaSemanticVersion(java8Version)).to.deep.equal({
      major: 8,
      minor: 0,
      patch: 171
    })
    expect(lib._extractJavaSemanticVersion(java10Version)).to.deep.equal({
      major: 10,
      minor: 0,
      patch: 2
    })
    expect(lib._extractJavaSemanticVersion(java11Version)).to.deep.equal({
      major: 11,
      minor: 0,
      patch: 1
    })
    expect(lib._extractJavaSemanticVersion(java19Version)).to.deep.equal({
      major: 19,
      minor: 0,
      patch: 0
    })
  })
})
