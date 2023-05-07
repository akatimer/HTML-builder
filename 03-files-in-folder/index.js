const fs = require('fs');
const path = require('path');

const secretFolderPath = path.join(__dirname, 'secret-folder');

fs.readdir(secretFolderPath, (err, files) => {
  if (err) {
    console.error(err);
    return;
  }

  files.forEach((file) => {
    const filePath = path.join(secretFolderPath, file);
    fs.stat(filePath, (err, stats) => {
      if (err) {
        console.error(err);
        return;
      }
      if (stats.isFile()) {
        const fileSizeKb = stats.size / 1024;
        const fileExt = path.extname(file).substring(1);
        console.log(`${file} - ${fileExt} - ${fileSizeKb.toFixed(3)}kb`);
      }
    });
  });
});