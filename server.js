const express = require('express')
const chalk = require('chalk') 
const app = express()
const port = 80

app.get('/', (req, res) => {
  res.send('Karen Bot is up!')
})

app.listen(port, () => {
  console.log(chalk.magenta('[Karen Bot]'), chalk.yellow(`[API]`), chalk.white('[Load]'), `Started the API on port ${port}`)
})