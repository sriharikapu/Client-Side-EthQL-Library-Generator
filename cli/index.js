#!/usr/bin/env node

const chalk = require('chalk');
const path = require('path');

const { ABIParser } = require('./lib/index');
const fs = require('./src/helpers/fs-extended');

const buildPath = '../cli/build';
const contractsPath = '../contracts/build';
const exportPath = '../client/src/lib';

// Load contract data
const loadContractData = async () => {

  console.log();
  console.log(`${chalk.cyan('Loading contract data...')}`);
  console.log();

  const contracts = await fs.readdirAsync(contractsPath).then(filenames => {
    const promises = [];
    filenames.map(filename => {
      promises.push(fs.readFileAsync(`${contractsPath}/${filename}`, 'utf-8'));
    });
    return Promise.all(promises).then(results => {
      const contracts = [];
      results.map(result => {
        contracts.push(JSON.parse(result));
      });
      return contracts;
    });
  });

  const parser = new ABIParser();

  contracts.map(contract => {

    const parsedContract = parser.constructor.parseABI(contract.abi);

    console.log('Parsed Contract:', JSON.stringify(parsedContract));
    console.log();

  });

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
(async () => {
  await loadContractData();
  prepareLibrary();
  buildLibrary();
})();
