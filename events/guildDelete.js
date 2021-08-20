const axios = require('axios')
require('dotenv').config()
const app = require("../bot.js");

module.exports = async (client, guild) => {
  // this event triggers when the bot is removed from a guild.
  axios.post(`${process.env.API_SERVER}/karen/logs/`, {
    "content": `I have been removed from: ${guild.name} (id: ${guild.id})`,
    "type": 'info'
  })
  let why = await (await fetch(`https://nekos.life/api/v2/why`)).json() // skipcq: JS-0128
}