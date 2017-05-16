'use strict';
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const xml2js = require('xml2js');

function parse(input) {
  return new Promise((resolve, reject) => {
    fs.readFileAsync(input, 'utf8').then((contents) => {
      const parser = new xml2js.Parser();

      parser.parseString(contents, (err, result) => {


        if (!err && result.gitinspector.responsibilities) {
          resolve(result.gitinspector.responsibilities[0]);
        } else {
          const error = new Error('BADFORMAT: Responsbility output is missing from passed in gitinspector XML ' +
            'output, please verify that you ran gitinspector with the -r flag.');
          error.code = 'BADFORMAT';
          reject(error);
        }
      });
    }).catch((e) => {
      reject(e);
    });
  });
}

module.exports.parse = parse;
