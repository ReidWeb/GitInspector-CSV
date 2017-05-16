'use strict'

let Promise = require('bluebird')
let fs = Promise.promisifyAll(require('fs'))
let xml2js = require('xml2js')

function parse (input) {
  return new Promise(function (resolve, reject) {
    fs.readFileAsync(input, 'utf8').then(function (contents) {
      let parser = new xml2js.Parser()

      parser.parseString(contents, function (result) {
        if (result.gitinspector.responsibilities) {
          resolve(result.gitinspector.responsibilities[0])
        } else {
          let error = new Error('Error: Responsbility output is missing from passed in gitinspector XML ' +
            'output, please verify that you ran gitinspector with the -r flag.')
          error.code = 'BADFORMAT'
          reject(error)
        }
      })
    }).catch(function (e) {
      reject(e)
    })
  })
}

module.exports.parse = parse
