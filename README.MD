# GitInspector CSV generator

[![npm version](https://img.shields.io/npm/v/gitinspector-csv.svg)](https://www.npmjs.com/package/gitinspector-csv)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/ReidWeb/GitInspector-CSV/master/LICENSE)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bhttps%3A%2F%2Fgithub.com%2FReidWeb%2FGitInspector-CSV.svg?type=shield)](https://app.fossa.io/projects/git%2Bhttps%3A%2F%2Fgithub.com%2FReidWeb%2FGitInspector-CSV?ref=badge_shield)
[![dependencies Status](https://david-dm.org/reidweb/GitInspector-CSV/status.svg)](https://david-dm.org/reidweb/GitInspector-CSV)
[![npm downloads](https://img.shields.io/npm/dm/gitinspector-csv.svg)](https://www.npmjs.com/package/gitinspector-csv)
[![Build Status](https://travis-ci.org/ReidWeb/GitInspector-CSV.svg?branch=master)](https://travis-ci.org/ReidWeb/GitInspector-CSV)
[![codecov](https://codecov.io/gh/ReidWeb/GitInspector-CSV/branch/master/graph/badge.svg)](https://codecov.io/gh/ReidWeb/GitInspector-CSV)

Very quick script for converting XML output from [GitInspector](https://github.com/ejwa/gitinspector) to a CSV file.

I do not intend to actively maintain this, nor is it perfectly designed. I implemented this to assist in the
documentation of an academic project.

## Usage

Generate an XML report using GitInspector.

Make sure you have Node.js and NPM installed.

Then install as a global dependency
```bash
npm install -g gitinspector-csv
```

and run as follows

```bash
gitinspector-csv -i file.xml -o output.csv
```

Then you can open output.csv in the reader of your choice.
