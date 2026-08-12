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

function findFilesContaining(dir, substr) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const p = path.join(dir, item);
    const stat = fs.statSync(p);
    if (stat.isDirectory()) {
      results.push(...findFilesContaining(p, substr));
    } else if (item.toLowerCase().includes(substr.toLowerCase())) {
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

// Utility: search multiple candidate dirs for files matching extensions
function gatherFiles(candidates, exts) {
  const files = [];
  for (const dir of candidates) {
    files.push(...findFiles(dir, exts));
  }
  return files;
}

// Candidate locations where client assets might be emitted
const candidates = [
  path.resolve('.output/public'),
  path.resolve('dist/client'),
  path.resolve('dist'),
  path.resolve('public'),
];

// 1. server entry
const serverEntry = path.resolve('.output/server/index.mjs');
if (!fs.existsSync(serverEntry)) {
  fail(`Missing server entry at ${serverEntry}`);
}
console.log('Found server entry:', serverEntry);

// 2. CSS and JS
const cssFiles = gatherFiles(candidates, ['.css']);
const jsFiles = gatherFiles(candidates, ['.js']);
if (cssFiles.length === 0) {
  fail(`No CSS files found under any of: ${candidates.join(', ')}`);
}
if (jsFiles.length === 0) {
  fail(`No JS files found under any of: ${candidates.join(', ')}`);
}
console.log('Found CSS files (sample):', cssFiles.slice(0,5));
console.log('Found JS files (sample):', jsFiles.slice(0,5));

// 3. favicon / manifest / public images
const manifestCandidates = candidates.map(c => path.join(c, 'manifest.webmanifest'));
const foundManifest = manifestCandidates.some(p => fs.existsSync(p)) || fs.existsSync(path.resolve('public/manifest.webmanifest'));
if (!foundManifest) {
  fail('Missing manifest.webmanifest in output public directories or public/');
}

const faviconNames = ['favicon.png','favicon.ico','apple-touch-icon.png','favicon.svg'];
let foundFavicon = false;
for (const base of candidates) {
  for (const n of faviconNames) {
    if (fs.existsSync(path.join(base, n))) foundFavicon = true;
  }
}
for (const n of faviconNames) {
  if (fs.existsSync(path.resolve('public', n))) foundFavicon = true;
}
if (!foundFavicon) {
  fail('No favicon/public images found in expected locations');
}
console.log('Favicons/manifest present.');

// 4. PNX logo and saboor-tahir
const foundPnxLogo = candidates.some(dir => findFilesContaining(dir, 'pnx-logo').length > 0) || findFilesContaining(path.resolve('src/assets'), 'pnx-logo').length > 0;
if (!foundPnxLogo) {
  fail('PNX logo (pnx-logo) not found in .output/public, dist, or src/assets');
}
console.log('Found PNX logo.');

const foundSaboor = candidates.some(dir => findFilesContaining(dir, 'saboor-tahir').length > 0) || fs.existsSync(path.resolve('public/saboor-tahir.png')) || fs.existsSync(path.resolve('public/saboor-tahir.jpg'));
if (!foundSaboor) {
  fail('saboor-tahir image not found in outputs or public/');
}
console.log('Found saboor-tahir image.');

console.log('Build verification passed.');
process.exit(0);
