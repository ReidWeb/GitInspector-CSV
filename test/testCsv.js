'use strict';
let mocha = require('mocha');
let chai = require('chai');
let should = chai.should();
let rewire = require('rewire');
let csv = rewire('../src/csv');

describe('Searching for a matching file name in the array of file names', function () {
    it('should resolve the index of the corresponding filename', function () {
        let fn = csv.__get__('searchForMatchingFile');
        //Setup test array
        let testArr = [];
        for (let i = 0; i < 72; i++) {
            let testObj = {};
            testObj.name = 'file' + i + '.java';
            testObj.extraProperty = 'blah';
            testArr.push(testObj);
        }
        (fn('file29.java', testArr)).then(function (result) {
            result.should.equal(29);
        });
        (fn('file0.java', testArr)).then(function (result) {
            result.should.equal(0);
        });
    });
    it('should reject with appropriate error when a matching file cannot be found', function () {
        let fn = csv.__get__('searchForMatchingFile');
        //Setup test array
        let testArr = [];
        for (let i = 0; i < 72; i++) {
            let testObj = {};
            testObj.name = 'file' + i + '.java';
            testObj.extraProperty = 'blah';
            testArr.push(testObj);
        }
        (fn('file72.java', testArr)).catch(function (err) {
            err.code.should.equal('FILENOTFOUND');
        });
    });
});