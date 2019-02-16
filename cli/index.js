#!/usr/bin/env node

const chalk = require('chalk');

const SimpleStorage = require('../contracts/build/SimpleStorage.json');

console.log();
console.log(`${chalk.cyan('Loading contract data...')}`);
console.log();
console.log(`${SimpleStorage.contractName}`);
console.log();
console.log(`${JSON.stringify(SimpleStorage.abi)}`);
console.log();
console.log(`${chalk.cyan('Building JavaScript library...')}`);
console.log();
