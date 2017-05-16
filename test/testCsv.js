'use strict';
let chai = require('chai');
let should = chai.should();
let rewire = require('rewire');
let csv = rewire('../src/csv');
let Promise = require("bluebird");
let fs = Promise.promisifyAll(require('fs'));

describe('Given an object of responsibilities sorted by author', function () {

    it('should resolve to a CSV output with responsibilities sorted by file', function (done) {
        let fn = csv.__get__('generate');
        fs.readFileAsync('./test/res/testResponsibilities.json', 'utf8').then(function (contents) {
            fn(JSON.parse(contents)).then(function (result) {
                fs.readFileAsync('./test/res/expRes.csv', 'utf8').then(function (expRes) {
                    result.should.equal(expRes);
                    done();
                });
            });
        });

    });

});

describe('Given an XML file of responsibilities sorted by author', function () {

    it('should resolve to a JS object of responsibilities sorted by file', function (done) {

        fs.readFileAsync('./test/res/testResponsibilities.json', 'utf8').then(function (contents) {
            let responsibilities = JSON.parse(contents);
            let fn = csv.__get__('parseIntoContribGroupedByFile');
            fn(responsibilities).then(function (result) {
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