const { ShardingManager } = require('discord.js')
const config = require('./advanced_config.js')
const chalk = require('chalk')
const axios = require('axios')
require('dotenv').config()
const manager = new ShardingManager('./bot.js', {
  token: process.env.DISCORD_TOKEN,
  totalShards: 'auto',
  respawn: true,
  mode: "process"
})
const exec = require('child_process').execSync
const nodeSpotifyApi = require('node-spotify-api')

// These handlers are safe here
manager.on('shardCreate', shard => {
  console.log(chalk.blue(`[Shard]`), chalk.green(`[Launch]`),`Launched Shard With ID:`, chalk.green(`${shard.id}`))
  if(shard.manager.totalShards == shard.id + 1) {
    shard.on('ready', () => {
      if (process.env.VALIDATION == undefined) {
        axios.post(process.env.SHARD_WEBHOOK, {
          "content": null,
          "embeds": [
            {
              "title": `Shard ${shard.id} online`,
              "description": `Shard ${shard.id} is now online!`,
              "color": 11375103,
              "author": {
                "name": "Karen Bot",
                "icon_url": "https://karen.exerra.xyz/assets/BotLogoNoOutline.png"
              }
            }
          ],
          "username": "Karen Bot Shard",
          "avatar_url": "https://karen.exerra.xyz/assets/BotLogoNoOutline.png"
        })
      }
      /* exec(`curl -X POST -H "Content-Type: application/json" -d '{"value1": "Karen Bot is now online and ready to go!", "value2": "Karen Bot Started"}' process.env.IFFT_WEBHOOK`) */
    })
  }
  shard.on('message', (message) => {
    const shard = manager.shards.get(message.shard)
    switch(message.type) {
      case 'respawn':
        console.log(chalk.cyan(`Shard[${shard.id}]`), chalk.yellow(`Respawning...`))
        shard.respawn(9000, 40000)
        break
      case 'kill':
        console.log(chalk.cyan(`Shard[${shard.id}]`), chalk.hex(`#fc2d1e`)(`Killing...`))
    }
  })
})

manager.spawn(this.totalShards, 9000, 40000)
