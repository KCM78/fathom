#!/usr/bin/env node

const { resolve } = require('path');
const { readdirSync } = require('fs');
const { execSync } = require('child_process');
const chalk = require('chalk');

const inputPath = process.argv[2];
const latest = [];

function getDirs(dir) {
  const dirents = readdirSync(dir, { withFileTypes: true });
  const files = dirents.map((dirent) => {
    const res = resolve(dir, dirent.name);
    return dirent.isFile() && dirent.name === 'package.json' ? getDirs(res) : res;
  });
  return files.flat();
}

function runPrune(fpath) {
  return execSync(`cd ${fpath} && npm prune`);
}

function getOutdated(fpath) {
  return execSync(`cd ${fpath} && npm outdated --json`);
}

function runUpdate(fpath) {
  // return exec(`cd ${fpath} && npm update`);
  console.log(chalk`Updating dependencies for {blue ${fpath}}`);
}

function getLatest(packages) {
  packages.forEach((pkg) => {
    const pkgObj = {
      name: pkg.name,
      version: pkg.info.latest,
      location: pkg.info.location,
    };
    latest.push(pkgObj);
  });
}

function fathom() {
  const files = getDirs(inputPath);
  files.forEach((file) => {
    runPrune(file);
    const outdated = getOutdated(file);
    const json = JSON.parse(outdated);
    const ar = Object.keys(json).map((name) => ({ name, info: json[name] }));
    runUpdate(file);
    getLatest(ar);
  });
  console.log(chalk.red('There are major versions available. These will require manual updating:'));
  console.log(latest);
}

fathom();
