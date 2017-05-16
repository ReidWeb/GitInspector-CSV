'use strict';
/* eslint-env mocha */
/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "^should$" }] */


const chai = require('chai');
const xml = require('../src/xml');

const should = chai.should();

describe('Parsing a GitInspector XML file', () => {
  it('should resolve to the resulting responsibilities object', (done) => {
    xml.parse('./test/res/test.xml').then((result) => {
      result.authors.length.should.equal(1);
      result.message['0'].should.equal('The following responsibilities, by author, were found in the current revision of the repository\n            (comments are excluded from the line count, if possible)\n        ');
      result.authors[0].author[0].name['0'].should.equal('Adam Waldenberg');
      done();
    });
  });

  it('should reject with an error when invalid file is supplied', (done) => {
    xml.parse('./test/res/tesat.xml').catch((e) => {
      e.message.should.equal('ENOENT: no such file or directory, open \'./test/res/tesat.xml\'');
      done();
    });
  });
});
