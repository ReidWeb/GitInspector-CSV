'use strict';
/* eslint-env mocha */

const chai = require('chai');
const index = require('../src/index');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));

const should = chai.should();

describe('Parsing a GitInspector XML file into a CSV file and writing it to disk', () => {
  it('should successfully write the CSV output to disk', (done) => {
    if (!fs.existsSync('tmp')) {
      fs.mkdirSync('tmp');
    }

    index.convert('./test/res/test.xml', './tmp/out1.csv').then(() => {
      fs.readFileAsync('./tmp/out1.csv').then((outputFile) => {
        outputFile.should.not.equal(null);
        done();
      });
    });
  });

  it('should reject with a file not found error when invalid file is supplied', (done) => {
    index.convert('./test/res/tesat.xml', './tmp/out2.csv').catch((e) => {
      e.message.should.equal('ENOENT: no such file or directory, open \'./test/res/tesat.xml\'');
      done();
    });
  });

  it('should reject with a bad format error when the `responsibilities` property does not exist', (done) => {
    index.convert('./test/res/test2.xml', './tmp/out3.csv').catch((e) => {
      e.code.should.equal('BADFORMAT');
      done();
    });
  });

  it('should reject with error when XML file is badly formatted/not an XML file', (done) => {
    index.convert('./test/res/testResponsibilities.json', './tmp/out4.csv').catch((e) => {
      e.code.should.equal('BADFORMAT');
      done();
    });
  });
});
