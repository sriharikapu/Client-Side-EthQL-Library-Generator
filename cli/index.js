#!/usr/bin/env node

const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');

const SimpleStorage = require('../contracts/build/SimpleStorage.json');

// Set paths
const buildPath = 'cli/build';
const exportPath = 'client/src/lib';

// Load contract data
const loadContractData = () => {

  console.log();
  console.log(`${chalk.cyan('Loading contract data...')}`);
  console.log();

  console.log(`${SimpleStorage.contractName}`);
  console.log();
  console.log(`${JSON.stringify(SimpleStorage.abi)}`);
  console.log();

}

// Prepare JavaScript library
const prepareLibrary = () => {

  console.log(`${chalk.cyan('Preparing JavaScript library...')}`);
  console.log();

  // Create new directories
  fs.ensureDirSync(buildPath);
  fs.ensureDirSync(exportPath);

  // Define origin directory
  const origin = process.cwd();
  console.log('origin:', origin);
  console.log();

  // Define build directory
  const build = path.resolve(buildPath);
  console.log('build:', build);
  console.log();

  // Define library directory
  const library = path.resolve(exportPath);
  console.log('library:', library);
  console.log();

  // Make sure build directory is empty
  if (fs.readdirSync(build).length > 0) {
    console.log();
    console.log(chalk.red(`The ${buildPath} folder must be empty!`));
    console.log();
    process.exit(1);
  }

  // Make sure library directory is empty
  if (fs.readdirSync(library).length > 0) {
    console.log();
    console.log(chalk.red(`The ${exportPath} folder must be empty!`));
    console.log();
    process.exit(1);
  }

}

// Build JavaScript library
const buildLibrary = () => {

  console.log(`${chalk.cyan('Building JavaScript library...')}`);
  console.log();

  const exampleMethod = `// testing

export const testing = () => {

  return 'testing';

};
`;

  // Add library methods to build index
  fs.appendFile(`${buildPath}/index.js`, exampleMethod);

  // Copy build directory to library directory
  fs.copy(buildPath, exportPath);

}

// Execute methods
loadContractData();
prepareLibrary();
buildLibrary();
