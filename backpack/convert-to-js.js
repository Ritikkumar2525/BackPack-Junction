const fs = require('fs');
const glob = require('glob');
const babel = require('@babel/core');
const path = require('path');

const files = glob.sync('src/**/*.{ts,tsx}');

files.forEach(file => {
  const isTsx = file.endsWith('.tsx');
  const code = fs.readFileSync(file, 'utf8');
  const result = babel.transformSync(code, {
    filename: file,
    presets: [
      ['@babel/preset-typescript', { isTSX: isTsx, allExtensions: true }]
    ],
    plugins: [
      '@babel/plugin-syntax-jsx'
    ],
    retainLines: true,
  });

  const newExt = isTsx ? '.jsx' : '.js';
  const newFile = file.replace(/\.tsx?$/, newExt);
  
  fs.writeFileSync(newFile, result.code, 'utf8');
  fs.unlinkSync(file); // remove original file
  console.log(`Converted ${file} to ${newFile}`);
});
