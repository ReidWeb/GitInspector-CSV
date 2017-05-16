'use strict';
/* eslint-env mocha */
/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "^should$" }] */
const chai = require('chai');
const rewire = require('rewire');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));

const should = chai.should();
const csv = rewire('../src/csv');

// Utils
function setupFileTestArray() {
  const testArr = [];
  for (let i = 0; i < 72; i++) {
    const testObj = {};
    testObj.name = `file${i}.java`;
    testObj.extraProperty = 'blah';
    testArr.push(testObj);
  }
  return testArr;
}

function setupDuplicatedTestFileArray() {
  const testArr = [];
  for (let i = 0; i < 72; i++) {
    const testObj = {};
    testObj.name = `file${i}.java`;
    testObj.extraProperty = 'blah';
    testArr.push(testObj);
  }
  for (let i = 0; i < 72; i++) {
    const testObj = {};
    testObj.name = `file${i}.java`;
    testObj.extraProperty = 'blah';
    testArr.push(testObj);
  }
  return testArr;
}


describe('Given an object of responsibilities sorted by author', () => {
  it('should resolve to a CSV output with responsibilities sorted by file', (done) => {
    const fn = csv.__get__('generate');
    fs.readFileAsync('./test/res/testResponsibilities.json', 'utf8').then((contents) => {
      fn(JSON.parse(contents)).then((result) => {
        fs.readFileAsync('./test/res/expRes.csv', 'utf8').then((expRes) => {
          result.should.equal(expRes);
          done();
        });
      });
    });
  });

  it('should resolve to an object of responsibilities sorted by file', (done) => {
    fs.readFileAsync('./test/res/testResponsibilities.json', 'utf8').then((contents) => {
      const responsibilities = JSON.parse(contents);
      const fn = csv.__get__('parseIntoContribGroupedByFile');
      fn(responsibilities).then((result) => {
        result.length.should.equal(35);
        result[0].authors.length.should.equal(9);
        result[0].authors[0].name.should.equal('Adam Waldenberg');
        result[0].authors[0].rows.should.equal(264);
        result[0].authors[1].name.should.equal('Bill Wang');
        result[0].authors[1].rows.should.equal(0);
        result[0].authors[2].name.should.equal('Chris Barry');
        result[0].authors[2].rows.should.equal(0);
        result[0].authors[3].name.should.equal('Chris Ring');
        result[0].authors[3].rows.should.equal(0);
        result[0].authors[4].name.should.equal('Christian Kastner');
        result[0].authors[4].rows.should.equal(0);
        result[0].authors[5].name.should.equal('Gregrs');
        result[0].authors[5].rows.should.equal(0);
        result[0].authors[6].name.should.equal('Jon Warghed');
        result[0].authors[6].rows.should.equal(1);
        result[0].authors[7].name.should.equal('Kamila Chyla');
        result[0].authors[7].rows.should.equal(0);
        result[0].authors[8].name.should.equal('Marc Harper');
        result[0].authors[8].rows.should.equal(1);
        done();
      });
    });
  });
});

describe('Setting up the array of files and authors to process', () => {
  it('should return an array with combined file entries for all authors', (done) => {
    fs.readFileAsync('./test/res/testResponsibilities.json', 'utf8').then((contents) => {
      const responsibilities = JSON.parse(contents);
      const fn = csv.__get__('setupFileArray');
      fn(responsibilities, 61).then((result) => {
        result.forEach((file) => {
          file.authors.length.should.equal(9);
        });
        result[0].name.should.equal('gitinspector/changes.py');
        result[6].name.should.equal('gitinspector/terminal.py');
        result[31].name.should.equal('gitinspector.py');
        result.length.should.equal(35);
        done();
      });
    });
  });
});

describe('Removing duplicates from the file array', () => {
  it('should successfully remove all duplicates', (done) => {
    const testArr = setupDuplicatedTestFileArray();
    const fn = csv.__get__('removeDuplicatesFromArray');

    testArr.length.should.equal(144);
    fn(testArr).then((result) => {
      result.length.should.equal(72);
      done();
    });
  });
});

describe('Searching for a matching file name in the array of file names', () => {
  it('should resolve the index of the corresponding filename when the matching file of same name is found', (done) => {
    const fn = csv.__get__('searchForMatchingFile');
        // Setup test array
    const testArr = setupFileTestArray();
    fn('file29.java', testArr).then((result) => {
      result.should.equal(29);
    });
    fn('file0.java', testArr).then((result) => {
      result.should.equal(0);
      done();
    });
  });

  it('should reject with appropriate error when a matching file cannot be found', (done) => {
    const fn = csv.__get__('searchForMatchingFile');
        // Setup test array
    const testArr = setupFileTestArray();
    (fn('file72.java', testArr)).catch((err) => {
      err.code.should.equal('FILENOTFOUND');
      done();
    });
  });
});

