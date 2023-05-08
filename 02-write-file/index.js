const fs = require('fs');
const path = require('path');
const readline = require('readline');

const filePath = path.join(__dirname, 'text.txt');

const read = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

fs.writeFile(filePath, '', (err) => {
  if (err) throw err;
});

read.on('SIGINT', () => {
  console.log('\nПолучена команда завершения');
  read.close();
});

function newInput() {

  read.question('Введите текст: ', (input) => {
    if (input === 'exit') {
      console.log('Получена команда завершения');
      read.close();
      return;
    }

    fs.appendFile(filePath, input + '\n', (err) => {
      if (err) {
        console.error(err);
        return;
      }
      newInput();
    });
  });
}

newInput();