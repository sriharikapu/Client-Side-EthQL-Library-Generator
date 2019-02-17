#!/usr/bin/env node

const chalk = require('chalk');
const path = require('path');

const { ABIParser } = require('./lib/index');
const fs = require('./src/helpers/fs-extended');
const createFromTemplate = require('./src/templates/index')

// TEMP Set paths manually
const buildPath = '../cli/build';
const contractsPath = '../contracts/build';
const exportPath = '../client/src/lib';

// Script state
const state = {
  parsedContractData: null,
}

// Load contract data
const loadContractData = async () => {

  console.log();
  console.log(`${chalk.cyan('Loading contract data...')}`);
  console.log();

  // Return an array of contract data objects read from each contract file
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

  // Create parser instance
  const parser = new ABIParser();

  // Create parsed contract data array
  parsedContractDataArray = [];

  // For each contract data item
  contracts.map(contractData => {

    // Parse contract data
    const parsedContractData = parser.constructor.parseABI(contractData.abi);

    // TEMP Log parsed contract data
    console.log(contractData.contractName);
    console.log();
    console.log(JSON.stringify(parsedContractData));
    console.log();

    // Push contract data to parsed contract data array
    parsedContractDataArray.push({
      name: contractData.contractName,
      data: parsedContractData,
    });

  });

  // Return parsed contract data array
  return parsedContractDataArray;

}

// Prepare JavaScript library
const prepareLibrary = async () => {

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
const buildLibrary = async () => {

  console.log(`${chalk.cyan('Building JavaScript library...')}`);
  console.log();

  // Create library using template
  const library = createFromTemplate(parsedContractDataArray);

  // TEMP Log libary
  console.log(library);
  console.log();

  const ReplaceQueryTransform = await fs.readFileAsync('src/templates/ReplaceQueryTransform.js', 'utf-8');

  // Create index file in build and append library
  fs.appendFile(`${buildPath}/index.js`, library);
  fs.appendFile(`${buildPath}/ReplaceQueryTransform.js`, ReplaceQueryTransform);

}

// Export JavaScript library
const exportLibrary = async () => {

  // Copy build directory to library directory
  fs.copy(buildPath, exportPath);

}

// Execute methods
(async () => {
  await loadContractData();
  await prepareLibrary();
  await buildLibrary();
  await exportLibrary();
})();
