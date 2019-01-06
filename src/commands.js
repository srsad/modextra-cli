'use strict';
const  fs = require('fs');

module.exports = [
  {
    type: 'input',
    name: 'project_name',
    message: 'Project name',
    default () {
      return 'modExtra';
    },
    validate: value => {
      value = value.replace(/\s/g, '')
      let error = true,
          message = '';

      if (value == undefined || value.length <= 0) { return 'Enter project name!'; }
      fs.readdirSync('.').forEach(file => { 
        if (value == file) { 
          error = false; 
          message = `Such folder "${value}" already exists!`
        } else if (value+'-master' == file) {
          error = false; 
          message = `Such folder "${value}-master" already exists!`
        }
      })
      return error === true ? error : message;
    }
  },
  {
    type: 'list',
    name: 'js_framework',
    message: 'Which version project to use?',
    choices: ['extjs 3.4', 'vue 2']
  },
  {
    type: 'confirm',
    name: 'rename',
    message: 'Rename items to project files?',
    default: true
  },
  {
    type: 'confirm',
    name: 'edit_php',
    message: 'Change the path to assets in home.class.php?',
    default (answers) {
      return answers.js_framework === 'vue 2' ? true : false;
    },
  },
  {
    type: 'input',
    name: 'autor',
    message: 'Autor',
    default () {
      return 'John Doe <john@doe.com>';
    }
  },
  //{
  //  type: 'list',
  //  name: 'license',
  //  message: 'License',
  //  choices: ['MIT', 'GNU', 'ISC']
  //},
];