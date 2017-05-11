'use strict';
let chai = require('chai');
let should = chai.should();
let rewire = require('rewire');
let csv = rewire('../src/csv');
let Promise = require("bluebird");
let fs = Promise.promisifyAll(require('fs'));

describe('Setting up the array of files and authors to process', function () {

    it('should return an array with combined file entries for all authors', function (done) {
        fs.readFileAsync('./test/res/testResponsibilities.json', 'utf8').then(function (contents) {
            let responsibilities = JSON.parse(contents);
            let fn = csv.__get__('setupFileArray');
            fn(responsibilities, 61).then(function (result) {
                result.forEach(function (file) {
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

describe('Removing duplicates from the file array', function () {

    it('should successfully remove all duplicates', function (done) {
        let testArr = setupDuplicatedTestFileArray();
        let fn = csv.__get__('removeDuplicatesFromArray');

        testArr.length.should.equal(144);
        fn(testArr).then(function (result) {
            result.length.should.equal(72);
            done();
        });
    });

});

describe('Searching for a matching file name in the array of file names', function () {

    it('should resolve the index of the corresponding filename when the matching file of same name is found', function (done) {
        let fn = csv.__get__('searchForMatchingFile');
        //Setup test array
        let testArr = setupFileTestArray();
        fn('file29.java', testArr).then(function (result) {
            result.should.equal(29);
        });
        fn('file0.java', testArr).then(function (result) {
            result.should.equal(0);
            done();
        });
    });

    it('should reject with appropriate error when a matching file cannot be found', function (done) {
        let fn = csv.__get__('searchForMatchingFile');
        //Setup test array
        let testArr = setupFileTestArray();
        (fn('file72.java', testArr)).catch(function (err) {
            err.code.should.equal('FILENOTFOUND');
            done();
        });
    });

});

//Utils
function setupFileTestArray() {
    let testArr = [];
    for (let i = 0; i < 72; i++) {
        let testObj = {};
        testObj.name = 'file' + i + '.java';
        testObj.extraProperty = 'blah';
        testArr.push(testObj);
    }
    return testArr;
}

function setupDuplicatedTestFileArray() {
    let testArr = [];
    for (let i = 0; i < 72; i++) {
        let testObj = {};
        testObj.name = 'file' + i + '.java';
        testObj.extraProperty = 'blah';
        testArr.push(testObj);
    }
    for (let i = 0; i < 72; i++) {
        let testObj = {};
        testObj.name = 'file' + i + '.java';
        testObj.extraProperty = 'blah';
        testArr.push(testObj);
    }
    return testArr;
}