'use strict';

const fs = require('fs');
const scripts = ['controllers', 'core', 'models'];

for (let i = 0; i < scripts.length; i++) {
  fs.readdir(`./${scripts[i]}/`, function(err, files) {
    if (err) {
      return console.error(err);
    }
    files.forEach(function(file) {
      console.log(`Loading ${file}`);
      require(`./${scripts[i]}/${file}`);
    });
  });
}
