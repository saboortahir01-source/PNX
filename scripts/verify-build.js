#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

function findFiles(dir, exts) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const p = path.join(dir, item);
    const stat = fs.statSync(p);
    if (stat.isDirectory()) {
      results.push(...findFiles(p, exts));
    } else if (exts.includes(path.extname(item))) {
      results.push(p);
    }
  }
  return results;
}

function fail(msg) {
  console.error('BUILD VERIFY FAILED:', msg);
  process.exitCode = 1;
  process.exit(1);
}

// 1. server entry
const serverEntry = path.resolve('.output/server/index.mjs');
if (!fs.existsSync(serverEntry)) {
  fail(`Missing server entry at ${serverEntry}`);
}
console.log('Found server entry:', serverEntry);

// 2. public output dir
const publicDir = path.resolve('.output/public');
if (!fs.existsSync(publicDir)) {
  fail(`Missing .output/public directory at ${publicDir}`);
}
console.log('Found public dir:', publicDir);

// 3. CSS and JS
const cssFiles = findFiles(publicDir, ['.css']);
const jsFiles = findFiles(publicDir, ['.js']);
if (cssFiles.length === 0) {
  fail(`No CSS files found under ${publicDir}`);
}
if (jsFiles.length === 0) {
  fail(`No JS files found under ${publicDir}`);
}
console.log('Found CSS files:', cssFiles.slice(0,5));
console.log('Found JS files:', jsFiles.slice(0,5));

// 4. favicon/public images
const faviconCandidates = ['favicon.png','favicon.ico','apple-touch-icon.png','favicon.svg'];
const foundFavicons = faviconCandidates.filter(n => fs.existsSync(path.join(publicDir, n)));
const publicRootFiles = fs.readdirSync('public');
if (foundFavicons.length === 0 && !publicRootFiles.some(f => faviconCandidates.includes(f))) {
  fail('No favicon/public images found in public/ or .output/public');
}
console.log('Favicons present or copied.');

console.log('Build verification passed.');
process.exit(0);
