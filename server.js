const express = require('express')
const chalk = require('chalk'); 
const { log } = require('./modules/log');
const app = express()
const port = process.env.PORT || 80;

app.get('/', (req, res) => {
  res.send('Karen Bot is up!')
})

app.listen(port, () => {
  console.log(chalk.magenta('[Karen Bot]'), chalk.yellow(`[Express]`), chalk.white('[Load]'), `Started an Express server on port ${port}`)
})