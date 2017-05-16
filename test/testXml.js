/* eslint-env mocha */
/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "^should$" }] */
'use strict'
let chai = require('chai')
let should = chai.should()
let xml = require('../src/xml')

describe('Parsing a GitInspector XML file', function () {
  it('should resolve to the resulting responsibilities object', function (done) {
    xml.parse('./test/res/test.xml').then(function (result) {
      result.authors.length.should.equal(1)
      result.message['0'].should.equal('The following responsibilities, by author, were found in the current revision of the repository\n            (comments are excluded from the line count, if possible)\n        ')
      result.authors[0].author[0].name['0'].should.equal('Adam Waldenberg')
      done()
    })
  })

  it('should reject with an error when invalid file is supplied', function (done) {
    xml.parse('./test/res/tesat.xml').catch(function (e) {
      e.message.should.equal('ENOENT: no such file or directory, open \'./test/res/tesat.xml\'')
      done()
    })
  })
})
