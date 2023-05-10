const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

const indexPath = path.join(__dirname, 'project-dist', 'index.html');
const templatePath = path.join(__dirname, 'template.html');
const projectDistPath = path.join(__dirname, 'project-dist');
const stylesDirPath = path.join(__dirname, 'styles');
const stylesDistPath = path.join(__dirname, 'project-dist', 'style.css');
const assetsDistPath = path.join(__dirname, 'project-dist', 'assets');
const assetsSourcePath = path.join(__dirname, 'assets');

async function removeDist(path) {
  const folderExists = await fsPromises.access(path)
    .then(() => true)
    .catch(() => false);

  if (folderExists) {
    const files = await fsPromises.readdir(path);

    await Promise.all(files.map(async (file) => {
      const currentPath = path + '/' + file;
      const isDirectory = await fsPromises.stat(currentPath).then(stat => stat.isDirectory());

      if (isDirectory) {
        await removeDist(currentPath);
      } else {
        await fsPromises.unlink(currentPath);
      }
    }));

    await fsPromises.rmdir(path);
  }
}

async function mergeIndex() {
  fs.mkdir(projectDistPath, (err) => {

    fs.readFile(templatePath, 'utf8', (err, template) => {
      if (err) throw err;

      fs.readdir(path.join(__dirname, 'components'), (err, files) => {
        if (err) throw err;
        let count = files.length;
        files.forEach((file) => {
          const sectionTag = `{{${path.basename(file, '.html')}}}`;
          const sectionPath = path.join(__dirname, 'components', file);

          fs.readFile(sectionPath, 'utf8', (err, sectionContent) => {
            if (err) throw err;

            template = template.replace(sectionTag, sectionContent);
            count--;
            if (count === 0) {
              fs.writeFile(indexPath, template, (err) => {
                if (err) throw err;
              });
            }
          });
        });
      });
    });
  });
}

async function mergeStyles() {
  const writeStream = fs.createWriteStream(stylesDistPath);
  fs.readdir(stylesDirPath, (err, files) => {
    if (err) {
      console.error(err);
      return;
    }

    files.forEach((file) => {
      const filePath = path.join(stylesDirPath, file);
      const ext = path.extname(filePath);
      if (ext !== '.css') {
        return;
      }

      const readStream = fs.createReadStream(filePath);
      readStream.pipe(writeStream, { end: false });
    });
  });
}

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

async function runTasks() {
  try {
    await removeDist(projectDistPath);
    await mergeIndex();
    await mergeStyles();
    await copyDirectory(assetsSourcePath, assetsDistPath);
    console.log('All tasks completed');
  } catch (err) {
    console.error('Error:', err);
  }
}

runTasks();