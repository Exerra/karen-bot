const axios = require('axios')
require('dotenv').config()
const app = require("../bot.js");
const { log } = require('../modules/log.js');

module.exports = async (client, guild) => {

  // this event triggers when the bot is removed from a guild.
  log(`I have been removed from: ${guild.name} (id: ${guild.id})`, "info")

  let why = await (await fetch(`https://nekos.life/api/v2/why`)).json() // skipcq: JS-0128
}