# GitInspector CSV generator

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
