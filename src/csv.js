'use strict';
const Promise = require('bluebird');

function searchForMatchingFile(fileName, files) {
  return new Promise((resolve, reject) => {
    const names = files.map(file => file.name);
    names.forEach((name, index) => {
      if (name === fileName) {
        resolve(index);
      }
    });
    const error = new Error(
        'Error: Could not find the specified file name in the array');
    error.code = 'FILENOTFOUND';
    reject(error);
  });
}

function removeDuplicatesFromArray(fileSet) {
  return new Promise((resolve) => {
    const cleanFileList = [];

    let checkedFiles = 0;

    fileSet.forEach((file, fileIndex) => {
      searchForMatchingFile(file.name, fileSet).then((index) => {
        if (index === fileIndex) {
          cleanFileList.push(file);
        }
        checkedFiles++;
        if (checkedFiles === fileSet.length) {
          resolve(cleanFileList);
        }
      });
    });
  });
}

function setupFileArray(responsibilities, targetRowCount) {
  return new Promise((resolve) => {
    let processedRows = 0;
    const fileSet = [];

    const authorNames = [];

    responsibilities.authors[0].author.forEach((author) => {
      authorNames.push(author.name);
    });

    responsibilities.authors[0].author.forEach((author) => {
      author.files[0].file.forEach((file) => {
        processedRows++;
        const newFileObj = {};
        newFileObj.name = file.name[0];
        newFileObj.authors = [];
        authorNames.forEach((authorName) => {
          const authorObj = {};
          authorObj.name = authorName['0'];
          authorObj.rows = 0;
          newFileObj.authors.push(authorObj);
        });
        fileSet.push(newFileObj);

        if (processedRows === targetRowCount) {
          removeDuplicatesFromArray(fileSet).then((resultingFileSet) => {
            resolve(resultingFileSet);
          });
        }
      });
    });
  });
}

function parseIntoContribGroupedByFile(responsibilities) {
  return new Promise((resolve) => {
    let targetRowCount = 0;
    responsibilities.authors[0].author.forEach((author) => {
      targetRowCount += author.files[0].file.length;
    });

    setupFileArray(responsibilities, targetRowCount).then((fileList) => {
      let processedRows = 0;

      responsibilities.authors[0].author.forEach((author, authorIndex) => {
        author.files[0].file.forEach((file) => {
          searchForMatchingFile(file.name['0'], fileList).then((index) => {
            fileList[index].authors[authorIndex].rows = parseInt(file.rows['0'], 10);
            processedRows++;

            if (processedRows === targetRowCount) {
              resolve(fileList);
            }
          });
        });
      });
    });
  });
}

function generate(responsibilities) {
  return new Promise((resolve) => {
    parseIntoContribGroupedByFile(responsibilities).then((files) => {
      let authorFilesToProcess = 0;

      files.forEach((file) => {
        file.authors.forEach(() => {
          authorFilesToProcess++;
        });
      });

      let authorFilesProcessed = 0;

      let csv = '"Relative file path",';
      csv += '"File name",';
      files[0].authors.forEach((author) => {
        csv += '"';
        csv += author.name;
        csv += '",';
      });
      csv += '\n';

      files.forEach((file) => {
        const splitFilePath = file.name.split('/');
        const shortFileName = splitFilePath[splitFilePath.length - 1];
        csv += '"';
        csv += file.name;
        csv += '","';
        csv += shortFileName;
        csv += '",';
        file.authors.forEach((author) => {
          csv += '"';
          csv += author.rows;
          csv += '",';
          authorFilesProcessed++;
        });
        csv += '\n';

        if (authorFilesProcessed === authorFilesToProcess) {
          resolve(csv);
        }
      });
    });
  });
}


module.exports.generate = generate;
