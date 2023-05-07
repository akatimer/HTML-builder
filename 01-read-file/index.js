const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'text.txt') 

const read = fs.createReadStream(filePath, { encoding: 'utf8' });

read.on('data', function(chunk) {
  console.log(chunk);
});

read.on('error', function(error) {
  console.error(error);
});