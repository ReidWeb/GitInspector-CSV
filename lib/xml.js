'use strict';

let Promise = require("bluebird");
let cheerio=require('cheerio');
let fs = Promise.promisifyAll(require("fs"));
let parser = require('xml2json');

function parse(input) {
    return new Promise(function( resolve, object)
    {
        fs.readFileAsync(input, "utf8").then(function (contents) {
            let result = JSON.parse(parser.toJson(contents));
            resolve(result.gitinspector.responsibilities);
        }).catch(function(e) {
            console.error(e.stack);
        });
    });
}

module.exports.parse = parse;