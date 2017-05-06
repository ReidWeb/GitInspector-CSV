'use strict';

const program = require('commander');
let xml = require('./xml');
let csv = require('./csv');
let fs = require("fs");

let json;

program
    .version('1.0.0')
    .option('-i, --input <required>', 'input XML file path')
    .option('-o, --output <required>', 'output CSV file path')
    .parse(process.argv);

console.log("Starting parse");
if (program.input && program.output) {
    json = xml.parse(program.input).then(function (responsibilities) {
        csv.generate(responsibilities, program.output).then(function (csv) {
            fs.writeFile(program.output, csv, 'utf8');
            console.log("Done processing");
        });
    });
}
if (!program.input) {
    console.log('Error: please enter a valid file path for input');
}

if (!program.output) {
    console.log('Error: please enter a valid file path for output');
}