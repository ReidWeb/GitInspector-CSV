#!/usr/bin/env node
'use strict';

const program = require('commander');
let xml = require('./xml');
let csv = require('./csv');
let fs = require("fs");

let json;

program
    .version('1.0.4')
    .option('-i, --input <required>', 'input XML file path')
    .option('-o, --output <required>', 'output CSV file path')
    .parse(process.argv);

if (program.input && program.output) {
    console.log("Starting parse");
    json = xml.parse(program.input).then(function (responsibilities) {
        csv.generate(responsibilities, program.output).then(function (csv) {
            fs.writeFile(program.output, csv, 'utf8');
            console.log("Done processing");
        });
    });
} else {
    program.outputHelp();
}