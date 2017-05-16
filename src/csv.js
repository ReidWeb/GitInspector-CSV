'use strict'

let Promise = require('bluebird')

function generate (responsibilities) {
  return new Promise(function (resolve, reject) {
    parseIntoContribGroupedByFile(responsibilities).then(function (files) {
      let authorFilesToProcess = 0

      files.forEach(function (file) {
        file.authors.forEach(function (author) {
          authorFilesToProcess++
        })
      })

      let authorFilesProcessed = 0

      let csv = '"Relative file path",'
      csv += '"File name",'
      files[0].authors.forEach(function (author) {
        csv += '"'
        csv += author.name
        csv += '",'
      })
      csv += '\n'

      files.forEach(function (file) {
        let splitFilePath = file.name.split('/')
        let shortFileName = splitFilePath[splitFilePath.length - 1]
        csv += '"'
        csv += file.name
        csv += '","'
        csv += shortFileName
        csv += '",'
        file.authors.forEach(function (author) {
          csv += '"'
          csv += author.rows
          csv += '",'
          authorFilesProcessed++
        })
        csv += '\n'

        if (authorFilesProcessed === authorFilesToProcess) {
          resolve(csv)
        }
      })
    })
  })
}

function parseIntoContribGroupedByFile (responsibilities) {
  return new Promise(function (resolve, reject) {
    let targetRowCount = 0
    responsibilities.authors[0].author.forEach(function (author) {
      targetRowCount += author.files[0].file.length
    })

    setupFileArray(responsibilities, targetRowCount).then(function (fileList) {
      let processedRows = 0

      responsibilities.authors[0].author.forEach(function (author, authorIndex, authorsArr) {
        author.files[0].file.forEach(function (file, fileIndex, filesArr) {
          searchForMatchingFile(file.name['0'], fileList).then(function (index) {
            fileList[index].authors[authorIndex].rows = parseInt(file.rows['0'], 10)
            processedRows++

            if (processedRows === targetRowCount) {
              resolve(fileList)
            }
          })
        })
      })
    })
  })
}

function setupFileArray (responsibilities, targetRowCount) {
  return new Promise(function (resolve, reject) {
    let processedRows = 0
    let fileSet = []

    let authorNames = []

    responsibilities.authors[0].author.forEach(function (author) {
      authorNames.push(author.name)
    })

    responsibilities.authors[0].author.forEach(function (author, authorIndex, authorsArr) {
      author.files[0].file.forEach(function (file, fileIndex, filesArr) {
        processedRows++
        let newFileObj = {}
        newFileObj.name = file.name[0]
        newFileObj.authors = []
        authorNames.forEach(function (authorName) {
          let authorObj = {}
          authorObj.name = authorName['0']
          authorObj.rows = 0
          newFileObj.authors.push(authorObj)
        })
        fileSet.push(newFileObj)

        if (processedRows === targetRowCount) {
          removeDuplicatesFromArray(fileSet).then(function (fileSet) {
            resolve(fileSet)
          })
        }
      })
    })
  })
}

function removeDuplicatesFromArray (fileSet) {
  return new Promise(function (resolve, reject) {
    let cleanFileList = []

    let checkedFiles = 0

    fileSet.forEach(function (file, fileIndex) {
      searchForMatchingFile(file.name, fileSet).then(function (index) {
        if (index === fileIndex) {
          cleanFileList.push(file)
        }
        checkedFiles++
        if (checkedFiles === fileSet.length) {
          resolve(cleanFileList)
        }
      })
    })
  })
}

function searchForMatchingFile (fileName, files) {
  return new Promise(function (resolve, reject) {
      let names = files.map(function (file) {
        return file.name
      })
      names.forEach(function (name, index) {
        if (name === fileName) {
          resolve(index)
        }
      })
      let error = new Error(
        'Error: Could not find the specified file name in the array')
      error.code = 'FILENOTFOUND'
      reject(error)
    }
  )
}

module.exports.generate = generate
