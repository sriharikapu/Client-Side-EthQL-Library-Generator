const fs = require('fs-extra');

// make Promise version of fs.readdir()
fs.readdirAsync = function(dirname) {
  return new Promise(function(resolve, reject) {
    fs.readdir(dirname, function(err, filenames){
      if (err)
        reject(err);
      else
        resolve(filenames);
    });
  });
};

// make Promise version of fs.readFile()
fs.readFileAsync = function(filename, enc) {
  return new Promise(function(resolve, reject) {
    fs.readFile(filename, enc, function(err, data){
      if (err)
        reject(err);
      else
        resolve(data);
    });
  });
};

module.exports = fs;
