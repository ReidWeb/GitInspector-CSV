'use strict';
/* eslint-env mocha */

const chai = require('chai');
const xml = require('../src/xml');

const should = chai.should();

describe('Parsing a GitInspector XML file into an object', () => {
  it('should resolve to the resulting responsibilities object', (done) => {
    xml.parse('./test/res/test.xml').then((result) => {
      result.authors.length.should.equal(1);
      result.message['0'].should.equal('The following responsibilities, by author, were found in the current revision of the repository\n            (comments are excluded from the line count, if possible)\n        ');
      result.authors[0].author[0].name['0'].should.equal('Adam Waldenberg');
      done();
    });
  });

  it('should reject with a file not found error when invalid file is supplied', (done) => {
    xml.parse('./test/res/tesat.xml').catch((e) => {
      e.message.should.equal('ENOENT: no such file or directory, open \'./test/res/tesat.xml\'');
      done();
    });
  });

  it('should reject with a bad format error when the `responsibilities` property does not exist', (done) => {
    xml.parse('./test/res/test2.xml').catch((e) => {
      e.code.should.equal('BADFORMAT');
      done();
    });
  });

  it('should reject with error when XML file is badly formatted/not an XML file', (done) => {
    xml.parse('./test/res/testResponsibilities.json').catch((e) => {
      e.code.should.equal('BADFORMAT');
      done();
    });
  });
});
