#!/usr/bin/env node
'use strict';

let xml = require('../src/xml');
let csv = require('../src/csv');
let fs = require('fs');
let Promise = require("bluebird");

function convert(inputFile, outputFile) {
    return new Promise(function (resolve, reject) {
        xml.parse(inputFile).then(function (responsibilities) {

            csv.generate(responsibilities, outputFile).then(function (csv) {
                fs.writeFile(outputFile, csv, 'utf8');
                resolve();
            });

        }).catch(function (error) {
            reject(error);
        });
    });
}

module.exports.convert = convert;
