#!/usr/bin/env node
'use strict';

const inquirer = require('inquirer'),
  commands = require('./commands.js'),
  performance = require('./performance.js');

inquirer.prompt(commands).then( answers => { 
  performance(answers);
});
