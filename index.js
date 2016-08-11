const fs = require('fs');
const chalk = require('chalk');
const exec = require('child_process').execSync;

function getTime(file) {
  try {
    return fs.statSync(file).mtime;
  } catch (err) {
    return 0;
  }
}

function printWarning(text) {
  console.log(chalk.red('\n-------------------------------------------------'));
  console.log(chalk.yellow(chalk.bold('WARNING') + `: ${text}!`));
  console.log(chalk.red('-------------------------------------------------\n'));
}

function sayWarning(text) {
  try {
    if (process.platform === 'darwin') {
      exec('osascript -e "set Volume 5"');
      exec(`say "dude, ${text}"`, () => {});
    } else {
      exec('amixer set Master 100%');
      exec(`echo "dude, ${text}" | espeak`, () => {});
    }
  } catch (err) {}
}

module.exports = function warnOutdated(text) {
  const modulesTime = getTime('./node_modules');
  if (getTime('./package.json') > modulesTime || getTime('./npm-shrinkwrap.json') > modulesTime) {
    printWarning(text);
    sayWarning(text);
  }
}
