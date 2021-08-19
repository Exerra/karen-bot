const chalk = require('chalk')

const throwError = (message, type) => {
  switch(type) {
    case 'fileDoesntExist':
      throw new Error (`${chalk.red.bold(message)}. ${chalk.green(`Please go to ${chalk.blue.underline(`https://docs.karen.exerra.xyz/#/development/setupguide`)} to set up your local dev environment.`)}`)
      break;
    case 'envVarDoesntExist':
      throw new Error (`${chalk.red.bold(`.env variable "${message}" does not exist`)}. ${chalk.green(`Please go to ${chalk.blue.underline(`https://docs.karen.exerra.xyz/#/development/setupguide`)} to set up and fix your local dev environment.`)}`)
      break;
  }
}

exports.throwError = throwError