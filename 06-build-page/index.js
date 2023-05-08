const fs = require('fs');
const path = require('path');

const headerPath = path.join(__dirname, 'components\\', 'header.html');
const articlesPath = path.join(__dirname, 'components\\', 'articles.html');
const footerPath = path.join(__dirname, 'components\\', 'footer.html');
const indexPath = path.join(__dirname, 'project-dist\\', 'index.html');
const templatePath = path.join(__dirname, 'template.html');
const projectDistPath = path.join(__dirname, 'project-dist');
const stylesDirPath = path.join(__dirname, 'styles');
const stylesDistPath = path.join(__dirname, 'project-dist\\', 'style.css');
const assetsDistPath = path.join(__dirname, 'project-dist\\', 'assets');
const assetsSourcePath = path.join(__dirname, 'assets');

fs.rm(projectDistPath, { recursive:true }, (err) => {
  if(err){
    return;
  }
});

fs.mkdir(projectDistPath, (err) => {
 
  fs.readFile(templatePath, 'utf8', (err, template) => {
    if (err) throw err;

  fs.readFile(headerPath, 'utf8', (err, header) => {
    if (err) throw err;

      template = template.replace('{{header}}', header);

      fs.readFile(articlesPath, 'utf8', (err, articles) => {
        if (err) throw err;

        template = template.replace('{{articles}}', articles);

        fs.readFile(footerPath, 'utf8', (err, footer) => {
          if (err) throw err;

          template = template.replace('{{footer}}', footer);

          fs.writeFile(indexPath, template, (err) => {
            if (err) throw err;
          });
        });
      });
    });
  });
});

const writeStream = fs.createWriteStream(stylesDistPath);

fs.unlink(stylesDistPath, (err) => {
  mergeStyles();
});

function mergeStyles() {
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

fs.rm(assetsDistPath, { recursive:true }, (err) => {
  if(err){
    return;
  }
});

copyDirectory(assetsSourcePath, assetsDistPath);