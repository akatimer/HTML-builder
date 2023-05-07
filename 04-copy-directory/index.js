const fs = require('fs');
const path = require('path');

const srcFilesDir = path.join(__dirname, 'files');
const destFilesCopyDir = path.join(__dirname, 'files-copy')


async function copyDirectory(source, destination) {
  await fs.promises.mkdir(destination, { recursive: true });
  const entries = await fs.promises.readdir(source, { withFileTypes: true });
  for (let entry of entries) {
    const sourceEntry = path.join(source, entry.name);
    const destinationEntry = path.join(destination, entry.name);
    if (entry.isDirectory()) {
      await copyDirectory(sourceEntry, destinationEntry);
    } else {
      await fs.promises.copyFile(sourceEntry, destinationEntry);
    }
  }
}

fs.rm(destFilesCopyDir, { recursive:true }, (err) => {
  if(err){
    return;
  }
});

copyDirectory(srcFilesDir, destFilesCopyDir);
