/*
  This module provides a boilerplate for Error handling.
  It currently features these errors:
    - File doesn't exist
    - Environment variable doesn't exist

  It can (and will) be expanded with more errors and better logging, eventually sending (some) errors to the Karen Bot API for debugging purposes.

  - Written on 2021-08-20 by Exerra
*/


const chalk = require('chalk')

const throwError = (message, type) => {
  switch(type) {
    case 'fileDoesntExist':
      throw new Error (chalk.green(`${chalk.red.bold(message)}. Please go to ${chalk.blue.underline(`https://docs.karen.exerra.xyz/#/development/setupguide`)} to set up your local dev environment.`))
      break;
    case 'envVarDoesntExist':
      throw new Error (chalk.green(`${chalk.red.bold(`.env variable "${message}" does not exist.`)} Please go to ${chalk.blue.underline(`https://docs.karen.exerra.xyz/#/development/setupguide`)} to set up and fix your local dev environment.`))
      break;
  }
}

exports.throwError = throwError