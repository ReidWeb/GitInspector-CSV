#!/usr/bin/env node
'use strict';

const xml = require('../src/xml');
const csv = require('../src/csv');
const fs = require('fs');
const Promise = require('bluebird');

function convert(inputFile, outputFile) {
  return new Promise((resolve, reject) => {
    xml.parse(inputFile).then((responsibilities) => {
      csv.generate(responsibilities, outputFile).then((resultingCsv) => {
        fs.writeFileSync(outputFile, resultingCsv, 'utf8');
        resolve();
      });
    }).catch((error) => {
      reject(error);
    });
  });
}

module.exports.convert = convert;
