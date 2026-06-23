const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
  });
}

const target1 = `NEXT_PUBLIC_APPWRITE_DATABASE_ID || ""`;
const replacement1 = `NEXT_PUBLIC_APPWRITE_DATABASE_ID || "6a390e430024feb8df57"`;

const target2 = `NEXT_PUBLIC_APPWRITE_PAGES_COLLECTION_ID || "pages"`;
const replacement2 = `NEXT_PUBLIC_APPWRITE_PAGES_COLLECTION_ID || "pages"`; // this one is already "pages"

walk('./src', (filePath) => {
  if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    if (content.includes(target1)) {
      content = content.split(target1).join(replacement1);
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated ${filePath}`);
    }
  }
});
