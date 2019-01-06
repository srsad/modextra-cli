'use strict';
const Axios = require('axios'),
  fs = require ('fs-extra'),
  path = require('path'),
  admZip = require('adm-zip'),
  ora = require('ora'),
  replceBlock = require('./replceBlock');

let spinner = ora('');

class Preformnce {

  /**
   * Подготовка данных к скачиванию
   * @param repoName
   * @param autor
   * @returns {{repoName: *|string, zipFile: string, source: string, extractEntryTo: string}}
   */
  downloadConfig (repoName, autor) {
    repoName = repoName || 'modExtra';
    autor = autor || 'bezumkin';

    const href = `https://github.com/${autor}/${repoName}/archive`,
      zipFile = 'master.zip',
      source = `${href}/${zipFile}`, // ?download=1
      extractEntryTo = `${repoName}-master/`;

    return {repoName, zipFile, source, extractEntryTo};
  }

  /**
   * Скачивание
   * @param source - ссылка на архив
   * @param zipFile - назваие зип файла
   * @param extractEntryTo - куда выгрузить
   * @returns {boolean}
   */
  async download (source, zipFile, extractEntryTo) {
    const writer = fs.createWriteStream(zipFile);

    const response = await Axios({
      url: source,
      method: 'GET',
      responseType: 'stream'
    });

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', resolve)
      writer.on('error', reject)
    });
  }

  /**
   * Разархивирование
   * @param zipFile - назваие зип файла
   * @param extractEntryTo - имя записи
   * @param targetPath - куда выгрузить
   * @returns {*}
   */
  async unzip (zipFile, extractEntryTo, targetPath) {
    try {
      targetPath = targetPath || '.';
      let zip = new admZip(zipFile);
      spinner.start();
      return await zip.extractEntryTo(extractEntryTo, targetPath, true, false);
    } catch (error) {
        console.error('Unable to unzip');
        console.error(error);
    }
  }

  /**
   * Переименование файла/папки
   * @param oldName
   * @param newName
   */
  async rename (oldName, newName) {
    try {
      fs.renameSync(oldName, newName);
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * @param oldName
   * @param newName
   * @returns {*}
   */
  async renameItems (oldName, newName) {

    if (newName == undefined || newName.length <= 0) {
      console.error('New name not specified!');
      return false;
    }

    if (oldName !== newName) {await this.rename( `./${oldName}`, `./${newName}`); }

    let newNameLower = newName.toLowerCase(),
      oldNameLower = oldName.toLowerCase(),
      start = `./${newName}`;

    const walk = (start) => {
      let results = [],
        list = fs.readdirSync(start);
      const regModelFolder = new RegExp(oldNameLower);

      list.forEach(async (file) => {
          let fileName = file;
          file = start + '/' + file;

          let stat = fs.statSync(file);
          if (stat && stat.isDirectory()) { 

            if (fileName === oldNameLower) {
              await this.rename(start + path.sep + fileName, start + path.sep + newNameLower);
              results = results.concat(walk(start + path.sep + newNameLower));
            } else {
              results = results.concat(walk(file));
            }
          } else { 

            if (fileName.match(regModelFolder)) {
              file = start + path.sep + fileName.replace(oldNameLower, newNameLower);
              await this.rename(start + path.sep + fileName, file);
            }

            let content = fs.readFileSync(file, 'utf8');
            const oldReplaceName = [oldName, oldNameLower];
            const newReplaceName = [newName, newNameLower];

            for(let i=0; i<oldReplaceName.length; i++){
              let reg = new RegExp(oldReplaceName[i], "g");
              content = content.replace(reg, newReplaceName[i]);
              fs.writeFileSync(file, content)
            }

            if (fileName === 'home.class.php') {
              content = content.replace(`${newName}ManagerController`, 'modExtraManagerController');
              fs.writeFileSync(file, content)
            }
            results.push(file);
          }
      });
      return results;
    }

    if (newNameLower !== oldNameLower) { walk(start); }
  }

  /**
   * удаление папки
   * @param filePath
   */
  async removeFolder (filePath) {
    try {
      await fs.remove(filePath)
    } catch (err) {
      console.error(err)
    }
  }

  /**
   * Обновление home.class.php
   * @param replceBlock
   * @param jsFramework
   */
  async replaceHomePhp (replceBlock, jsFramework) {
      let homePath = './modExtra/core/components/modextra/controllers/home.class.php',
        content = fs.readFileSync(homePath, 'utf8');

      for (let key in replceBlock.original) {
        let repl = jsFramework === 'extjs 3.4' ? replceBlock.extjs[key] : replceBlock.vue[key];
        content = content.replace(replceBlock.original[key], repl);
      }

      fs.writeFileSync(homePath, content);
  }

  /**
   * Замена автора
   * @param autor
   */
  async replaceAutor (autor) {
      let autorPath = './modExtra/core/components/modextra/docs/readme.txt',
        content = fs.readFileSync(autorPath, 'utf8');
      
      content = content.replace('John Doe <john@doe.com>', autor);
      await fs.writeFileSync(autorPath, content);
  }

}


module.exports = async function (val) {

  spinner.start();
  const preformnce = new Preformnce(),
    projectName = val.project_name.replace(/\s/g, ''),
    projectNameLower = projectName.toLowerCase(),

    { repoName, zipFile, source, extractEntryTo } = await preformnce.downloadConfig();

  try {

    await preformnce.download(source, zipFile, extractEntryTo)
      .then( res => spinner.succeed('modExtra loaded'))
      .catch( error => {console.error(error); console.error(`Could not download archive ${source}`);})

    await preformnce.unzip(zipFile, extractEntryTo);
    await preformnce.removeFolder(zipFile);
    await preformnce.rename(`./${repoName}-master`, `./${repoName}`);

    if (val.js_framework === 'vue 2') {
      let vueConfig = await preformnce.downloadConfig('modExtraVueContent', 'srsad');
      let assetsPath = `./modExtra/assets/components/modextra/js/mgr`;
      preformnce.removeFolder(assetsPath); // удаление активоа

      await preformnce.download(vueConfig.source, vueConfig.zipFile, vueConfig.extractEntryTo) // сачиваем modExtraVueContent
        .then( res => spinner.succeed('modExtraVueContent loaded'))
        .catch( error => {console.error(error); console.error(`Could not download archive ${vueConfig.source}`);})

      await preformnce.unzip(vueConfig.zipFile, vueConfig.extractEntryTo, 'modExtra');
  
      await fs.copy(`./modExtra/modExtraVueContent-master/`, `./modExtra`) // сообщем о готовности modExtraVueContent
        .then(() => spinner.succeed('Preparing modExtraVueContent'))
        .catch(err => console.error(err));
      fs.mkdirSync(assetsPath); // создание mgr

      // удаление старых данных
      await preformnce.removeFolder(`./modExtra/modExtraVueContent-master/README.md`);
      await preformnce.removeFolder(`./modExtra/modExtraVueContent-master`);
      await preformnce.removeFolder(vueConfig.zipFile);
    }

    if (val.edit_php === true) { // замена home.class.php
      await preformnce.replaceHomePhp(replceBlock, val.js_framework); 
      spinner.succeed('home.class.php updated');
    }
    
    if (val.autor !== 'John Doe <john@doe.com>') { // установка автора
      preformnce.replaceAutor(val.autor);
      spinner.succeed(`Autor - ${val.autor}`);
    }

    if (val.rename === true) { // переименновывем
      await preformnce.renameItems(repoName, projectName); 
      spinner.succeed('Rename completed successfully');
    }

    spinner.stop();

    console.log('\x1b[43m%s\x1b[0m', ' Project created! ');

    console.log('\x1b[36m%s', `   cd ${projectName}`);
    console.log('\x1b[32m%s', `   build package by opening http://dev.site.com/${projectName}/_build/build.php \x1b[0m`);
    if (val.js_framework === 'vue 2') {
      console.log('\x1b[36m%s', '   npm i');
      console.log(`   npx vue-cli-service build --mode development --dest assets/components/${projectNameLower}/js/mgr --target app --watch \x1b[0m`);
    }
  } catch (error) {
      spinner.stop();
      console.error(error);
  }

  //console.log(JSON.stringify(val, null, '  '));
};
