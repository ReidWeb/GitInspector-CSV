#!/usr/bin/env node
/* eslint-disable no-console */
const program = require('commander');
const gitinspectorCsv = require('../src/index');
const chalk = require('chalk');

const errorOut = chalk.bold.red;

program
    .version('1.0.5')
    .option('-i, --input <required>', 'input XML file path')
    .option('-o, --output <required>', 'output CSV file path')
  .parse(process.argv);

if (program.input && program.output) {
  console.log(chalk.blue(`Starting processing of file ${program.input}`));

  gitinspectorCsv.convert(program.input, program.output).then(() => {
    console.log(chalk.bold.green(`Done processing, result has been saved to ${program.output}`));
  }).catch((error) => {
    if (error.code === 'ENOENT') {
      console.log(errorOut(`Error: No such file or directory ${program.input}`));
    } else if (error.code === 'BADFORMAT') {
      console.log(errorOut(error.message));
    } else {
      console.log(errorOut('A critical error has been encountered reading the file: '));
      console.log(errorOut(error.stack));
    }
    process.exit(1);
  });
} else {
  program.outputHelp();
}
