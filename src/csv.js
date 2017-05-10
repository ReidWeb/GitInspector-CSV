'use strict';

let Promise = require("bluebird");


function generate(responsibilities, outputFilePath) {

    return new Promise(function (resolve, object) {
        parseIntoContribGroupedByFile(responsibilities).then(function (files) {
            let authorFilesToProcess = 0;

            files.forEach(function (file) {
                file.authors.forEach(function (author) {
                    authorFilesToProcess++;
                });
            });

            let authorFilesProcessed = 0;

            let csv = "\"Relative file path\",";
            csv += "\"File name\",";
            files[0].authors.forEach(function (author) {
                csv += "\"";
                csv += author.name;
                csv += "\","
            });
            csv += "\n";

            files.forEach(function (file) {
                let splitFilePath = file.name.split("/");
                let shortFileName = splitFilePath[splitFilePath.length - 1];
                csv += "\"";
                csv += file.name;
                csv += "\",\"";
                csv += shortFileName;
                csv += "\",";
                file.authors.forEach(function (author) {
                    csv += "\"";
                    csv += author.rows;
                    csv += "\",";
                    authorFilesProcessed++;
                });
                csv += "\n";

                if (authorFilesProcessed === authorFilesToProcess) {
                    resolve(csv);
                }
            });
        });
    });

}


function parseIntoContribGroupedByFile(responsibilities) {
    return new Promise(function (resolve, object) {

        let targetRowCount = 0;
        responsibilities.authors[0].author.forEach(function (author) {
            if (author.files[0].file.length !== undefined) {
                targetRowCount += author.files[0].file.length;
            } else {
                targetRowCount++;
            }
        });

        setupFileArray(responsibilities, targetRowCount).then(function (fileList) {

            let processedRows = 0;

            responsibilities.authors[0].author.forEach(function (author, authorIndex, authorsArr) {
                let authorName = author.name;
                author.files[0].file.forEach(function (file, fileIndex, filesArr) {
                    searchForMatchingFile(file.name["0"], fileList).then(function (index) {
                        if (index >= 0) {
                            fileList[index].authors[authorIndex].rows = file.rows;
                            processedRows++;
                        } else {
                            console.log("Error not found");
                        }

                        if (processedRows === targetRowCount) {
                            resolve(fileList);
                        }
                    });


                });
            });
        });
    });
}

function setupFileArray(responsibilities, targetRowCount) {
    return new Promise(function (resolve, object) {

        let processedRows = 0;
        let fileSet = [];

        let authorNames = [];

        responsibilities.authors[0].author.forEach(function (author) {
            authorNames.push(author.name);
        });

        responsibilities.authors[0].author.forEach(function (author, authorIndex, authorsArr) {
            author.files[0].file.forEach(function (file, fileIndex, filesArr) {
                searchForMatchingFile(file.name["0"], fileSet).then(function (index) {
                    processedRows++;
                    if (index === -1) {
                        let newFileObj = {};
                        newFileObj.name = file.name[0];
                        newFileObj.authors = [];
                        authorNames.forEach(function (authorName) {
                            let authorObj = {};
                            authorObj.name = authorName;
                            authorObj.rows = 0;
                            newFileObj.authors.push(authorObj);
                        });
                        fileSet.push(newFileObj);
                    }

                    if (processedRows === targetRowCount) {
                        removeDuplicatesFromArray(fileSet).then(function (fileSet) {
                            resolve(fileSet);
                        });
                    }
                });
            });
        });
    });

}

function removeDuplicatesFromArray(fileSet) {
    return new Promise(function (resolve, object) {


        let cleanFileList = [];

        let checkedFiles = 0;

        fileSet.forEach(function (file, fileIndex) {
            searchForMatchingFile(file.name, fileSet).then(function (index) {
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

function searchForMatchingFile(fileName, files) {
    return new Promise(function (resolve, object) {
            let names = files.map(function (file) {
                return file.name;
            });
            names.forEach(function (name, index) {
                if (name === fileName) {
                    resolve(index)
                }
            });
            resolve(-1);
        }
    );
}

module.exports.generate = generate;