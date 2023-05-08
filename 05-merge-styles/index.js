const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname, 'styles');
const bundleFilePath = path.join(__dirname, 'project-dist\\', 'bundle.css');

const writeStream = fs.createWriteStream(bundleFilePath);

fs.unlink(bundleFilePath, (err) => {
  mergeStyles();
});

function mergeStyles() {
  fs.readdir(sourceDir, (err, files) => {
    if (err) {
      console.error(err);
      return;
    }

    files.forEach((file) => {
      const filePath = path.join(sourceDir, file);
      const ext = path.extname(filePath);
      if (ext !== '.css') {
        return;
      }

      const readStream = fs.createReadStream(filePath);
      readStream.pipe(writeStream, { end: false });
    });
  });
}