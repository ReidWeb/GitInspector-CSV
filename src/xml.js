'use strict';

let Promise = require("bluebird");
let cheerio=require('cheerio');
let fs = Promise.promisifyAll(require('fs'));
let parser = require('xml2json');

function parse(input) {
    return new Promise(function (resolve, reject)
    {
        fs.readFileAsync(input, "utf8").then(function (contents) {
            let result = JSON.parse(parser.toJson(contents));
            if (result.gitinspector.responsibilities) {
                resolve(result.gitinspector.responsibilities);
            } else {
                let error = new Error("Error: Responsbility output is missing from passed in gitinspector XML " +
                    "output, please verify that you ran gitinspector with the -r flag.");
                error.code = "BADFORMAT";
                reject(error);
            }
        }).catch(function(e) {
            reject(e);
        });
    });
}

module.exports.parse = parse;